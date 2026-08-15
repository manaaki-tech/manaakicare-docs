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
  terminology fixed.** Ten task-oriented walkthroughs, 36 screenshots redacted
  and published, ten leaking live screenshots cropped. Merged as `ae8ade7`.
  → [`sessions/2026-08-15-user-manual-launch-closeout.md`](sessions/2026-08-15-user-manual-launch-closeout.md)

- **2026-08-15 — Manual reorganised by job, three factual errors corrected.**
  The manual now reads as one sequence per role rather than one lifecycle across
  all roles; the four `user-roles/*` pages moved in as each role's "what you can
  do". Also: the activity edit window was wrong on three pages (10 days, not 24
  hours), closing an episode is not permission-gated, and screenshots no longer
  open in a new tab or get upscaled.
  → [`sessions/2026-08-15-role-restructure-closeout.md`](sessions/2026-08-15-role-restructure-closeout.md)

**Branch:** `docs/role-restructure`, pushed, **PR
[#9](https://github.com/manaaki-tech/manaakicare-docs/pull/9) open and not
merged.** It also carries the previously-stranded `internal/` docs and
`.claude/agents/` definitions, merged in from `chore/session-close-2026-08-15`.

**Verification gate:** no test suite. Use `npm run build` — meaningful because
`onBrokenLinks: 'throw'`.

---

## Next session

### 1. Readability pass on the four "what you can do" pages

The restructure moved `docs/user-roles/*.mdx` into the manual as
`docs/manual/<role>/what-you-can-do.mdx`. Their titles and openers were
rewritten, but **the bodies are still reference-register prose inside a manual
written for non-confident readers.** The launch session's readability audit
ranked these four among the worst pages on the site, and they now sit in the
manual's first screen for every role.

What is still wrong, with line numbers from the moved files:

- **ASCII arrow diagrams** — `case-worker/what-you-can-do.mdx:103-111` (Daily
  Workflow) and `:115-119` (episode lifecycle); `supervisor/…:82-86` and
  `:90-96`; `program-manager/…:100-105` and `:109-116`. Plain-text arrow chains
  in code fences. Prose or an ordered list will read better, and they do not
  reflow on a phone.
- **"Key Responsibilities"** sections — third-person HR register ("Case Workers
  are front-line staff who manage direct relationships") in a manual that
  otherwise says "you".
- **"Best Practices"** — four H3s per page of generic advice. Much of it
  duplicates the task pages now sitting directly beneath it in the same
  category. Candidate for deletion rather than rewriting.
- **`case-worker/what-you-can-do.mdx:116`** still shows `awaiting_commencement`
  inside an ASCII lifecycle diagram — the same raw-status problem already fixed
  in `docs/dashboards/case-worker.mdx`.

**Keep the permission tables.** They are the reason these pages exist and the
one thing a reader cannot get elsewhere. `intake-officer/what-you-can-do.mdx`
has no Data Visibility section at all, unlike the other three — a real gap, not
a formatting one.

### 2. Screenshots — five captures still needed from MJ

**Done:** the two case-worker images are cropped from the current build and
committed. `tools/crop_dashboard_images.py` records the boxes and is idempotent —
re-run it after replacing a source image.

**Still needed, all requiring a running app:**

1. Case worker — **Activities Needing Follow-up** table. In no current screenshot.
2. Supervisor — analytics cards.
3. Supervisor — pending referral/service requests.
4. Supervisor — service users needing contact / pending dispatch.
5. **A clean re-capture of the intake dashboard.** This one is not for a page
   directly: `static/img/manual/dashboard/intake-dashboard.png` contains all
   three intake reference images, but carries hand-drawn red annotations from
   the manual (a ring on the "Entry Processing" tile, a box on the first two
   tabs). They cannot be painted out — the ring crosses a gradient. One clean
   capture and `crop_dashboard_images.py` yields overview, new-referrals and
   tabs; add the three boxes back to the `CROPS` list, which documents them in
   its header comment.

Destinations already exist and are referenced, so a file can be dropped over a
path without touching prose:
`static/img/dashboards/{case-worker,supervisor,intake-officer}/`. Outdated
images sit at the remaining seven paths as placeholders.

Originals are backed up outside the repo at
`/home/amj/dev/.manaakicare-docs-screenshot-originals/2026-08-15/`, and in git at
`712175b`.

**When a dashboard page gets current-build images, add `<PictureWords />` to it.**
`docs/dashboards/case-worker.mdx` now has it; supervisor and intake-officer do
not, and will need it, because the pixels carry NPO's vocabulary and nothing
else on a reference page explains that.

### 3. Unverified on this machine

- **The enlarge overlay has never been exercised.** No browser here. Escape,
  backdrop click, focus return, scroll lock, and the resize recompute all
  compile and the markup is right, but nobody has clicked one.
- **Terminology on category pages** is verified only as a pure function.
  Confirm live: `/category/referrals/?env=production&org_id=90040e7a-ada0-4dc2-baaf-816713abf209`
  should read "Entry Management" with a card titled "Creating an Entry".

### Project context already mapped (don't re-explore)

- **`Screen`** — `src/components/Screen.tsx`. `WORTH_ENLARGING` ratio `:49`,
  runtime measurement `:64`, overlay effect `:80`. The affordance is computed
  from `naturalWidth` vs `clientWidth` **at runtime**, not from a build-time
  table, because it depends on the viewport. 13 of 38 usages pass `narrow`,
  which caps display at 26rem ≈ 416px (`Screen.module.css:47`).
- **Swizzles** — `src/theme/DocSidebarItem/{Category,Link}/`, plus new
  `src/theme/DocCard/index.tsx` (resolves the description via `useDocById`,
  because the original's fallback happens internally) and
  `src/theme/DocCategoryGeneratedIndexPage/index.tsx`.
- **`applyTerminology`** — `src/lib/terminology/applyTerminology.ts:57`. Pipe
  keys and aliases both go through `replaceAlias` (case-insensitive, corrects
  indefinite articles). **`simpleKeys` deliberately still uses the literal
  replace** — they have no stored plural, so word-boundary matching would break
  "dashboards".
- **`PictureWords`** — `src/components/PictureWords.tsx`, `PICTURE_WORDS` at
  `:29`. Covers 4 of `default.json`'s 9 keys; uncovered are `activity`,
  `caseload`, `cases`, `dashboard`, `supervisorDashboard`.
- **Backend answers** (repo `manaakicare-backend`) — activity edit window
  `apps/case_managements/permissions.py:36` (`timedelta(days=10)`), creator-only
  check `:32`. Closing an episode: `apps/case_managements/views.py:225`,
  `IsAuthenticated` only, organisation check at `:265-273`, **no role gate**.
- **Preview tool** — `tools/build_manual_preview.py`; `PAGES` list at `:29` must
  be updated by hand whenever manual pages move.

---

## Carry-forward gotchas

- **`docs/` is published.** Never put internal notes, specs or handoffs there.
- **The repo is public** (`manaaki-tech/manaakicare-docs`). Anything in
  `static/` is world-readable and permanent in history.
- **Unresolved:** pre-crop screenshots exposing two colleagues' bookmark bars
  are still in published history at commit `8046051`. Needs a history rewrite —
  a human decision, deliberately deferred.
- **Direct commits to `main` are blocked** by a pre-commit guard. Branch first.
- **`npm run build` wipes `build/`.** Never write generated artefacts there.
- **Testing terminology locally will fail.** CORS allows
  `https://docs.manaakitech.com` only.
- **Checking out a branch changes which subagents exist.** `.claude/agents/`
  defines `docs-sweeper`, `docs-writer`, `docs-critic`, `role-mapper`. They
  vanish on a branch that lacks the directory.
- **Verify subagent output, especially negative claims.** Across two sessions:
  one agent asserted no plural bug where `journey/01-overview.png` plainly shows
  "1 activities"; another generalised a data finding from SIT to production. A
  third ignored a stand-down and produced a full report after being told to stop.
- **Subagent reports may arrive late or need asking for.** All three agents this
  session signalled idle without delivering; two responded to an explicit
  request, one delivered spontaneously minutes later.

---

## Reminders for MJ — not Claude's to action

- **Replace `static/img/manual/closure/01-close-the-journey.png`.** Its dialog
  reads "Complete Episode" — default English — while the action that opens it
  reads "Exit Care Journey" in the same tenant. The frontend is not applying
  terminology to that modal.

  Same half-migration elsewhere: one caseload screen showing "In-progress
  Journeys", "My Caseload", "Service episodes currently in progress" and "My
  Service Episodes" at once; a journey overview using "Kaiāwhina" in one panel
  and "Kaimahi" in another. Worth raising as a single terminology-coverage pass.
  **This also blocks per-org screenshot variants** — see the closeout.

- **An unredacted phone number is published and you chose to leave it:**
  `static/img/manual/intake/05-referrer-and-risk.png` shows an ACC office number
  and a contact's number. Recorded here so it is a decision, not an oversight.

## Key reference docs

- `internal/sessions/2026-08-15-role-restructure-closeout.md` — this session.
- `internal/sessions/2026-08-15-user-manual-launch-closeout.md` — the launch.
- `internal/specs/2026-08-14-user-manual-launch-design.md` — design and the
  technical-challenge briefing.
- `tools/manual_redactions.json` — what was redacted from which image, and why.
