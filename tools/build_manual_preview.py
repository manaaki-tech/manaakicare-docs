#!/usr/bin/env python3
"""Render the built manual into one self-contained HTML page for review.

The docs site is not reachable from a phone until it is deployed, and the whole
point of a review is to read the manual the way a reader will. This pulls the
already-built markup out of `build/manual/*/index.html`, inlines every
screenshot as a data URI, and writes a single file that can be published as an
Artifact and opened anywhere.

Run `npm run build` first, then:

    python3 tools/build_manual_preview.py
"""

import base64
import html
import os
import re
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, 'build', 'manual')
STATIC = os.path.join(ROOT, 'static')
OUT = os.path.join(ROOT, 'build', 'manual-preview.html')

# Sidebar order, which is the reading order.
PAGES = [
	'start-here',
	'signing-in',
	'finding-your-way-around',
	'your-day-at-a-glance',
	'taking-on-someone-new',
	'working-with-someone',
	'writing-up-what-you-did',
	'staying-on-top-of-deadlines',
	'finishing-up',
	'when-something-looks-wrong',
]


class ArticleExtractor(HTMLParser):
	"""Pulls out the <div class="theme-doc-markdown markdown"> subtree."""

	def __init__(self):
		super().__init__(convert_charrefs=False)
		self.depth = 0
		self.capturing = False
		self.parts = []

	def handle_starttag(self, tag, attrs):
		attrs = dict(attrs)
		if not self.capturing:
			if tag == 'div' and 'theme-doc-markdown' in (attrs.get('class') or ''):
				self.capturing = True
				self.depth = 1
			return

		if tag == 'div':
			self.depth += 1

		rendered = ' '.join(f'{k}="{html.escape(v or "", quote=True)}"' for k, v in attrs.items())
		self.parts.append(f'<{tag}{" " + rendered if rendered else ""}>')

	def handle_startendtag(self, tag, attrs):
		if not self.capturing:
			return
		rendered = ' '.join(f'{k}="{html.escape(v or "", quote=True)}"' for k, v in attrs.items())
		self.parts.append(f'<{tag} {rendered}/>')

	def handle_endtag(self, tag):
		if not self.capturing:
			return
		if tag == 'div':
			self.depth -= 1
			if self.depth == 0:
				self.capturing = False
				return
		self.parts.append(f'</{tag}>')

	def handle_data(self, data):
		if self.capturing:
			self.parts.append(data)

	def handle_entityref(self, name):
		if self.capturing:
			self.parts.append(f'&{name};')

	def handle_charref(self, name):
		if self.capturing:
			self.parts.append(f'&#{name};')

	def result(self):
		return ''.join(self.parts)


def inline_images(markup):
	"""Swap every /img/... src for a data URI so the page stands alone."""
	cache = {}

	def swap(match):
		path = match.group(1)
		if path not in cache:
			disk = os.path.join(STATIC, path.lstrip('/'))
			if not os.path.exists(disk):
				print(f'  ! missing {path}')
				cache[path] = path
			else:
				with open(disk, 'rb') as fh:
					cache[path] = 'data:image/png;base64,' + base64.b64encode(fh.read()).decode()
		return f'src="{cache[path]}"'

	return re.sub(r'src="(/img/[^"]+)"', swap, markup)


def strip_internal_links(markup):
	"""Turn in-site links into plain text — they go nowhere in a single file."""
	markup = re.sub(r'<a\b[^>]*\bhref="/[^"]*"[^>]*>', '<span class="xlink">', markup)
	return markup.replace('</a>', '</span>')


def main():
	if not os.path.isdir(BUILD):
		raise SystemExit('build/manual not found — run `npm run build` first')

	sections = []
	for slug in PAGES:
		path = os.path.join(BUILD, slug, 'index.html')
		if not os.path.exists(path):
			print(f'  ! no build output for {slug}')
			continue

		with open(path, encoding='utf-8') as fh:
			parser = ArticleExtractor()
			parser.feed(fh.read())

		markup = parser.result()
		if not markup.strip():
			print(f'  ! extracted nothing from {slug}')
			continue

		# Screenshots link to themselves; in a single file that just reopens the
		# data URI, which is fine, but the image links must survive the strip.
		markup = inline_images(markup)
		markup = re.sub(r'<a\b[^>]*\bhref="/img/[^"]*"[^>]*>', '<span class="shot">', markup)
		markup = strip_internal_links(markup)

		sections.append(f'<section id="{slug}">{markup}</section>')
		print(f'  {slug}')

	nav = '\n'.join(
		f'<li><a href="#{slug}">{slug.replace("-", " ")}</a></li>' for slug in PAGES
	)

	with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'preview.css')) as fh:
		css = fh.read()

	page = f"""<title>Manual Draft Read-Through</title>
<style>{css}</style>
<div class="wrap">
<header>
  <p class="eyebrow">Draft for review · not published</p>
  <h1>Manual Draft Read-Through</h1>
  <p class="standfirst">All ten pages of the new User Manual section, in reading order,
  exactly as they render on the site. Screenshots are embedded, so this works offline.</p>
  <nav><ol>{nav}</ol></nav>
</header>
{''.join(sections)}
</div>"""

	with open(OUT, 'w', encoding='utf-8') as fh:
		fh.write(page)

	print(f'\n{len(sections)} pages -> {OUT}  ({os.path.getsize(OUT) // 1024}KB)')


if __name__ == '__main__':
	main()
