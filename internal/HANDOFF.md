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

Still wrong, with line numbers: ASCII arrow diagrams at
`case-worker/what-you-can-do.mdx:103-111,115-119`, `supervisor/…:82-86,90-96`,
`program-manager/…:100-105,109-116` — plain-text chains in code fences that do
not reflow on a phone. "Key Responsibilities" is third-person HR register in a
manual that otherwise says "you". "Best Practices" is four H3s of generic advice
per page, much of it duplicating the task pages directly beneath it — a deletion
candidate rather than a rewrite. And `case-worker/what-you-can-do.mdx:116` still
shows raw `awaiting_commencement` in a lifecycle diagram.

**Keep the permission tables.** They are the reason these pages exist and the
one thing a reader cannot get elsewhere. `intake-officer/what-you-can-do.mdx`
has no Data Visibility section at all, unlike the other three — a real gap, not
a formatting one.

### 2. Screenshots — done, but with a shelf life

All nine Dashboards images plus four new reference images come from current-build
captures; `tools/crop_dashboard_images.py` holds the boxes and redactions and is
idempotent. Raw captures stay outside the repo (they contain staff names) at
`/home/amj/dev/.manaakicare-docs-screenshot-originals/2026-08-15/`.

**The frontend terminology sweep (`fix/terminology-sweep`) will move several of
them** — the case worker and supervisor tiles, the "My Service Episodes" heading,
and the column headings on the new reference images all still show hardcoded
English. The intake images are already migrated. Re-shoot after it merges: swap
the source captures and re-run the tool. Prose will need another pass with it,
since those headings appear in the tables. Full list in the closeout.

### 3. Open questions the audit raised but could not settle

- **Is `entry`/`entries` staying hardcoded?** `resolve.ts:74-75` takes them from
  defaults, not from the org's concepts, so the button reads "+ New Entry" for
  every tenant while the docs write `<Term path="referral" />`. Invisible for NPO
  (whose referral term *is* "Entry"), wrong for a default-config tenant. Left
  alone deliberately: if the terminology sweep makes it org-driven, hardcoding it
  in the docs now would have to be undone. **Ask the frontend team.**
- **`With Kaiāwhina` is hardcoded** (`dashboard/types.ts:96`) — a te reo label
  fixed in software for every organisation. Documented as such, but worth
  confirming that is intended rather than an oversight.
- **Sidebar order.** `referrals-list.png` shows Clients in the bottom group;
  `cw-dash-1.png` and `AppSidebar.tsx:50-58` both put it second. Unreconciled —
  possibly a stale capture or a role variant. Docs left matching source.
- **Three referral statuses are undocumented**: `pending_associated_contact`,
  `pending_assessment`, `pending_cultural_soco` exist in
  `apps/referral/constants.py:79-129` but not in `workflow-overview.mdx`. Unknown
  whether they are reachable or vestigial.
- **A frontend bug worth passing on:** `src/types/api.ts:74-87` declares a
  `withdrawn` referral status that no backend enum has, and it is offered as a
  filter (`ReferralFilters.tsx:44`). A reader filtering by it will find nothing.
- **`supervisor.mdx` claims an episode is always created on accept**, even with
  no staff chosen. The frontend only fires that call when staff *is* selected
  (`AcceptRejectDialog.tsx:107-120`). Not traced through the backend; the claim
  is left standing pending that check.

### 4. Unverified on this machine

- **The enlarge overlay has never been exercised.** No browser here.
- **Terminology on category pages** is verified as a pure function only. Check
  live: `/category/referrals/?env=production&org_id=90040e7a-…` should read
  "Entry Management" with a card titled "Creating an Entry".

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
- **Terminology CAN be tested locally — against UAT, not production.**
  `https://api-uat.manaakicentral.com` returns
  `access-control-allow-origin` for a LAN origin such as
  `http://192.168.100.10:3000`; production allows `https://docs.manaakitech.com`
  only. So a local `?env=uat&org_id=…` genuinely resolves, while `env=production`
  silently falls back to default English. The older note saying local testing
  always fails was drawn from production alone.
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

- **The manual's closure screenshot shows UI that is not shipped — decide before
  merging PR #9.** `complete-care-journey.png` shows the dialog titled "Complete
  Care Journey". That string exists in **no commit on any branch**;
  `origin/main` still reads "Complete Episode"
  (`ExitEpisodeDialog.tsx:184,403`). The capture is uncommitted local work on top
  of `fix/terminology-sweep`.

  It is now `static/img/manual/closure/01-close-the-journey.png`, so the manual
  shows a label readers will not see until that branch merges. Options: hold the
  merge until it ships, or restore the previous image from
  `/home/amj/dev/.manaakicare-docs-screenshot-originals/2026-08-15/manual-closure-original/`.
  The surrounding prose is already label-agnostic either way.

  **An earlier note here claimed the modal was fixed. That was wrong** — inferred
  from the screenshot rather than from source.

- **An unredacted phone number is published and you chose to leave it:**
  `static/img/manual/intake/05-referrer-and-risk.png` shows an ACC office number
  and a contact's number. Recorded here so it is a decision, not an oversight.

## Key reference docs

- `internal/sessions/2026-08-15-role-restructure-closeout.md` — this session.
- `internal/sessions/2026-08-15-user-manual-launch-closeout.md` — the launch.
- `internal/specs/2026-08-14-user-manual-launch-design.md` — design and the
  technical-challenge briefing.
- `tools/manual_redactions.json` — what was redacted from which image, and why.
