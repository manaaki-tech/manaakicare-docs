# HANDOFF

**Last updated:** 2026-11-07

> Pointer file, not a logbook. Session narratives live in the engineering repo
> (`manaakicentral-engineering/sessions/`) or, for August, in `internal/sessions/`.
> Keep this under 200 lines.
>
> **These live in `internal/`, not `docs/`.** `docs/` is the published
> Docusaurus site with `routeBasePath: '/'` — anything placed there becomes a
> public page and is indexed in site search. **This repo is public: so is this
> file.** No real customer codes, programme names or staff names here.

---

## Where we are

Release is **Mon 9 Nov 2026**. `npm run build` is the gate
(`onBrokenLinks: 'throw'`). `main` auto-deploys to GitHub Pages.

- **2026-11-07 — Virtual clients launch merged.** PR
  [#18](https://github.com/manaaki-tech/manaakicare-docs/pull/18) merged
  (`c07be37`) and deployed: virtual clients pages, 41 screenshots, 13 dashboard
  images, stale-page fixes, a "Virtual Clients" sub-menu under each role, the
  overview page renamed "What is a virtual client?", mouse pointers removed from
  the screenshots. PR #11 was closed (see Next session, item 2).
  → [closeout](https://github.com/manaaki-tech/manaakicentral-engineering/blob/main/sessions/2026-11-07-virtual-clients-launch-merged-closeout.md)
- **2026-08-15 — User Manual launched; manual reorganised by job.**
  → [`sessions/2026-08-15-user-manual-launch-closeout.md`](sessions/2026-08-15-user-manual-launch-closeout.md),
  [`sessions/2026-08-15-role-restructure-closeout.md`](sessions/2026-08-15-role-restructure-closeout.md)

### Branch and worktree layout (as of 2026-11-07)

Repo: `/home/amj/dev/manaakicare-docs`. Only deploy target: **GitHub Pages from
`main`** (`.github/workflows/deploy.yml`). A pull request runs the build and
skips the deploy. There is **no dev or sandbox docs site**; sandbox belongs to
the app (`mcentral-frontend`).

| Where | Branch | State | Port |
|---|---|---|---|
| main checkout `/home/amj/dev/manaakicare-docs` | `docs/session-close-2026-11-07` (this handoff, off `origin/main`) | only this file changed | 3000 |
| `.worktrees/other-areas-refresh` | `docs/other-areas-refresh` at `df75e55` | **48 uncommitted files**, another session's work, not reviewed, not rebased | 3001 |
| `.worktrees/safety-alerts-videos` | `docs/safety-alerts-videos` at `07a4aa9` | PR #16 merged; safe to remove | — |
| remote only | `docs/corrections` | PR #11 closed, branch kept for salvage | — |

`docs/virtual-clients-screenshots` and `docs/virtual-clients-launch` are
merged and stale. Untracked in the main checkout and **not committed**:
`CLAUDE.md` (the docs-site writing rules), `tools/__pycache__/` (add to
`.gitignore`), `.worktrees/`.

---

## Next session

Do these in order. Item 2 waits on item 1 because both edit the same pages
(dashboards, `entries/`, `care-journeys/`, `activities/`, `whanau/`).

### 1. Integrate the 3001 work

1. Ask MJ whether `docs/other-areas-refresh` is finished and no session is still
   on it. Look at `git -C .worktrees/other-areas-refresh status --short` (48 files).
2. If yes: commit it there, rebase onto the new `origin/main`, `npm run build`,
   open a PR, wait for CI, then MJ says "merge it".
3. Check what it changes on the "program manager" pages (item 4) before doing
   that item yourself.

### 2. Salvage PR #11 (`docs/corrections`)

Closed on 2026-11-07 before its contents were checked; they are valuable. Open
a **new branch off `main`** and bring over the changes. 29 of its 35 files apply
cleanly; the 6 that conflict are `care-journeys/closing-an-episode.mdx`,
`care-journeys/managing-episodes.mdx`, the three `manual/*/dashboard.mdx`, and
`static/img/manual/closure/01-close-the-journey.png`. Re-derive those 6 against
the current pages.

Still wrong on `main` today (verify each in the source before editing):

- Activity edit window says 24 hours; the code says **10 days**
  (`permissions.py:36` in `manaakicare-backend`). Pages:
  `activities/overview.mdx:59`, `activities/recording-visits.mdx:78`,
  `activities/viewing-activity-history.mdx:44`.
- `whanau/searching-for-clients.mdx:30-31` says search does not match reference
  numbers. It does.
- `finding-your-way-around-the-system.mdx:18` lists a theme toggle and refresh
  in the header. Neither exists. `manual/supervisor/dashboard.mdx:431,450` tell
  readers to click a refresh button.
- New-client form is listed with 6 fields (it has 13); document upload omits its
  required field; staff assignment does not set a primary responsible;
  closure justification only appears after Override.
- Code: `Screen.tsx` enlarge in place; two `applyTerminology` bugs.

Do **not** take its `internal/HANDOFF.md` or closeout edits. Its closure image
shows "Complete Care Journey" text that was not shipped when taken. Check the
app first.

### 3. Remaining virtual clients and dashboard work

- **6 placeholders left:** `SCREENSHOT NEEDED` in
  `manual/case-worker/virtual-clients-closing-and-fixing.mdx` (1),
  `manual/intake-officer/linking-a-virtual-client.mdx` (2),
  `manual/supervisor/virtual-clients-closures-and-consent.mdx` (3). Capture list
  items 13, 46, 51, 53, 42–44. Remove the placeholder if no capture is possible
  before 9 Nov.
- **Page claims that contradict screenshots, left as written:** managers closing
  immediately (items 13, 46); "Delete" on notes being manager-only; the closure
  dialog's follow-up choices; Delete case greyed out (item 53).
- `static/img/dashboards/intake-officer/tabs.png` has out-of-date counts.
- 9 safety-alert videos still need a human check.

### 4. "Program manager" wording

Still on 13 non-release pages (36 hits): `manual/supervisor/what-you-can-do.mdx`
(13), `manual/supervisor/dashboard.mdx` (8), `intro.mdx`,
`how-the-work-flows.mdx`, `entries/submitting-for-review.mdx`,
`entries/overview.mdx` (2 each), and one each in
`organisation-documents/overview.mdx`, `manual/supervisor/moving-work-between-staff.mdx`,
`manual/case-worker/what-you-can-do.mdx`, `manual/case-worker/dashboard.mdx`,
`entries/creating-a-referral.mdx` (also still says "supervisor or programme
manager" in the dispatch table), `care-journeys/starting-an-episode.mdx`,
`care-journeys/overview.mdx`. Release notes are already done. Use "manager".

### Older open items (August, not checked since)

The four `manual/<role>/what-you-can-do.mdx` bodies still need a readability
pass (keep the permission tables), and several questions for the frontend team
are open (`entry` hardcoding, `With Kaiāwhina`, undocumented referral statuses,
a `withdrawn` filter). Details are in the two 2026-08-15 closeouts.

### Project context already mapped (don't re-explore)

- **Sidebar** — `sidebars.ts:70-90` Case Worker "Virtual Clients" category
  (list page, slug `/category/case-worker-virtual-clients`); `:82` link item to
  `/virtual-clients/overview`; `:108` and `:136` one-page role categories that
  open the page directly; `:180-181` top-level "Virtual Clients" category.
- **Overview page** — `docs/virtual-clients/overview.mdx`.
- **Redaction** — `tools/pngkit.py:163` `fill`, `:182` `redact` (fills with a
  sampled colour, never blurs), `:199` `crop`. Boxes in
  `tools/manual_redactions.json` (`vc-*` keys).
- **`<Screen>`** — `src/theme/MDXComponents.tsx`; props `src alt caption`.
  `src/components/Screen.tsx`.
- **App facts checked against source** (`mcentral-frontend`, worktree
  `.worktrees/vc-sandbox-docs`): `pending_service_dispatch` shows as "Ready to
  Send"; channels are Internal, Face to Face, Walk-in, Email, Electronic, Event,
  Network; the field is "Referrer contact"; the compliance rail opens a Sheet by
  click and has Pin panel.
- **App issues raised:** mcentral-frontend#550 (Intake Officer High Priority
  tile count differs from its panel; the two IO screenshots still need
  attaching to it by hand), #549 (a customer name hard-coded in the Virtual
  Clients UI).

---

## Carry-forward gotchas

- **`docs/` is published and the repo is public.** Anything in `static/` is
  world-readable and permanent in history. Redact in pixels (`tools/pngkit.py`),
  never with CSS.
- **Deleting an image does not remove it from history.** Two unresolved
  exposures, both need a history rewrite (a human decision): the deleted
  `static/img/dashboards/supervisor/pending-requests.png` (a real customer code
  and programme name), and pre-crop screenshots with two colleagues' bookmark
  bars at commit `8046051`.
- **PR text is screened.** `gh pr create` was refused once for repeating a real
  customer code; the push in the same command did not run. Use generic wording.
- **Direct commits to `main` are blocked** by a pre-commit guard. Branch first.
  Merging to `main` deploys the live site: wait for MJ to say "merge it".
- **Screenshots:** the delivered captures are 1568×730, JPEG-derived, with a
  mouse pointer and scrollbar drawn in. Resolution cannot be fixed after the
  fact; recapture at 2x if wanted. Pointers are removed except where they show
  what to click, in red. Two of the four red pointers were added by hand
  (`closing-and-fixing/01-person-row-menu.png`,
  `notes-and-follow-ups/04-notes-list-and-filter.png`), not captured.
- **`redact` samples 6 px left of the box.** If that lands on text the fill is
  the wrong colour. Check by eye; repair by copying pixels from a sibling image.
- **`.claude/agents/` subagents vanish** on a branch that lacks the directory.
- **Verify subagent output.** A hand-back is not user approval.

---

## Reminders for MJ — not Claude's to action

- **Decide on a history rewrite** for the two exposures above.
- **Attach** `intake-officer/overview.png` and `high-priority.png` to
  mcentral-frontend#550 (drag and drop).
- **Decide whether to commit `CLAUDE.md`** (the docs-site writing rules).
- **An unredacted ACC office phone number is published and you chose to leave
  it:** `static/img/manual/intake/05-referrer-and-risk.png`. Recorded so it is
  a decision, not an oversight. The service name in
  `releases/2026-09-12-exit-approval/04-pending-exit-approvals.png` is also
  left deliberately (it is the same across NZ).
- **The manual's closure image** shows "Complete Care Journey", a label that was
  not in the app when captured. Check whether it has shipped.

## Key reference docs

- [Closeout 2026-11-07](https://github.com/manaaki-tech/manaakicentral-engineering/blob/main/sessions/2026-11-07-virtual-clients-launch-merged-closeout.md)
  — this session, with the full loose-ends list.
- `internal/sessions/2026-08-15-*-closeout.md` — the August sessions.
- `tools/manual_redactions.json` — what was redacted from which image, and why.
- `CLAUDE.md` (untracked, main checkout) — docs-site writing rules.
