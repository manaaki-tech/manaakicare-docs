# 2026-08-15 — Manual restructured by role, and three factual corrections

**Status:** Complete and pushed, not merged. Blocked on nine screenshots the
founder is capturing. Build green throughout.
**Branch:** `docs/role-restructure` at `7aa3604` (plus the merge of
`chore/session-close-2026-08-15`)
**Merge commit:** not merged yet
**PR:** [#9](https://github.com/manaaki-tech/manaakicare-docs/pull/9)
**CI run:** none — not merged

> Durable snapshot of what this session did. Living state lives in
> `internal/HANDOFF.md`. Read HANDOFF first; come here for the archival record.
>
> This repo keeps these under `internal/`, **not** `docs/superpowers/`. `docs/`
> is the published Docusaurus site with `routeBasePath: '/'`.

---

## What this session was supposed to do

Six items carried from the user-manual-launch session. Item 0 — fold the
ten-page manual into the four user-role pages — was the founder's correction to
the architecture the launch session chose, and it restructured what items 1 and
4 operated on, so it had to be settled first. The other five: verify
`PictureWords` against a real tenant, audit and replace outdated screenshots in
the reference sections, make terminology reach the category switchboard pages,
key instructions to the red numbers drawn on screenshots, and fix how
screenshots are sized and enlarged.

The session ran with three read-only inventory subagents dispatched up front,
judgement work kept in the main thread, and design decisions put to the user
before any code was written.

---

## What landed

### Commits

```
7aa3604 fix(preview): follow the manual into its role directories
d8df500 docs(getting-started): fold logging-in into the manual's signing-in page
eab6bb1 docs(manual): organise the manual by job rather than by lifecycle
712175b docs(dashboards): consistent image paths, and drop the raw statuses
7be837a docs(manual): key the instructions to the numbers on the pictures
42a317f fix(activities): the edit window is 10 days, not 24 hours
7564eb5 fix(terminology): reach the category switchboard pages
ec20ad7 feat(screenshots): enlarge in place, and stop upscaling
```

### Files changed

59 files changed, 1672 insertions, 291 deletions (against `main`, including the
merged closeout branch).

Structural: ten `docs/manual/*.mdx` and four `docs/user-roles/*.mdx` moved into
`docs/manual/{everyone,case-worker,intake-officer,supervisor,program-manager}/`;
`docs/user-roles/` and `docs/getting-started/logging-in.mdx` deleted; two new
pages written (`supervisor/moving-work-between-staff.mdx`,
`intake-officer/your-day-at-a-glance.mdx`); nine images moved to
`static/img/dashboards/<role>/`; five orphaned images deleted.

### Test results

No test suite in this repo. The gate is `npm run build`, meaningful because
`onBrokenLinks: 'throw'` and the restructure moved every manual URL. Green at
every commit.

Two verifications ran outside the build:

- `applyTerminology` compiled with `tsc` and exercised against the live NPO
  vocabulary on the real category strings — including a no-override control to
  confirm it stays a no-op for organisations without custom terminology.
- The read-through preview regenerated: 16 sections, 38 images, balanced anchor
  tags, ~70k characters of visible text.

---

## Non-obvious findings

- **Three published pages were wrong about the activity edit window, and the
  page that looked least authoritative was the correct one.**
  `activities/overview.mdx:59`, `recording-visits.mdx:76` and
  `viewing-activity-history.mdx:44` all said 24 hours;
  `user-roles/case-worker.mdx:56` said 10 days. The backend settles it:
  `manaakicare-backend/apps/case_managements/permissions.py:36` builds its
  cutoff from `timedelta(days=10)` — in code, not merely the docstring above it.
  Fixed on all three. The same permission class (`:32`) restricts editing to the
  activity's **creator**, which no page stated at all; the manual now says a
  supervisor cannot correct someone else's write-up.

- **Closing an episode is not permission-gated. The escalation is practice, not
  a rule.** `manaakicare-backend/apps/case_managements/views.py:225` declares
  `ExitEpisodeView` with `permission_classes = [permissions.IsAuthenticated]`,
  and the only check in `post()` is organisation membership (`:265-273`) — no
  role test. `mcentral-frontend/src/features/care-journey/tabs/OverviewTab.tsx:277`
  wires the action straight through with no guard either. This was the open
  question the launch session deferred to a human. The manual now says the
  system permits it and the organisation's practice may differ, rather than
  presenting a convention as a permission.

- **Fixing item 3 exposed two latent bugs in `applyTerminology`.** Pipe keys
  went through a literal `replaceAll` while alias forms went through
  `replaceAlias`, so only the aliases were case-insensitive and article-aware.
  Consequences: `"Learn how to create and manage referrals"` was never matched
  (sentence case), and `"Creating a Referral"` became `"Creating a Entry"`. Both
  category descriptions and card titles are exactly these shapes, so item 3
  would have half-worked. Pipe keys now take the same path. **`simpleKeys` was
  deliberately left alone** — those have no stored plural, so the literal
  substring replace is what turns "dashboard" into the right word inside
  "dashboards"; routing them through the word-boundary matcher would regress
  that.

- **The handoff's red-number list was substantially wrong: 7 of 36, not ~11.**
  Five images it listed as probably-numbered carry red boxes or arrows with **no
  numerals** (`intake/05-referrer-and-risk`, `navigation/left-menu`,
  `activities/03-essentials`, `activities/04-remote`, `intake/16-support-network`).
  Two were spot-checked by eye before accepting the agent's negative claim. Two
  images the handoff did *not* list do carry numbers
  (`intake/15-family-background` 1–5, `intake/17-add-a-contact` 1–3).

- **Item 2 needs four fresh captures, not nine — and the difference came from
  the founder questioning the list.** Five of the fourteen reference screenshots
  were referenced by no page at all and are deleted. Of the nine referenced, the
  first count assumed each needed its own capture. Checking the pixels instead of
  the filenames showed that **five are crops of screenshots that already exist at
  the current build**: `static/img/manual/dashboard/intake-dashboard.png` contains
  the intake overview, the New Referrals drill-down *and* the tab strip
  (`Intake | In Review | Service Review | With Kaiāwhina`), and
  `dashboard/my-caseload.png` contains the analytics tiles and the active-cases
  table. Genuinely needed: the case-worker **Activities Needing Follow-up** table,
  and all three supervisor dashboard images — nothing anywhere covers the
  supervisor dashboard.

  Caveat if the crops are used: those pixels carry NPO's vocabulary, and the
  reference pages do **not** render `<PictureWords />`, so a default-config
  reader would meet "Whānau" and "Kaiāwhina" with no explanation. Add the
  component to `docs/dashboards/*.mdx` if the crops land there.

- **Per-org screenshot variants were considered and deferred.** The founder
  asked whether the docs app could serve different screenshots per `org_id`. The
  wiring is cheap — `Screen` already sits downstream of `useTerminology()`. The
  cost is 36 re-captures per organisation, repeated on every UI change. The
  decisive argument against doing it now is that the app's own terminology is
  half-migrated (one screenshot shows "In-progress Journeys" and "My Service
  Episodes" at once; another says "Kaiāwhina" and "Kaimahi" in adjacent panels),
  so a per-org capture today would faithfully reproduce that inconsistency.
  Revisit when a second tenant exists *and* the frontend renders one vocabulary
  consistently. `PictureWords` covers the gap meanwhile at the cost of one table
  that disappears when it is not needed.

- **The docs had begun documenting a bug as correct behaviour.**
  `dashboards/case-worker.mdx` listed `awaiting_commencement`, `active`,
  `completed`, `closed` as the Status Badge labels — the raw database values.
  The current build (visible in `static/img/manual/dashboard/my-caseload.png`)
  shows Title Case pills and separate `Reference` / `Whānau` columns rather than
  the single `Client` column the page described. The colour column was dropped:
  two of its four entries disagree with that screenshot.

- **`PictureWords` renders nothing for NPO, as designed — and the Unicode trap
  is not real.** NPO production returns exactly the four words in
  `PICTURE_WORDS`, so every row filters and the component returns `null`. The
  failure mode worth checking was normalisation: `Kaiāwhina` and `Whānau` are
  compared with `.toLowerCase() !==`, so an NFD source literal against an NFC API
  response would silently *fail* to filter and show NPO a table asserting their
  own words differ from themselves. Both sides are NFC, codepoint-identical.

- **Restructuring silently broke `tools/build_manual_preview.py`.** It globs
  `build/manual/*/index.html`, one level too shallow once pages nested by role —
  and it *warns and continues* rather than failing, so it would have produced a
  near-empty preview. That is the same class of failure the launch session hit
  (a 2.9MB file that was almost entirely blank). Fixed, and the screenshot frame
  is now styled by class substring since it is no longer an `<a href="/img/…">`.

- **Subagent reports can arrive after the agent goes idle, or not at all.** All
  three agents signalled idle without delivering; two responded to an explicit
  request, the third (`dup-map`) delivered spontaneously several minutes later,
  after a replacement had already been spawned. Ask for the report rather than
  assuming the idle notification means it was lost — but be ready to stand the
  replacement down.

- **Checking out a branch changes which subagent types exist.** The
  `docs-sweeper` / `docs-writer` / `docs-critic` / `role-mapper` definitions live
  in `.claude/agents/` on `chore/session-close-2026-08-15`. Branching from `main`
  made them vanish mid-session. Now merged, so they are available again.

- **An unredacted phone number is published, and the founder chose to leave
  it.** `static/img/manual/intake/05-referrer-and-risk.png` shows
  `Accident Compensation Corporat… / Tairawhiti / 06-869 0100` and a contact
  `Tony ACC / 045453425`. `tools/build_manual_images.py:52` maps it with `None`
  — the redaction pass covered only ten images and never considered it. Raised;
  the decision was to leave it as is.

---

## Project context mapped during this session

- **`ExitEpisodeView`** — `manaakicare-backend/apps/case_managements/views.py:225`,
  permission classes at `:231`, organisation check at `:265-273`.
- **`ActivityEditDeletePermission`** —
  `manaakicare-backend/apps/case_managements/permissions.py:10`; creator check
  `:32`, 10-day cutoff `:36`.
- **Exit wiring in the frontend** —
  `mcentral-frontend/src/features/care-journey/tabs/OverviewTab.tsx:277`
  (`onCloseEpisode`), dialog at
  `src/features/service-episodes/components/ExitEpisodeDialog.tsx:79`.
- **`Screen`** — `src/components/Screen.tsx`; `WORTH_ENLARGING` ratio at `:49`,
  runtime measurement in `measure()` at `:64`, overlay effect at `:80`. Note the
  affordance is computed from `naturalWidth` vs `clientWidth` at runtime, **not**
  from a build-time table, because it depends on the viewport.
- **New swizzles** — `src/theme/DocCard/index.tsx` (resolves the description via
  `useDocById` because the original's fallback happens internally) and
  `src/theme/DocCategoryGeneratedIndexPage/index.tsx`.
- **Screenshot widths** — 17 of 36 exceed an 800px column; 13 of 38 `<Screen>`
  usages pass `narrow`, which caps display at 26rem ≈ 416px
  (`Screen.module.css:47`), so the threshold is per-usage, not per-file.

---

## See also

- `internal/sessions/2026-08-15-user-manual-launch-closeout.md` — the session
  this one continues.
- `internal/specs/2026-08-14-user-manual-launch-design.md` — the original design.
- `tools/manual_redactions.json` — what was redacted from which image, and why.
