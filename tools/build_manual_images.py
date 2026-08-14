#!/usr/bin/env python3
"""Turn the three supplied .docx files into the manual's screenshot library.

Run from the repo root:

    python3 tools/build_manual_images.py

The .docx files are ZIP archives, so the images come straight out of
`word/media/` with the standard library — no pandoc or LibreOffice needed.
What the sources give us is `image7.png`, which tells a future maintainer
nothing, so everything is renamed for the step it illustrates.

Two images from the sources are deliberately dropped, see EXCLUDED below.

Redaction boxes live in `manual_redactions.json` next to this file. They are
applied to real pixels, not overlaid in CSS, because the published PNG is one
right-click away from any reader.
"""

import json
import os
import sys
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pngkit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE_DIR = os.path.join(ROOT, 'ScreenshotsForUserManual')
DEST_ROOT = os.path.join(ROOT, 'static', 'img', 'manual')
REDACTIONS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'manual_redactions.json')

# Twice the ~800px docs content column, so the images stay sharp on the laptops
# these readers actually use. Anything already narrower is left alone — upscaling
# a screenshot only makes it blurrier.
MAX_WIDTH = 1600

INTAKE = 'Screenshots_MC_Intake'
CASE = 'CaseManagement_Overview_Compliance_Closure'
ACTIVITIES = 'Screenshots_Activities'

# (source doc, source image, destination path under static/img/manual/, redaction key)
MANIFEST = [
	(INTAKE, 'image2',  'navigation/left-menu.png',              None),
	(INTAKE, 'image1',  'dashboard/intake-dashboard.png',        None),
	(ACTIVITIES, 'image1', 'dashboard/my-caseload.png',          'act-1'),

	(INTAKE, 'image3',  'intake/01-choose-service.png',          None),
	(INTAKE, 'image4',  'intake/02-search-for-someone.png',      None),
	(INTAKE, 'image5',  'intake/03-add-a-new-person.png',        None),
	(INTAKE, 'image6',  'intake/04-entry-details.png',           None),
	(INTAKE, 'image7',  'intake/05-referrer-and-risk.png',       None),
	(INTAKE, 'image8',  'intake/06-add-a-guardian.png',          None),
	(INTAKE, 'image9',  'intake/07-how-consent-was-given.png',   None),
	(INTAKE, 'image10', 'intake/08-upload-a-document.png',       None),
	(INTAKE, 'image11', 'intake/09-consent-checklist.png',       'intake-11'),
	(INTAKE, 'image12', 'intake/10-send-for-approval.png',       None),
	(INTAKE, 'image13', 'intake/11-accept-the-entry.png',        None),
	(INTAKE, 'image14', 'intake/12-accept-and-assign.png',       'intake-14'),
	(INTAKE, 'image15', 'intake/13-submitted.png',               None),
	(INTAKE, 'image17', 'intake/14-intake-info.png',             None),
	(INTAKE, 'image18', 'intake/15-family-background.png',       None),
	(INTAKE, 'image19', 'intake/16-support-network.png',         None),
	(INTAKE, 'image20', 'intake/17-add-a-contact.png',           None),
	(INTAKE, 'image21', 'intake/18-edit-a-contact.png',          None),

	(INTAKE, 'image16', 'journey/01-overview.png',               'intake-16'),
	(INTAKE, 'image22', 'journey/02-person-header.png',          'intake-22'),
	(CASE,   'image1',  'journey/03-overview-tour.png',          'cm-1'),
	(CASE,   'image2',  'journey/04-actions-menu.png',           None),
	(CASE,   'image4',  'journey/05-manage-staff.png',           'cm-4'),
	(CASE,   'image5',  'journey/06-add-a-staff-member.png',     None),
	(CASE,   'image6',  'journey/07-service-fields.png',         None),

	(CASE,   'image7',  'compliance/01-compliance-panel.png',    None),
	(CASE,   'image3',  'closure/01-close-the-journey.png',      None),

	(ACTIVITIES, 'image3', 'activities/01-activities-tab.png',   'act-3'),
	(ACTIVITIES, 'image4', 'activities/02-activity-log.png',     'act-4'),
	(ACTIVITIES, 'image5', 'activities/03-essentials.png',       None),
	(ACTIVITIES, 'image6', 'activities/04-remote.png',           None),
	(ACTIVITIES, 'image7', 'activities/05-notes.png',            None),
	(ACTIVITIES, 'image8', 'activities/06-templates.png',        'act-8'),
]

# Not published, and why.
EXCLUDED = {
	(INTAKE, 'image23'): 'Windows "open with" app picker — an OS dialog listing the '
	                     'tester\'s installed apps, not product UI, and in dark chrome '
	                     'against an otherwise light-themed manual.',
	(ACTIVITIES, 'image2'): 'Byte-identical duplicate of CaseManagement image1, already '
	                        'published as journey/03-overview-tour.png.',
}


def load_media(doc):
	path = os.path.join(SOURCE_DIR, f'{doc}.docx')
	with zipfile.ZipFile(path) as zf:
		return {
			os.path.basename(n).rsplit('.', 1)[0]: zf.read(n)
			for n in zf.namelist()
			if n.startswith('word/media/')
		}


def main():
	redactions = {}
	if os.path.exists(REDACTIONS):
		with open(REDACTIONS) as fh:
			redactions = json.load(fh)
	else:
		print(f'! {os.path.basename(REDACTIONS)} not found — writing images UNREDACTED')

	cache = {}
	tmp = os.path.join(DEST_ROOT, '.tmp-source.png')
	os.makedirs(DEST_ROOT, exist_ok=True)

	written = redacted = scaled = 0

	for doc, name, dest, key in MANIFEST:
		if doc not in cache:
			cache[doc] = load_media(doc)

		out_path = os.path.join(DEST_ROOT, dest)
		os.makedirs(os.path.dirname(out_path), exist_ok=True)

		with open(tmp, 'wb') as fh:
			fh.write(cache[doc][name])

		img = pngkit.read(tmp)
		notes = []

		boxes = redactions.get(key, {}).get('boxes', []) if key else []
		if key and not boxes:
			print(f'! {dest}: expected redactions under "{key}" but none found')
		for box in boxes:
			# [x, y, w, h] or [x, y, w, h, sampleX, sampleY]
			pngkit.redact(img, tuple(box[:4]), sample=tuple(box[4:6]) if len(box) >= 6 else None)
		if boxes:
			redacted += 1
			notes.append(f'{len(boxes)} redacted')

		if img.width > MAX_WIDTH:
			img = pngkit.scale_to_width(img, MAX_WIDTH)
			scaled += 1
			notes.append(f'scaled to {MAX_WIDTH}px')

		pngkit.write(out_path, img)
		written += 1
		suffix = f'  [{", ".join(notes)}]' if notes else ''
		print(f'  {dest}  {img.width}x{img.height}{suffix}')

	if os.path.exists(tmp):
		os.remove(tmp)

	print(f'\n{written} written, {redacted} redacted, {scaled} scaled, {len(EXCLUDED)} excluded')


if __name__ == '__main__':
	main()
