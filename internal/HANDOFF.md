# HANDOFF

**Last updated:** 2026-08-15

> Pointer file, not a logbook. Session narratives live in `internal/sessions/`.
> Keep this under 200 lines.
>
> **These live in `internal/`, not `docs/`.** `docs/` is the published
> Docusaurus site with `routeBasePath: '/'` — anything placed there becomes a
> public page on docs.manaakitech.com and is indexed in site search.

---

## Where we are

- **2026-08-15 — User Manual shipped for the Monday launch, and production
  terminology fixed.** Ten task-oriented walkthroughs added above the reference
  section; 36 screenshots extracted, redacted and published; ten leaking live
  screenshots cropped. Terminology now resolves in production for NPO. Merged as
  `ae8ade7`, deployed successfully.
  → [`internal/sessions/2026-08-15-user-manual-launch-closeout.md`](sessions/2026-08-15-user-manual-launch-closeout.md)

**Branch:** `main` at `ae8ade7` (plus `chore/session-close-2026-08-15` for this
closeout). **Live:** bundle `main.96c8af79.js` on docs.manaakitech.com.

**Verification gate:** no test suite. Use `npm run build` — meaningful because
`onBrokenLinks: 'throw'`.

---

## Next session

**Mandate: six items. Item 0 restructures what items 1 and 4 operate on, so
settle it first.**

### 0. Fold the manual into the user-role pages

**The founder's judgement after reading the shipped manual**, and it is a
correction to the architecture the launch session chose:

- **It duplicates docs that already existed.** `manual/signing-in` over
  `getting-started/logging-in`; `manual/finding-your-way-around` over
  `getting-started/navigating-the-system`; `manual/your-day-at-a-glance` over
  `dashboards/*`.
- **Read in sequence it mixes roles, which is confusing.** The ten pages follow
  the *lifecycle*, not one person's job. `manual/taking-on-someone-new` is intake
  officer and supervisor work — a <Term caseWorker /> cannot even see the
  **+ New Entry** button, which that very page says out loud. So a case worker
  reading start-to-finish hits a long page that is not their job at all.

Wanted instead: integrate the manual's content into
`docs/user-roles/{case-worker,intake-officer,supervisor,program-manager}.mdx`,
role-relevant, so each role reads one sequence entirely theirs. That also fits
because the readability audit ranked those four pages among the worst for this
audience — permission tables and ASCII diagrams, no procedures.

**First-pass mapping — the unit of migration is the SECTION, not the page.**
Two manual pages split across roles internally, so a page-level move misfiles
content. Evidence is `file:line`; rows without it are marked as guesses.

| Content | Primary | Secondary | Varies? | Evidence |
|---|---|---|---|---|
| Start here, Signing in, Finding your way around, When something looks wrong | all roles | — | no | orientation, no permission gate |
| Your day at a glance | each role, own dashboard | — | no | `docs/dashboards/*` already split this way |
| **Taking on someone new** | **intake officer** | supervisor, programme manager | no | `referrals/creating-a-referral.mdx:24-26` — **+ New Entry** is intake/supervisor/PM only; `user-roles/case-worker.mdx:63` *Allocate: No* |
| ↳ its *"Filling in the rest"* section | **contested** | — | **yes** | intake info, whānau background and support network can be completed by intake officer or case worker depending how the team divides it |
| **Working with someone** | **case worker** | — | no | `service-episodes/starting-an-episode.mdx:13` — commencing is "something a <Term caseWorker /> does deliberately" |
| ↳ its *"Changing who works with them"* section | **supervisor / programme manager** | — | no | `user-roles/supervisor.mdx:50`, `program-manager.mdx:50` *Allocate: Yes*; `case-worker.mdx:63` *No* |
| **Writing up what you did** | **case worker** | supervisor, PM (view only) | no | `case-worker.mdx:55` *Create activities/case notes: Yes*; `program-manager.mdx:54` *View all team activities* — everyone reads, one role writes |
| Staying on top of deadlines | case worker | supervisor (oversight) | mild | `case-worker.mdx:60` *Upload documents: Yes* |
| **Finishing up** | **supervisor / manager (by practice)** | case worker initiates | **yes** | **Reported by a case worker, not verified in code:** episodes are taken to the supervisor or manager to be closed. No role page states who *may* close — absent from all four permission tables, and `service-episodes/closing-an-episode.mdx` never names a role. |

**Resolve the Finishing up gap before filing it.** There are two different
answers and they need different wording: does the system *permit* only
supervisors to close, or does it permit case workers and the organisation's
practice is to escalate? Check the frontend or backend for the permission, then
write the practice as practice. Do not present a convention as a system rule.

**On content that spans roles**, e.g. writing up activities: prefer one shared
page owned by the case worker, with supervisor and programme manager pages
linking *into* it under "what you'll see from your team", rather than three
copies that drift apart.

Trade-offs to settle before moving files:

- **Genuinely shared content.** Recording an activity spans roles. Copying it
  into each role page trades one duplication for another. Shared pages roles
  link into, or accept repetition?
- **URLs change**, and `onBrokenLinks: 'throw'` — every internal link must move
  in the same pass, including `docs/intro.mdx`, pointed at `/manual/start-here`.
- **What happens to the Manual category?** Could disappear, or become a short
  "which role are you?" chooser.
- Screenshots and the `<Screen>` / `<PictureWords>` components carry over
  unchanged — this re-organises prose, not assets.

### 1. Verify the vocabulary tables against a real tenant

`src/components/PictureWords.tsx` renders a "Where a picture says / Your screen
says" table, filtered to rows where the reader's configured word differs from
the word visible in the screenshots.

Now that terminology loads in production, NPO's four configured terms match
`PICTURE_WORDS` exactly, so the component should render **nothing at all** for
them. That is the designed behaviour, but it has never been seen in a browser.

Confirm what actually renders, for NPO and for a default-config reader, before
changing anything. Live check:

```
https://docs.manaakitech.com/manual/start-here?env=production&org_id=90040e7a-ada0-4dc2-baaf-816713abf209
```

Only then decide whether the table is still the right shape, whether it belongs
on every page or once, and whether `PICTURE_WORDS` (4 keys) should cover more of
`default.json` (9 keys).

### 2. Audit and replace outdated screenshots in the non-manual sections

The Dashboards, Referrals, Clients, Service Episodes and User Roles sections
still use the older screenshot set. Known problems in those images:

- superseded **"Manaaki Care"** branding (product is now "Manaaki Central")
- raw database statuses shown as labels — `awaiting_commencement`, `completed`
- an older UI that predates the compliance panel and the current layout
- scratch data: "ma red", "bed red", "fsd afs", "Emer gent", "Crisis Dude"

Do a full pass to identify every outdated image, then replace. Note the
surrounding prose often describes these screenshots closely (column names,
example reference numbers), so a replacement usually needs a prose edit too —
that is why the launch session cropped rather than replaced.

### 3. Terminology does not reach category "switchboard" pages

Clicking a parent sidebar item (e.g. "Entries") opens a `generated-index` page
whose labels are **not** terminology-swapped. Confirmed live on
`/category/referrals/` — the sidebar reads "Entries" while the page reads
"Referral Management" and lists cards titled "Creating a Referral" and "Finding
or Creating the Client".

Four untermed surfaces on every category page:

1. the page `<h1>` — from `generated-index.title` in `sidebars.ts`
2. the page description — from `generated-index.description`
3. each card title — from the target doc's frontmatter `title`
4. each card description — from the target doc's frontmatter `description`

Only `DocSidebarItem/Link` and `DocSidebarItem/Category` are swizzled. `DocCard`
and the generated-index page are not. Follow the existing pattern at
`src/theme/DocSidebarItem/Category/index.tsx:17,23`.

### 4. Match instruction lists to red numbers in the screenshots

Several screenshots carry pre-drawn red numbered callouts from the source
documents. Where an image has them, the accompanying instructions should be an
**ordered list keyed to those numbers**, not bullets, so the reader can map
number to step.

Directly confirmed as carrying red numbers: `journey/03-overview-tour.png`
(1–7), `intake/04-entry-details.png` (1–7), `activities/06-templates.png` (1–4).
Reported but unverified: `intake/05-referrer-and-risk.png`,
`intake/15-family-background.png`, `intake/17-add-a-contact.png`,
`journey/02-person-header.png`, `activities/02-activity-log.png`,
`activities/03-essentials.png`, `activities/04-remote.png`,
`navigation/left-menu.png`.

Sweep all 36 under `static/img/manual/`, then fix the prose. The clearest
current mismatch is `docs/manual/working-with-someone.mdx`, which lists the
overview regions as bullets beside a screenshot numbered 1–7.

### 5. Screenshot presentation — sharpness, and how enlarging behaves

Two related problems in `src/components/Screen.tsx` and its stylesheet.

**5a. Enlarging dumps the reader into a new browser tab.** `Screen.tsx:32` uses
`<a href={src} target="_blank">`, so clicking a screenshot opens the raw PNG on
its own, losing the page entirely. On a phone that means backing out of a tab to
get home — bad for a reader who is mid-task and not a confident computer user.

Wanted: show the image **above** the current page, dismissed easily to return to
where they were. Requirements if it is built: Escape closes it, clicking the
backdrop closes it, a visible close control (not just a gesture), focus moves
into the overlay and returns to the triggering image on close, background scroll
locked while open, and `prefers-reduced-motion` respected. No external library —
the site is self-contained.

Note this interacts with 5b: once images render at natural size, the 18 that are
narrower than the column gain nothing from enlarging. Consider offering the
overlay only where the natural width genuinely exceeds the display width, so the
affordance means something rather than appearing on every image.

### 5b. Embedded screenshots look soft; the clicked-through version is sharp

Lower priority, but already diagnosed — **this is a CSS bug, not an image
problem, and it needs no image manipulation.**

`src/components/Screen.module.css:27-31` sets `.frame img { width: 100% }`,
which forces every screenshot to fill the ~800px content column. **Exactly half
of them — 18 of 36 — are narrower than that**, so they are being upscaled by the
browser. `compliance/01-compliance-panel.png` is 301px stretched to ~800px, a
2.65× blow-up. Clicking opens the file at natural size, which is why it looks
sharp: that is the same pixels, undistorted.

Likely fix, one line: `max-width: 100%` instead of `width: 100%`, so images only
ever scale *down*. Then decide how mixed widths should sit in the flow.

`journey/01-overview.png` is the one that already looks right — captured at
1917px, downscaled to 1600px, so it renders at ~800px as a true 2× image. That
is the eventual standard: re-shoot at twice the display width. The CSS change is
the cheap fix that stops making things worse meanwhile.

### Project context already mapped (don't re-explore)

- **`PictureWords`** — `src/components/PictureWords.tsx`; `PICTURE_WORDS` at
  line 26 records the screenshots' vocabulary; rows matching the reader's own
  word are filtered; returns `null` when none remain.
- **`TerminologyProvider`** — `src/lib/terminology/TerminologyContext.tsx:45`.
  Needs `?env=…&org_id=…`; persists to `sessionStorage` (`mc_docs_env`,
  `mc_docs_org_id`) which is **per-tab**; silently defaults if `env` is unknown.
- **`resolveBaseUrl`** — same file, line 64. `LOCAL_ENVS` resolve against the
  serving hostname.
- **`applyTerminology`** — `src/lib/terminology/applyTerminology.ts:57`. For
  places `<Term>` cannot reach: sidebar labels, mermaid source. Handles aliases
  ("Episode", "Episode of Care", "Client") and indefinite articles.
- **Swizzles** — `src/theme/DocSidebarItem/{Category,Link}/index.tsx`.
- **`Screen`** — `src/components/Screen.tsx`, styles at
  `src/components/Screen.module.css:27` (the `width: 100%` in item 5).
- **NPO production terminology** — endpoint
  `https://api.manaakicentral.npo.org.nz/api/v1/organisations/terminologies/90040e7a-ada0-4dc2-baaf-816713abf209/docs/`
  returns `referral: Entry|Entries`, `caseWorker: Kaiāwhina|Kaiāwhina`,
  `serviceUser: Whānau|Whānau`, `serviceEpisode: Care Journey|Care Journeys`.

Screenshot tooling (`pngkit`, `build_manual_images`, `fix_live_screenshots`,
`build_manual_preview`) is documented in the closeout — see "Project context
mapped during this session" there rather than repeating it here.

---

## Carry-forward gotchas

- **`docs/` is published.** Never put internal notes, specs or handoffs there.
- **The repo is public** (`manaaki-tech/manaakicare-docs`). Anything committed to
  `static/` is world-readable, and history is permanent.
- **Unresolved:** the pre-crop screenshots exposing two colleagues' personal
  bookmark bars are still in published history at commit `8046051`. Cropping
  fixed what the site serves, not what the repo remembers. Needs a history
  rewrite — a human decision, deliberately deferred past launch.
- **Direct commits to `main` are blocked** by a pre-commit guard. Branch first.
- **`npm run build` wipes `build/`.** Never write generated artefacts there.
- **Testing terminology locally will fail.** CORS allows
  `https://docs.manaakitech.com` only, so a page served from localhost or the
  LAN IP falls back to default English. That is expected, not a bug.
- **Unresolved product/docs contradictions**, both detailed in the closeout: the
  reference pages have drifted from the current build (Commence Episode vs Start
  working with…, Exit vs Close Episode), and two of them disagree on whether an
  activity is editable for 24 hours or 10 days.
- **Verify subagent output.** A catalogue agent asserted no plural bug existed
  when `journey/01-overview.png` plainly shows "1 days active" / "1 activities".

---

## Reminders for MJ — not Claude's to action

- **Replace `static/img/manual/closure/01-close-the-journey.png`.** The dialog in
  that screenshot reads **"Complete Episode"** — default English — even though
  the action that opens it reads "Exit Care Journey" in the same tenant. The
  frontend is not applying terminology to that modal. MJ is replacing the
  screenshot once the app side is fixed; until then the manual names both labels
  rather than pretending to know which the reader will see.

  This is the same half-migration the launch session recorded elsewhere: one
  caseload screen showing "In-progress Journeys", "My Caseload", "Service
  episodes currently in progress" and "My Service Episodes" at once, and a
  journey overview using "Kaiāwhina" in one panel and "Kaimahi" in another. Worth
  raising with whoever owns the frontend as a single terminology-coverage pass
  rather than one modal at a time.

- **Confirm who is permitted to close an episode** (see item 0's mapping table) —
  needed before "Finishing up" can be filed under a role.

## Key reference docs

- `internal/specs/2026-08-14-user-manual-launch-design.md` — design and the full
  technical-challenge briefing.
- `internal/sessions/2026-08-15-user-manual-launch-closeout.md` — launch session
  record.
- `tools/manual_redactions.json` — what was redacted from which image, and why.
