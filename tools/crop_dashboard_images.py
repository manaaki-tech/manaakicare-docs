#!/usr/bin/env python3
"""Cut the Dashboards pages' screenshots out of full-screen captures.

The Dashboards pages carried a pre-launch screenshot set: superseded "Manaaki
Care" branding, raw database statuses shown as labels, and scratch data. Rather
than one capture per image, a handful of full-screen captures are cropped into
the regions each page actually talks about — so re-shooting one screen refreshes
several images at once.

SOURCES ARE NOT IN THIS REPO. They are full-screen captures that contain staff
names, and this repository is public. They live outside it:

    /home/amj/dev/.manaakicare-docs-screenshot-originals/2026-08-15/new-captures

Override with SCREENSHOT_SOURCES=/path if they are somewhere else. Same
arrangement as tools/build_manual_images.py, which reads .docx files that are
likewise not committed.

    python3 tools/crop_dashboard_images.py

Boxes are [x, y, width, height] in the SOURCE image's pixels, origin top-left.
REDACT boxes are applied before cropping, in the same coordinate space. Every
output is regenerated from scratch, so this is idempotent.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pngkit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC = os.path.join(ROOT, 'static')
SOURCES = os.environ.get(
	'SCREENSHOT_SOURCES',
	'/home/amj/dev/.manaakicare-docs-screenshot-originals/2026-08-15/new-captures',
)

CASELOAD = 'cw-dash-1.png'                    # 1391 x 550
ACTIVE = 'cw-dash-active-cases.png'           # 1099 x 727
FOLLOWUP = 'cw-dash-act-need-follow-up.png'   # 1097 x 222
INTAKE = 'intake-dash-clean.png'              #  957 x 916
TEAM = 'manager-dash-multiservice..png'       # 1653 x 854

# Painted out before cropping, because the repo is public and these are real
# colleagues rather than client fixtures. Boxes are in source coordinates;
# `sample` names where to take the fill colour from when the default (just left
# of the box) would land on something other than the row background.
REDACT = {
	TEAM: [
		# "Keriana Fox" in the Case Worker column of Service Users Needing Contact.
		([1100, 818, 110, 26], None),
	],
}

# (source, box, destination, what it is)
CROPS = [
	(
		# The left-hand nav is cropped off: it is the whole application's menu,
		# documented elsewhere, and it drags a dark sidebar into an image the
		# page uses to talk about tiles.
		CASELOAD, [285, 152, 1092, 144],
		'img/dashboards/case-worker/analytics.png',
		'The four count tiles.',
	),
	(
		ACTIVE, [60, 14, 1039, 713],
		'img/dashboards/case-worker/my-active-cases.png',
		'The assigned-work table, all ten rows, with its column headings.',
	),
	(
		FOLLOWUP, [45, 0, 1052, 222],
		'img/dashboards/case-worker/activities-needing-follow-up.png',
		'The follow-up table, including the Priority and Risk columns.',
	),
	(
		INTAKE, [60, 66, 880, 232],
		'img/dashboards/intake-officer/overview.png',
		'Title, subtitle and the three status tiles.',
	),
	(
		INTAKE, [75, 338, 865, 60],
		'img/dashboards/intake-officer/tabs.png',
		'The tab strip, which the reference page documents tab by tab.',
	),
	(
		INTAKE, [75, 398, 865, 470],
		'img/dashboards/intake-officer/new-referrals.png',
		'Filters, columns and the list of entries at the selected stage.',
	),
	(
		TEAM, [28, 228, 1600, 200],
		'img/dashboards/supervisor/analytics.png',
		'The three count tiles and the month-to-date figures beneath them.',
	),
	(
		TEAM, [28, 440, 1600, 228],
		'img/dashboards/supervisor/pending-requests.png',
		'Referral requests waiting on an accept or reject decision.',
	),
	(
		TEAM, [28, 680, 1600, 172],
		'img/dashboards/supervisor/needing-contact.png',
		'Service users nobody has been in touch with recently.',
	),
]


def main():
	if not os.path.isdir(SOURCES):
		raise SystemExit(
			f'source captures not found at {SOURCES}\n'
			f'set SCREENSHOT_SOURCES=/path/to/captures'
		)

	cache = {}
	for name in {c[0] for c in CROPS}:
		path = os.path.join(SOURCES, name)
		if not os.path.exists(path):
			raise SystemExit(f'missing source: {path}')
		img = pngkit.read(path)
		for box, sample in REDACT.get(name, []):
			pngkit.redact(img, box, sample=sample)
			print(f'  redacted {box} in {name}')
		cache[name] = img

	for source, box, dest, what in CROPS:
		img = cache[source]
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
