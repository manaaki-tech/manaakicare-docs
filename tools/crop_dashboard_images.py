#!/usr/bin/env python3
"""Cut the reference sections' dashboard images out of the manual screenshots.

The Dashboards pages carried a pre-launch screenshot set: superseded "Manaaki
Care" branding, raw database statuses shown as labels, and scratch data. Most of
what they need is already visible in two current-build screenshots captured for
the manual, so those regions are cropped out rather than re-captured.

Not everything can come from here. The case worker's "Activities Needing
Follow-up" table and all three supervisor dashboard images appear in no current
screenshot, and still need fresh captures.

    python3 tools/crop_dashboard_images.py

Boxes are [x, y, width, height] in the SOURCE image's pixels, origin top-left.
Re-run after replacing a source image; every output is regenerated from scratch,
so this is idempotent.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pngkit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC = os.path.join(ROOT, 'static')

INTAKE = 'img/manual/dashboard/intake-dashboard.png'   # 800 x 833
CASELOAD = 'img/manual/dashboard/my-caseload.png'      # 1360 x 763

# (source, box, destination, what it is)
# NOTHING FROM intake-dashboard.png YET.
#
# It would supply all three intake images — the overview, the drill-down list
# and the tab strip — except that it carries hand-drawn red annotations from the
# manual: a ring around the "Entry Processing" tile and a box around the first
# two tabs. Those mean something beside the manual's prose and nothing beside
# the reference page's, where an unexplained red ring reads as a mistake. They
# also cannot be painted out, since the ring crosses a gradient-filled tile.
#
# One clean re-capture of the intake dashboard unblocks all three. Until then
# the intake page keeps its outdated images.
#
# (source, box, destination, what it is)
CROPS = [
	(
		# The left-hand nav is cropped off: it is the whole application's menu,
		# documented elsewhere, and it drags the dark sidebar into an image the
		# page uses to talk about tiles. The last few pixels go too — they catch
		# the window's scrollbar.
		CASELOAD, [265, 148, 1078, 170],
		'img/dashboards/case-worker/analytics.png',
		'The four count tiles.',
	),
	(
		# Height stops at the second row's lower border rather than running to
		# the foot of the source, which would end on a half-drawn third row.
		CASELOAD, [265, 520, 1078, 230],
		'img/dashboards/case-worker/my-active-cases.png',
		'The assigned-work table with its column headings.',
	),
]


def main():
	for source, box, dest, what in CROPS:
		src_path = os.path.join(STATIC, source)
		if not os.path.exists(src_path):
			raise SystemExit(f'missing source: {src_path}')

		img = pngkit.read(src_path)
		x, y, w, h = box
		if x + w > img.width or y + h > img.height:
			raise SystemExit(
				f'{dest}: box {box} falls outside {source} ({img.width}x{img.height})'
			)

		out = pngkit.crop(img, box)
		out_path = os.path.join(STATIC, dest)
		os.makedirs(os.path.dirname(out_path), exist_ok=True)
		pngkit.write(out_path, out)
		print(f'  {out.width:>5} x {out.height:<5} {dest}')
		print(f'  {"":>13} {what}')


if __name__ == '__main__':
	main()
