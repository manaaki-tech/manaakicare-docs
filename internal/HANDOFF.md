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

- **2026-08-15 — Site reorganised, and the reference set corrected against
  source.** The manual now reads as one sequence per job; each entity (Entries,
  Care Journeys, Whānau, Activities) is a top-level section whose landing page
  explains what the thing is; each role's dashboard sits with that role. Four
  parallel audits against the frontend and backend found the reference pages
  documented a header bar, a dashboard widget and a table column that do not
  exist, and got the activity edit window wrong by a factor of ten.
  → [`sessions/2026-08-15-role-restructure-closeout.md`](sessions/2026-08-15-role-restructure-closeout.md)

**Two stacked PRs, both open, neither merged as of 2026-08-26. `main` has not
moved since `ae8ade7`; both are MERGEABLE / CLEAN with no reviews.**

| PR | Base | Size | What |
|---|---|---|---|
| [#10](https://github.com/manaaki-tech/manaakicare-docs/pull/10) `docs/structure` | `main` | 88 files | The reorganisation — every page that moved, was split, or was deleted |
| [#11](https://github.com/manaaki-tech/manaakicare-docs/pull/11) `docs/corrections` | `#10` | 33 files | The content corrections — every page that stayed put |

**Merge #10 first.** #9 is closed as superseded; branch `docs/role-restructure`
stays pushed as the 35-commit detailed history the two PRs summarise. Both
branches also carry the previously-stranded `internal/` docs and
`.claude/agents/` definitions from `chore/session-close-2026-08-15`.

**Verification gate:** no test suite. Use `npm run build` — meaningful because
`onBrokenLinks: 'throw'`.

---

## Next session

### 1. Readability pass on the "what you can do" pages

`docs/manual/{case-worker,intake-officer,supervisor}/what-you-can-do.mdx` were
`user-roles/*` reference pages until this session. Titles and openers were
rewritten; **the bodies are still reference-register prose inside a manual
written for non-confident readers**, and they now sit on the first screen of
every role's section. The launch session's readability audit ranked them among
the worst pages on the site.

What is left: four fenced ASCII arrow-chain diagrams that do not reflow on a
phone; "Key Responsibilities" written in third-person HR register in a manual
that otherwise says "you"; and "Best Practices", four H3s per page of generic
advice that largely duplicates the task pages directly beneath it — a deletion
candidate rather than a rewrite.

**Keep the permission tables.** They are why these pages exist and the one thing
a reader cannot get elsewhere. `intake-officer/what-you-can-do.mdx` has no Data
Visibility section at all, unlike the others — a real content gap, not a
formatting one. Fill it from the backend or say plainly that it is unspecified;
do not invent permissions.

### 2. Screenshots — done, with a shelf life

All nine Dashboards images plus four reference images come from current-build
captures; `tools/crop_dashboard_images.py` holds the boxes and redactions and is
idempotent. Raw captures stay outside the repo (they contain staff names) at
`/home/amj/dev/.manaakicare-docs-screenshot-originals/2026-08-15/`.

**The frontend sweep on `fix/terminology-sweep` has still not merged** (checked
2026-08-26). Several images show hardcoded English that will change when it does
— re-shoot then by swapping the source captures and re-running the tool. Full
list in the closeout.

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

No browser here, so the enlarge overlay has never been exercised (Escape,
backdrop, focus return, scroll lock, resize). Terminology on category pages is
verified as a pure function only — check live at
`/category/referrals/?env=production&org_id=90040e7a-…`, which should read
"Entry Management" with a card titled "Creating an Entry".

### Project context already mapped (don't re-explore)

- **`Screen`** — `src/components/Screen.tsx`; the enlarge affordance is measured
  at runtime (`naturalWidth` vs `clientWidth`, `:64`) rather than from a
  build-time table, because it depends on the viewport. `narrow` caps display at
  26rem (`Screen.module.css:47`).
- **`applyTerminology`** — `src/lib/terminology/applyTerminology.ts:57`. Pipe
  keys and aliases both go through `replaceAlias`. **`simpleKeys` deliberately
  still uses the literal replace** — no stored plural, so word-boundary matching
  would break "dashboards".
- **`PictureWords`** — guards on `resolved`, not `orgId`: the latter is set from
  the query string before the fetch, so it stays set when the request fails.
  `PICTURE_WORDS` covers 4 of `default.json`'s 9 keys.
- **Swizzles** — `src/theme/DocSidebarItem/{Category,Link}/`, `DocCard`
  (resolves description via `useDocById`), `DocCategoryGeneratedIndexPage`.
- **Backend answers** (`manaakicare-backend`) — activity edit window
  `apps/case_managements/permissions.py:36` (10 days), creator-only `:32`.
  Closing an episode `apps/case_managements/views.py:225` — `IsAuthenticated`
  only, **no role gate**. Docs terminology `apps/organisations/views.py:280`.
- **`tools/build_manual_preview.py`** — `PAGES` at `:29` is hand-maintained and
  must be updated whenever manual pages move.

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
- **Terminology silently returning `{}` is almost always `type`, not the API.**
  `TerminologyDocsView` (backend `apps/organisations/views.py:280`) filters on
  organisation + `type=DOCS` + `is_active`. The `Terminology.type` field
  **defaults to FRONTEND**, so a row created in Django admin without explicitly
  choosing "Docs" is invisible to the docs site while the app reads it happily.
  The endpoint returns `{}` for wrong-type, inactive and no-such-org alike, which
  is what makes it hard to diagnose.
- **`?env=` must match a configured key.** An unknown value makes the provider
  return *before* fetching, so there is no network call at all — which reads as
  a terminology bug rather than a typo. `prod`, `prd`, `dev` and `test` are now
  aliased, but anything else still silently falls back.
- **Checking out a branch changes which subagents exist.** `.claude/agents/`
  defines `docs-sweeper`, `docs-writer`, `docs-critic`, `role-mapper`. They
  vanish on a branch that lacks the directory.
- **Verify subagent output, especially negative claims and anything about
  permissions.** Across two sessions: one agent asserted no plural bug where a
  screenshot plainly showed one; one generalised a SIT finding to production;
  one ignored a stand-down and reported anyway; two of four died without
  delivering until asked. Their best contributions were their *refusals* — one
  correctly told me not to "fix" wording that matched `main`. Treat reports as
  evidence to check.

---

## Reminders for MJ — not Claude's to action

- **The manual's closure screenshot shows UI that is not shipped — decide before
  merging PR #11.** `static/img/manual/closure/01-close-the-journey.png` shows a
  dialog titled "Complete Care Journey". That string is in **no commit on any
  branch**; `origin/main` still reads "Complete Episode"
  (`ExitEpisodeDialog.tsx:184,403`), and `fix/terminology-sweep` was still
  unmerged on 2026-08-26. Either hold the merge, or restore the previous image
  from `…/2026-08-15/manual-closure-original/`. The prose is label-agnostic
  either way. *(An earlier note here claimed the modal was fixed — that was
  wrong, inferred from the screenshot rather than from source.)*

- **An unredacted phone number is published and you chose to leave it:**
  `static/img/manual/intake/05-referrer-and-risk.png` shows an ACC office number
  and a contact's number. Recorded here so it is a decision, not an oversight.

## Key reference docs

- `internal/sessions/2026-08-15-role-restructure-closeout.md` — this session.
- `internal/sessions/2026-08-15-user-manual-launch-closeout.md` — the launch.
- `internal/specs/2026-08-14-user-manual-launch-design.md` — design and the
  technical-challenge briefing.
- `tools/manual_redactions.json` — what was redacted from which image, and why.
