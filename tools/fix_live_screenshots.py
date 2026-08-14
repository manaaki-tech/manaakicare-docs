#!/usr/bin/env python3
"""Crop browser chrome off screenshots that are already published.

Some of the screenshots on the live docs site were taken as full browser
windows. One of them (`case_worker/dashboard/my_active_cases.png`) captured the
photographer's own bookmarks bar along with an internal staging hostname in the
address bar — a real person's private information, on a public site.

Cropping rather than replacing is deliberate. The surrounding documentation
describes these screenshots in detail — column names, example reference numbers,
service names — so swapping in a newer screenshot would leave the prose
describing a picture that is no longer there. The leak is entirely above the
application viewport, so removing that strip fixes the problem and leaves every
existing sentence true.

Idempotent: an entry whose image is already shorter than the expected original
height is skipped, so re-running does not eat into the page content.

    python3 tools/fix_live_screenshots.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pngkit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# path relative to static/ -> (original height, pixels of chrome to remove, why)
CHROME = {
	'case_worker/dashboard/my_active_cases.png': (
		862,
		97,
		'Address bar showing an internal Azure staging host, plus a personal '
		'bookmarks bar with private mail and banking links.',
	),
}


def main():
	for rel, (expected_height, chrome, reason) in CHROME.items():
		path = os.path.join(ROOT, 'static', rel)
		if not os.path.exists(path):
			print(f'  ! {rel} not found')
			continue

		img = pngkit.read(path)
		if img.height != expected_height:
			print(f'  - {rel}: height {img.height}, expected {expected_height} — already done, skipping')
			continue

		cropped = pngkit.crop(img, (0, chrome, img.width, img.height - chrome))
		pngkit.write(path, cropped)
		print(f'  {rel}: {img.width}x{img.height} -> {cropped.width}x{cropped.height}')
		print(f'      removed: {reason}')


if __name__ == '__main__':
	main()
