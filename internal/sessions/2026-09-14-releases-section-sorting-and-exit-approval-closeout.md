# 2026-09-14 — Releases section: care journey sorting and manager exit approval

**Status:** Both release pages written, reviewed against production source, merged and deployed.
**Branch:** `docs/releases-sept` and `docs/shrink-exit-screenshots`, both deleted after merge
**Merge commits:** `8455627` (PR #14), `8e76242` (PR #15)
**PRs:** [#14](https://github.com/manaaki-tech/manaakicare-docs/pull/14), [#15](https://github.com/manaaki-tech/manaakicare-docs/pull/15)
**CI:** Deploy to GitHub Pages succeeded for both

> Durable snapshot. Living state lives in `internal/HANDOFF.md`. Read HANDOFF first;
> come here for the archival record.

---

## What this session was supposed to do

Document the user-visible changes deployed since the 1 September follow-up
resolution page — starting with the care journey table's new default sort order
and the ability to sort by latest activity / entry-details date. The scope grew
twice mid-session: first when a sweep found several other shipped changes, then
again on 12 September when the manager exit-approval workflow shipped to
production during the session.

Screenshots were agreed to be marked-up slots rather than invented, with MJ
supplying captures.

---

## What landed

### Commits

```
8e76242 Merge pull request #15 from manaaki-tech/docs/shrink-exit-screenshots
dc20806 docs(releases): restore full-resolution shots and centre narrow figures
cde76b4 docs(releases): constrain the exit approval dialogs with narrow
1e7a6a8 docs(releases): halve the exit approval screenshots
8455627 Merge pull request #14 from manaaki-tech/docs/releases-sept
2fd4658 docs(entries): point the entries list image at the file that exists
1b6ddb1 docs(readme): say how to serve the site to another machine
a9e047c docs(releases): care journey sorting and manager exit approval
```

22 files changed, 471 insertions, 28 deletions.

### New pages

- `docs/releases/2026-09-09-care-journey-sorting.mdx` — **four `SCREENSHOT NEEDED`
  slots still unfilled.** Renders fine without them.
- `docs/releases/2026-09-12-exit-approval.mdx` — seven screenshots, all redacted.

### Verification

`npm run build` after every change — meaningful because `onBrokenLinks: 'throw'`.
No test suite in this repo. Two independent `docs-critic` passes against the
**production** branches; every image reference in `docs/` verified to resolve.

---

## Non-obvious findings

- **Always check `manaakicentral-npo-prod`, never `dev`.** Two research agents
  swept `origin/dev` and missed two PRs that reached production the same day
  (`feat/activity-default-start-time-now` #386, `feat/closure-reason-tooltip`
  #388). Frontend prod is `origin/manaakicentral-npo-prod`; backend prod has the
  same name in `manaakicare-backend`. UAT is a side branch off sit and is
  routinely **behind** production, not ahead.

- **Exit approval is ON by default.** `ServiceContract.direct_exit_acceptance_roles`
  defaults to `"supervisor,manager"`
  (`manaakicare-backend/apps/services/models/services.py:180-190`). An early draft
  said the opposite. It is per **service contract**, checked against the user's
  `ServiceStaff.position` in that service — so one person can close directly on
  one service and must request on another. Not `capabilities.ts`, which has no
  exit-related capability at all.

- **`Complete now` bypasses the role gate.** It posts to the legacy
  `POST /api/v1/service-episode/{id}/exit/`, whose `ExitEpisodeView` is
  `permission_classes = [IsAuthenticated]` plus an organisation match
  (`apps/case_managements/views.py:342,378-384`) and never calls
  `user_can_use_direct_exit_acceptance`. The new exit-request endpoints *are*
  gated. **The restriction on case workers is client-side only.** Docs deliberately
  say "you must request approval", never that the system prevents it.

- **Nobody is notified of a rejection.** No notifications app, no email, no badge
  — verified by search, not assumption. The reason lives only in an `Exit Rejected`
  activity (`views.py:863,868`) and nothing points the requester there. The reject
  form nonetheless promises *"This will be shared with the submitting staff member"*
  (`PendingExitRequestsWidget.tsx:353`). A grep for `.rejectionReason` across the
  frontend finds write-side state only — no read, no render anywhere.

- **An empty approver list is an unrecoverable dead end.** You cannot pick yourself
  (`ExitEpisodeDialog.tsx:151-154`), there is no bypass, and submit stays disabled.
  A sole supervisor on a service cannot close their own journeys.

- **`Last Entry Change` is far narrower than its label.** Only four saves move it —
  Consent, Cultural Profile, Intake Assessment, Service Delivery Preferences
  (`referral-hooks.ts`, callers of `useTouchEntryDetailChange`). Fire-and-forget;
  failures logged, never surfaced. `Last Activity` is stamped by any
  `Activity.save()` and there is **no `delete()` override**, so deleting an
  activity leaves the date stale.

- **"Latest Activities" never reached production.** Added 3 Sep, removed 7 Sep, both
  in the same prod deploy. Do not document its removal — users never saw it. Easy
  to confuse with the **Last Activity** column, which is live.

- **The backend nulls-last fix was not on backend prod** when the sorting page was
  written, while frontend prod was current. The page therefore makes **no claim
  about where empty rows sort** — deliberate, and still correct once it catches up.

- **`Screen` sizing: use `narrow`, never rescale the PNG.** `.frame img` is
  `width: 100%`, so the image always scales to the frame. Halving pixels barely
  changed apparent size (`max-width: 100%` was already capping) and made images
  **blurry**, because `narrow`'s 26rem needs ~832 device px on HiDPI.

- **`.narrow` figures were left-aligned site-wide.** `.screen` is a flex column with
  default `align-items: stretch`, so a `max-width`-capped frame pinned left. Fixed
  with `margin-inline: auto` in `Screen.module.css`. Affects 10+ pages, not just
  the new ones.

- **CORS is FIXED — the config comment was stale and cost real time.**
  `docusaurus.config.ts:45-56` still claims production CORS blocks
  `docs.manaakitech.com` ("Verified 2026-08-15"). Tested live this session: the
  backend now returns `access-control-allow-origin: https://docs.manaakitech.com`.
  **That comment is still in the file and should be deleted.**

- **Why the live site still shows English.** Not CORS. `TerminologyContext.tsx:81`
  is `if (!env || !org) return;` — terminology only loads when **both** `env` and
  `org_id` are in the URL or already in `sessionStorage`. A plain link has neither.
  Confirmed working: `/releases/2026-09-12-exit-approval/?env=production&org_id=90040e7a-ada0-4dc2-baaf-816713abf209`

- **Frontmatter `title:` cannot take `<Term>`.** Both new pages hardcode
  "Care Journey" in frontmatter while the H1 uses `<Term>`, so tab/sidebar and
  heading disagree whenever terminology falls back. Unresolved — depends on which
  terminology fix is chosen.

- **Docs pre-dated the product in one place.** PR #13 added an **Exit Summary** row
  to `closing-an-episode.mdx` without removing the old **Closure Notes** row,
  publishing one field as two. There is one field: state `closureNotes`, labelled
  "Exit Summary", submitted as `closure_notes`, and the generated activity
  hardcodes the heading **"Closure Notes:"** (`services.py:230-231`) — so the old
  name legitimately survives in the record.

- **Image updates look like nothing happened.** Filenames are reused, so the browser
  serves the cached copy until a hard refresh. Cost a round trip this session.

---

## Project context mapped during this session

- **Terminology fetch** — `src/lib/terminology/TerminologyContext.tsx:96`,
  `{baseUrl}/api/v1/organisations/terminologies/{org_id}/docs/`; gate at `:81`.
  Base URLs in `docusaurus.config.ts` `customFields.terminologyApiUrls`.
- **`Screen`** — `src/components/Screen.tsx`; CSS in `Screen.module.css`,
  `.narrow .frame` caps at 26rem (`:47`).
- **Releases sidebar** — `sidebars.ts`, an **explicit `items` array**, so
  `sidebar_position` is inert. Newest page must be **prepended**.
- **`pngkit`** — `tools/pngkit.py`: `read`, `write`, `redact(img, box)`,
  `crop`, `scale_to_width`. Stdlib only; no Pillow on this machine.
- **Redaction script for this session** — not committed; boxes recorded in the
  scratchpad copy of `redact_closure.py`.
- **Exit mode logic** — `src/lib/auth/exit-permissions.ts:44`
  (`getExitAcceptanceType`), consumed at
  `src/features/service-episodes/components/ExitEpisodeDialog.tsx:128-136`.
- **Approvals widget** — `src/features/dashboard/components/exit-requests/PendingExitRequestsWidget.tsx`;
  quick-approve at `:115-134`.

---

## See also

- `internal/sessions/2026-08-15-role-restructure-closeout.md`
- `internal/sessions/2026-08-15-user-manual-launch-closeout.md`
