"""Minimal PNG read/write/edit, standard library only.

This machine has no Pillow, ImageMagick, pandoc or LibreOffice, and no pip to
install them. The manual's screenshots still need three things done to them
before they can be published:

  - redaction, because the source screenshots carry a real customer's
    organisation name, staff names and a work email address
  - cropping, to cut junk test data and OS chrome out of otherwise good shots
  - downscaling, because several shots are far wider than the docs column

Doing the redaction in CSS instead was rejected deliberately: an overlay leaves
the original bytes sitting in `static/`, one right-click away. Redaction has to
change pixels.

Scope is exactly what the source files need and no more: 8-bit, non-interlaced,
colour type 2 (RGB) or 6 (RGBA). Anything else raises. Interlaced PNGs, 16-bit
samples and palettes are not supported because none of the 38 inputs use them.
"""

import struct
import zlib

PNG_SIG = b'\x89PNG\r\n\x1a\n'


class Image:
	"""An 8-bit RGB or RGBA raster held as a flat bytearray."""

	def __init__(self, width, height, channels, pixels):
		self.width = width
		self.height = height
		self.channels = channels
		self.pixels = pixels

	@property
	def stride(self):
		return self.width * self.channels

	def pixel(self, x, y):
		i = y * self.stride + x * self.channels
		return tuple(self.pixels[i:i + self.channels])


def _paeth(a, b, c):
	p = a + b - c
	pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
	if pa <= pb and pa <= pc:
		return a
	return b if pb <= pc else c


def read(path):
	with open(path, 'rb') as fh:
		data = fh.read()

	if data[:8] != PNG_SIG:
		raise ValueError(f'{path}: not a PNG')

	width = height = channels = None
	idat = bytearray()
	pos = 8

	while pos < len(data):
		(length,) = struct.unpack('>I', data[pos:pos + 4])
		kind = data[pos + 4:pos + 8]
		body = data[pos + 8:pos + 8 + length]
		pos += 12 + length

		if kind == b'IHDR':
			width, height, depth, colour, _comp, _filt, interlace = struct.unpack('>IIBBBBB', body)
			if depth != 8:
				raise ValueError(f'{path}: bit depth {depth} unsupported (need 8)')
			if interlace:
				raise ValueError(f'{path}: interlaced PNGs unsupported')
			if colour == 2:
				channels = 3
			elif colour == 6:
				channels = 4
			else:
				raise ValueError(f'{path}: colour type {colour} unsupported (need 2 or 6)')
		elif kind == b'IDAT':
			idat += body
		elif kind == b'IEND':
			break

	raw = zlib.decompress(bytes(idat))
	stride = width * channels
	out = bytearray(height * stride)
	prev = bytearray(stride)
	src = 0

	for y in range(height):
		ftype = raw[src]
		src += 1
		line = bytearray(raw[src:src + stride])
		src += stride

		if ftype == 1:
			for i in range(channels, stride):
				line[i] = (line[i] + line[i - channels]) & 0xFF
		elif ftype == 2:
			for i in range(stride):
				line[i] = (line[i] + prev[i]) & 0xFF
		elif ftype == 3:
			for i in range(stride):
				left = line[i - channels] if i >= channels else 0
				line[i] = (line[i] + ((left + prev[i]) >> 1)) & 0xFF
		elif ftype == 4:
			for i in range(stride):
				left = line[i - channels] if i >= channels else 0
				upleft = prev[i - channels] if i >= channels else 0
				line[i] = (line[i] + _paeth(left, prev[i], upleft)) & 0xFF
		elif ftype != 0:
			raise ValueError(f'{path}: bad filter type {ftype} on row {y}')

		out[y * stride:(y + 1) * stride] = line
		prev = line

	return Image(width, height, channels, out)


def write(path, img, level=9):
	"""Encode and save.

	Each scanline is tried with the None and Up filters and the one with the
	smaller sum of absolute differences wins — the standard cheap heuristic.
	Up does most of the work on UI screenshots, where colour tends to repeat
	down a column far more than across a row.
	"""
	stride = img.stride
	raw = bytearray()
	prev = bytearray(stride)

	for y in range(img.height):
		line = img.pixels[y * stride:(y + 1) * stride]
		up = bytearray((line[i] - prev[i]) & 0xFF for i in range(stride))

		if sum(b if b < 128 else 256 - b for b in up) < sum(b if b < 128 else 256 - b for b in line):
			raw.append(2)
			raw += up
		else:
			raw.append(0)
			raw += line

		prev = line

	colour = 2 if img.channels == 3 else 6
	ihdr = struct.pack('>IIBBBBB', img.width, img.height, 8, colour, 0, 0, 0)

	def chunk(kind, body):
		return (struct.pack('>I', len(body)) + kind + body
		        + struct.pack('>I', zlib.crc32(kind + body) & 0xFFFFFFFF))

	blob = (PNG_SIG + chunk(b'IHDR', ihdr)
	        + chunk(b'IDAT', zlib.compress(bytes(raw), level))
	        + chunk(b'IEND', b''))

	with open(path, 'wb') as fh:
		fh.write(blob)


def fill(img, box, colour):
	"""Paint a solid rectangle. `box` is (x, y, w, h); `colour` is an RGB tuple."""
	x, y, w, h = box
	x, y = max(0, x), max(0, y)
	w = min(w, img.width - x)
	h = min(h, img.height - y)
	if w <= 0 or h <= 0:
		return img

	px = bytes(colour[:3]) + (b'\xff' if img.channels == 4 else b'')
	row = px * w

	for yy in range(y, y + h):
		start = yy * img.stride + x * img.channels
		img.pixels[start:start + w * img.channels] = row

	return img


def redact(img, box, sample=None):
	"""Erase a rectangle by painting it the colour of the surrounding surface.

	A black bar announces "something was hidden here" and drags the reader's
	attention to the one part of the screenshot we don't want them studying.
	Painting the panel's own background colour instead just leaves an empty
	panel, which is what an unassigned or freshly-created record looks like
	anyway.

	`sample` is an (x, y) to take the colour from; it defaults to a point just
	left of the box, which on these screenshots is reliably panel background.
	"""
	x, y, w, h = box
	sx, sy = sample if sample else (max(0, x - 6), y + h // 2)
	return fill(img, box, img.pixel(sx, sy))


def crop(img, box):
	x, y, w, h = box
	x, y = max(0, x), max(0, y)
	w = min(w, img.width - x)
	h = min(h, img.height - y)
	out = bytearray(w * h * img.channels)
	rowbytes = w * img.channels

	for yy in range(h):
		src = (y + yy) * img.stride + x * img.channels
		out[yy * rowbytes:(yy + 1) * rowbytes] = img.pixels[src:src + rowbytes]

	return Image(w, h, img.channels, out)


def scale_to_width(img, target):
	"""Box-filter downscale to `target` px wide, preserving aspect ratio.

	Box averaging rather than nearest-neighbour: these are screenshots of small
	UI text, and nearest-neighbour drops whole strokes off glyphs and makes
	labels unreadable at exactly the sizes we need.
	"""
	if target >= img.width:
		return img

	height = max(1, round(img.height * target / img.width))
	ch = img.channels
	out = bytearray(target * height * ch)

	xs = [(x * img.width // target, max((x + 1) * img.width // target, x * img.width // target + 1))
	      for x in range(target)]

	for y in range(height):
		y0 = y * img.height // height
		y1 = max((y + 1) * img.height // height, y0 + 1)
		base = y * target * ch

		for x, (x0, x1) in enumerate(xs):
			n = (y1 - y0) * (x1 - x0)
			sums = [0] * ch

			for yy in range(y0, y1):
				row = yy * img.stride
				for xx in range(x0, x1):
					i = row + xx * ch
					for c in range(ch):
						sums[c] += img.pixels[i + c]

			o = base + x * ch
			for c in range(ch):
				out[o + c] = sums[c] // n

	return Image(target, height, ch, out)
