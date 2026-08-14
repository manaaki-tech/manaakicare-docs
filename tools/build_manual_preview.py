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
# Deliberately NOT inside build/ — `docusaurus build` wipes that directory, so
# a preview written there disappears the next time anyone builds.
OUT = os.path.join(ROOT, 'manual-preview.html')

# Sidebar order, which is the reading order. Grouped by role, so a reviewer
# reads each role's sequence the way that role will.
PAGES = [
	'start-here',
	'everyone/signing-in',
	'everyone/finding-your-way-around',
	'everyone/when-something-looks-wrong',
	'case-worker/what-you-can-do',
	'case-worker/your-day-at-a-glance',
	'case-worker/working-with-someone',
	'case-worker/writing-up-what-you-did',
	'case-worker/staying-on-top-of-deadlines',
	'case-worker/finishing-up',
	'intake-officer/what-you-can-do',
	'intake-officer/your-day-at-a-glance',
	'intake-officer/taking-on-someone-new',
	'supervisor/what-you-can-do',
	'supervisor/moving-work-between-staff',
	'program-manager/what-you-can-do',
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


def strip_anchors(markup):
	"""Replace every <a> with a <span>, leaving no anchor unclosed.

	Links go nowhere useful in a single self-contained file, so they become
	spans. The rule that matters is that EVERY opening tag is rewritten, not
	just the ones pointing at doc routes: the closing tags are rewritten
	wholesale, so any anchor left behind ends up unclosed.

	That is not a cosmetic problem. Docusaurus emits a "Direct link to
	heading" anchor after every heading, carrying class `hash-link`, which the
	stylesheet hides. An unclosed hidden anchor adopts the rest of the section
	as its children and hides all of it — which is exactly how an earlier
	version of this file rendered as a nearly blank page.

	The heading anchors are removed outright rather than converted; they are
	navigation furniture with nothing to point at here.
	"""
	markup = re.sub(
		r'<a[^>]*class="[^"]*hash-link[^"]*"[^>]*>.*?</a>', '', markup, flags=re.S
	)
	markup = re.sub(r'<a\b[^>]*>', '<span class="xlink">', markup)
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

		markup = inline_images(markup)
		# The screenshot's own wrapper link, tagged before the generic sweep so
		# it keeps its framing style.
		markup = re.sub(r'<a\b[^>]*\bhref="/img/[^"]*"[^>]*>', '<span class="shot">', markup)
		markup = strip_anchors(markup)

		opened = len(re.findall(r'<a\b', markup))
		closed = len(re.findall(r'</a>', markup))
		if opened or closed:
			print(f'  ! {slug}: {opened} unclosed <a>, {closed} stray </a> — page will render wrong')

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
