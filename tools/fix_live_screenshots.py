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

# Every one of these shows the internal Azure Static Web Apps staging hostname
# in the address bar. Beyond that, two different people's browsers were used,
# and both had their bookmarks bar visible; several also show a profile
# photograph and the extensions they have installed.
#
# Three of the thirteen live screenshots are clean and are deliberately absent:
# intake_dashboard_overview.png, new_referrals_detail.png and
# tab_navigation.png were captured as the application only.
#
# path relative to static/ -> (original height, pixels of chrome to remove, why)
CHROME = {
	'case_worker/dashboard/my_active_cases.png': (
		862, 97,
		'Address bar with the staging host, plus a personal bookmarks bar '
		'reading as private mail and banking.',
	),
	'case_worker/dashboard/activites_needs_followup.png': (
		932, 110,
		'Same browser and same bookmarks bar as my_active_cases.',
	),
	'case_worker/dashboard/analytic.png': (
		473, 41,
		'Lower edge of the same bookmarks bar, already partly cropped by the '
		'original author.',
	),
	'intake_officer/dashboard/Analytic.png': (
		698, 68,
		'Address bar with the staging host; profile avatar.',
	),
	'intake_officer/dashboard/in_review_referral.png': (
		826, 69,
		'Address bar with the staging host; profile avatar.',
	),
	'intake_officer/dashboard/new_intake.png': (
		931, 68,
		'Address bar with the staging host; profile avatar.',
	),
	'intake_officer/dashboard/pending_service_review_referral.png': (
		715, 110,
		'Address bar with the staging host; profile avatar.',
	),
	'intake_officer/dashboard/post_dispatch_referral.png': (
		952, 66,
		'Address bar with the staging host; profile avatar.',
	),
	'supervisor/dashboard/analytic.png': (
		571, 104,
		'A second person\'s browser — address bar with the staging host, their '
		'bookmarks bar, their profile photograph and their installed extensions.',
	),
	'supervisor/dashboard/pending_referral_service_request.png': (
		642, 102,
		'Same second browser, same bookmarks bar and profile photograph.',
	),
	'supervisor/dashboard/service_needing_contact_and_pending_service_dispatch.png': (
		947, 109,
		'Same second browser, same bookmarks bar and profile photograph.',
	),
}


# Redactions applied AFTER cropping, so coordinates are in the cropped image.
# path relative to static/ -> (list of boxes, why)
REDACT = {
	'supervisor/dashboard/pending_referral_service_request.png': (
		[(368, 397, 90, 20)],
		'A real-format phone number printed under a client name.',
	),
	'supervisor/dashboard/service_needing_contact_and_pending_service_dispatch.png': (
		[(368, 66, 90, 20), (368, 584, 90, 20)],
		'The same phone number, twice.',
	),
}


def main():
	# Crop first — REDACT coordinates are measured on the cropped image.
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

	for rel, (boxes, reason) in REDACT.items():
		path = os.path.join(ROOT, 'static', rel)
		if not os.path.exists(path):
			print(f'  ! {rel} not found')
			continue
		img = pngkit.read(path)
		for box in boxes:
			pngkit.redact(img, box)
		pngkit.write(path, img)
		print(f'  {rel}: {len(boxes)} redacted')
		print(f'      removed: {reason}')


if __name__ == '__main__':
	main()
