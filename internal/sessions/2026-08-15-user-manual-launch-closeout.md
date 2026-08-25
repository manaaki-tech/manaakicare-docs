# 2026-08-15 — User Manual for launch, and production terminology

**Status:** Shipped. Manual live, terminology working in production for NPO.
**Branch:** `docs/user-manual-launch`, merged
**Merge commit:** `ae8ade7`
**PR:** no PR — merged locally and pushed to `main` on the founder's instruction
**CI run:** Deploy to GitHub Pages run `31843856760`, success

> Durable snapshot of what this session did. Living state lives in
> `internal/HANDOFF.md`. Read HANDOFF first; come here for the archival record.
>
> Note this repo keeps these under `internal/`, **not** `docs/superpowers/`.
> `docs/` is the published Docusaurus site with `routeBasePath: '/'`, so
> anything placed there becomes a public page on docs.manaakitech.com.

---

## What this session was supposed to do

Produce a User Manual for a Monday 2026-08-17 product launch, from three
supplied `.docx` files containing 38 screenshots plus the 36-page reference
site written earlier in the week. The stated audience: middle-aged,
non-tech-savvy community care workers. The founder also asked for technical
challenges to be identified in advance rather than discovered late.

The session ran overnight with autonomy, using subagents for parallel audits.

---

## What landed

### Commits

```
58816c3 docs(terminology): correct the note about docs terminology data
b5ca68d fix(preview): the read-through rendered as a nearly blank page
bf2113e docs(manual): correct what a fact-check against the reference found
c81cd5c fix(screenshots): strip browser chrome from ten more live images
bd181ab docs(manual): add the 36 screenshots, redacted
c839660 docs(plan): revise the launch briefing against what was actually found
f6772ee feat(print): make the manual printable
3826b3b docs(intro): send new readers to the manual, stop promising password resets
635f039 docs(search): index the words organisations actually use
d0f181c feat(terminology): add the production API base URL
5e7bd24 docs(manual): correct closure, and add a single-file read-through
2692b1e fix(terminology): match the env keys the application actually sends
47bac88 fix(screenshots): remove a colleague's browser chrome from a live image
eab2ea9 docs(manual): add the task-oriented User Manual section
183ea4f docs(plan): design for the launch User Manual
```

103 files changed, 3152 insertions.

### Test results

No test suite in this repo. Gate used throughout was `npm run build`, which is
meaningful here because `onBrokenLinks: 'throw'`. Green at every commit and on
the deploy run.

Readability was measured rather than asserted, across `docs/manual/*.mdx`
versus every other `.mdx`:

| | Manual | Reference |
|---|---|---|
| Mean sentence | 12.3 words | 20.3 words |
| Median sentence | 11 words | 15 words |
| Over 25 words | 3.4% | 21.8% |

---

## Phase-by-phase summary

### Phase 1 — Plan and risk briefing

Ten task-oriented walkthroughs added as a `Manual` category above Getting
Started, rather than restructuring the reference. The reference is organised by
system entity (Referrals, Clients, Service Episodes); the reader thinks in
tasks. Reference pages stay as-is and the manual links down into them.

### Phase 2 — Screenshot pipeline

No Pillow, ImageMagick, pandoc, LibreOffice or pip on this machine.
`tools/pngkit.py` is a pure-stdlib PNG reader/writer (zlib only) supporting
crop, box-filter downscale and pixel redaction.
`tools/build_manual_images.py` unzips the `.docx` directly and writes 36 named
images. Two source images dropped: a byte-identical duplicate, and a Windows
"open with" dialog that is not product UI.

### Phase 3 — Redaction

Ten images carried real staff names, a work email, an org name and a phone
number. Redacted in pixels, not CSS overlay, because the repo is public and an
overlay leaves the original bytes one right-click away. Boxes live in
`tools/manual_redactions.json` with a note per image.

### Phase 4 — Terminology in production

Three independent faults, only one in this repo. See findings below.

### Phase 5 — Audits

Five subagents: screenshot catalogue, readability audit, fact-check against the
reference, live-site screenshot audit, and a final PII sweep.

---

## Non-obvious findings

- **Terminology needed three fixes, not one.** The initial read was "config is
  missing a production entry, one line". Wrong. (a) The app's deploy workflows
  hardcode `VITE_ENVIRONMENT` to `production`/`sandbox`, while
  `docusaurus.config.ts` had `local`/`sit`/`uat` — adding a key called `prod`,
  the original plan, would not have worked. (b) The production API base URL was
  unknown and lives in a GitHub Actions secret; it is
  `https://api.manaakicentral.npo.org.nz`, recovered from the deployed NPO
  bundle. The runbook still names `api.manaakitech.com`, which is SIT. (c) CORS
  on the production backend did not allow this origin. All three now fixed.

- **A CORS check with `curl` is worthless without an Origin header.** The
  endpoint returns HTTP 200 to every caller. Only by sending
  `Origin: https://docs.manaakitech.com` and observing that no
  `access-control-allow-origin` came back was the fault visible. `curl` does not
  enforce CORS; a browser does. `vary: origin` in the response is the tell that
  the middleware is active and simply does not list you.

- **"No organisation has a docs terminology row" was wrong.** That came from
  querying SIT. NPO production has one, returning exactly the vocabulary the
  screenshots show. Do not generalise a data finding from one environment.

- **Screenshots cannot be terminology-swapped, and the app is half-migrated.**
  Prose swaps at runtime via `<Term>`; pixels cannot. Worse, one caseload
  screenshot shows "In-progress Journeys", "My Caseload", "Service episodes
  currently in progress" and "My Service Episodes" simultaneously, and the
  journey overview says "Kaiāwhina" in one panel and "Kaimahi" in another. The
  screenshots disagree with themselves. `src/components/PictureWords.tsx` is the
  mitigation — see the next-session mandate.

- **Ten of fourteen published screenshots were full browser windows.** Found by
  stacking the top 110px of all of them into one image. They exposed an internal
  Azure staging hostname and two colleagues' bookmark bars, profile photographs
  and extensions. All ten cropped. **Cropping fixes what the site serves, not
  what the repo remembers** — the originals are still reachable in published
  history on a public repo, commit `8046051`. Unresolved; needs a history
  rewrite, which is a human decision.

- **I stated "13 live screenshots" repeatedly. There are 14.** The work covered
  all of them (11 cropped, 3 already clean); only the narrative count was wrong.

- **The reference pages have drifted from the product.** The screenshots are a
  newer build: the reference says the deadline clock anchors at
  **Commence Episode**, the screenshots show **Start working with…** plus a
  start-date field at Accept stating "Compliance deadlines are calculated from
  this date". The reference documents the case-worker dashboard exhaustively
  with no "Ready to start" section; the screenshot has one. Ending work is
  **Exit** in pictures, **Close Episode** in the reference.

- **Two reference pages contradict each other.** `docs/activities/overview.mdx:59`
  says an activity is editable for **24 hours**;
  `docs/user-roles/case-worker.mdx:56` says **10 days**. Unresolved — the manual
  says "a limited time" and declines to pick.

- **Frontmatter `keywords` do reach the static search index.** Verified by
  confirming "discharge", present only in a keywords list, appears in
  `build/search-index.json`. This is what makes the tenant-vocabulary search
  mitigation work.

- **A subagent's confident report needed correcting twice.** The screenshot
  catalogue asserted no plural bug existed; `journey/01-overview.png` plainly
  shows "1 days active" and "1 activities". Treat subagent output as evidence to
  check, not as fact.

- **`docs/` is the published site.** A design spec written to
  `docs/superpowers/specs/` would have been published to docs.manaakitech.com.
  Moved to `internal/` before commit. Same trap applies to HANDOFF and sessions.

- **File size is not evidence a page renders.** The single-file manual preview
  was reported as published at 2.9MB and was almost entirely blank: 81 Docusaurus
  `hash-link` heading anchors were left unclosed because the converter rewrote
  every `</a>` but only *some* `<a>`. An unclosed `display:none` anchor adopts
  and hides the rest of the section. The 2.9MB was base64 images.

---

## Project context mapped during this session

- **`TerminologyProvider`** at `src/lib/terminology/TerminologyContext.tsx:45` —
  reads `env` + `org_id` from the query string, persists to `sessionStorage`
  (`mc_docs_env`, `mc_docs_org_id`, per-tab), fetches
  `{base}/api/v1/organisations/terminologies/{org}/docs/`. Returns silently with
  defaults if either param is missing or `env` is unknown.
- **`resolveBaseUrl`** at `src/lib/terminology/TerminologyContext.tsx:64` —
  `LOCAL_ENVS` (`local`, `development`) resolve against the serving hostname.
- **`applyTerminology`** at `src/lib/terminology/applyTerminology.ts:57` — used
  where `<Term>` cannot reach: sidebar labels and mermaid source. Handles pipe
  keys, alias forms ("Episode", "Episode of Care", "Client") and article
  correction.
- **`Term`** at `src/components/Term.tsx:12` — renders a span; used in prose.
- **`PictureWords`** at `src/components/PictureWords.tsx` — `PICTURE_WORDS` at
  line 26 records the vocabulary visible in the screenshots. Rows where the
  reader's configured word equals the picture word are filtered out; if none
  remain the component returns `null`.
- **Swizzled theme components** — `src/theme/DocSidebarItem/Category/index.tsx:17,23`
  and `src/theme/DocSidebarItem/Link/index.tsx` apply terminology to sidebar
  labels. **`DocCard` and the generated-index page are NOT swizzled** — see the
  next-session mandate.
- **`tools/pngkit.py`** — `read`, `write`, `crop`, `redact(img, box, sample=)`,
  `scale_to_width`. 8-bit, non-interlaced, colour type 2 or 6 only.
- **`tools/build_manual_images.py`** — `MANIFEST` maps source doc + image to
  destination path; `EXCLUDED` records the two dropped images and why.
- **`tools/fix_live_screenshots.py`** — `CHROME` (crop amounts, idempotent via
  expected-height check) and `REDACT` (boxes, applied after cropping).
- **`tools/build_manual_preview.py`** — renders the built manual into one
  self-contained HTML file at repo root; writes outside `build/` because
  `docusaurus build` wipes that directory.

---

## See also

- `internal/specs/2026-08-14-user-manual-launch-design.md` — the design and the
  full technical-challenge briefing, revised as findings landed.
- `tools/manual_redactions.json` — what was redacted from which image and why.
