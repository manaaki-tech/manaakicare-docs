# HANDOFF

**Last updated:** 2026-09-17

> Pointer file, not a logbook. Session narratives live in `internal/sessions/`.
> Keep this under 200 lines.
>
> **These live in `internal/`, not `docs/`.** `docs/` is the published
> Docusaurus site with `routeBasePath: '/'` — anything placed there becomes a
> public page on docs.manaakitech.com and is indexed in site search.

---

## Where we are

`origin/main` is at `8e76242`. Site deploys automatically from `main` via
GitHub Pages.

- **2026-09-14 — Releases section grew two pages: care journey sorting and
  manager exit approval.** Both verified against the production branches, plus
  corrections to seven existing pages (five of them pre-existing errors) and a
  README fix. Merged as `8455627` (PR #14) and `8e76242` (PR #15).
  → [`sessions/2026-09-14-releases-section-sorting-and-exit-approval-closeout.md`](sessions/2026-09-14-releases-section-sorting-and-exit-approval-closeout.md)

- **2026-08-15 — Site reorganised, reference set corrected.** One sequence per
  job; each entity a top-level section. Four parallel audits found pages
  documenting a header bar, a dashboard widget and a column that do not exist.
  → [`sessions/2026-08-15-role-restructure-closeout.md`](sessions/2026-08-15-role-restructure-closeout.md)

- **2026-08-15 — User Manual shipped for launch.** Ten walkthroughs, 36
  screenshots redacted and published.
  → [`sessions/2026-08-15-user-manual-launch-closeout.md`](sessions/2026-08-15-user-manual-launch-closeout.md)

**One PR still open: [#11](https://github.com/manaaki-tech/manaakicare-docs/pull/11)
`docs/corrections`.** It is the main checkout's branch and is now well behind
`main` — it predates PRs #12–#15 and will need a rebase or a fresh look before
it is worth merging. #9 was closed as superseded; #10, #12, #13, #14, #15 merged.

**Verification gate:** no test suite. Use `npm run build` — meaningful because
`onBrokenLinks: 'throw'`.

---

## Next session

### 1. Make the site show the customer's words on a plain link

This is the live complaint. Everything below is settled fact — do not
re-derive it.

Terminology is **not** broken and CORS is **not** the problem (see gotchas).
`TerminologyContext.tsx:81` is `if (!env || !org) return;` — terminology loads
only when both are in the URL or already in `sessionStorage`. A plain link has
neither, so `src/lib/terminology/default.json` wins and the site reads
"Service Episode", "Referral", "Case Worker".

Confirmed working:
`/releases/2026-09-12-exit-approval/?env=production&org_id=90040e7a-ada0-4dc2-baaf-816713abf209`

Two options were put to MJ and **not yet chosen**:

- **Default the org.** Fall back to `env=production` + NPO's org id when no
  query params are present. Real per-org data, no words hardcoded, other
  tenants still override via query string. Costs: an org UUID in a public repo.
- **Change the fallback words.** Edit `default.json` to NPO's four tokens.
  Simpler, no UUID, but every tenant then sees NPO's words.

**Also fix either way:** frontmatter `title:` cannot contain `<Term>`, so both
new release pages hardcode "Care Journey" in frontmatter while their H1 uses
`<Term>`. Tab and sidebar disagree with the heading whenever terminology falls
back.

### 2. Delete the stale CORS comment

`docusaurus.config.ts:45-56` says production CORS blocks this site, "Verified
2026-08-15". **That is now false and it cost real time this session.** Tested
live 2026-09-17: the backend returns
`access-control-allow-origin: https://docs.manaakitech.com`. Delete the claim,
keep the note about which base URL is which.

### 3. Four screenshots for the sorting page

`docs/releases/2026-09-09-care-journey-sorting.mdx` has four
`{/* SCREENSHOT NEEDED ... */}` slots describing exactly what each must show.
The page reads fine without them. The date-range filter one matters most — that
feature had no documentation at all before.

### 4. Smaller, optional

- `__pycache__/` is not in `.gitignore`; it reappears whenever the image tools
  run, and a `.pyc` was committed once already.
- The dashboard page is headed "My Active Cases" but the widget renders
  `My ${t.serviceEpisodes}` → "My Care Journeys".

---

## Carry-forward gotchas

- **`docs/` is published.** Never put internal notes, specs or handoffs there.
- **The repo is public** (`manaaki-tech/manaakicare-docs`). Anything in
  `static/` is world-readable and permanent in history. Redact staff names
  before committing screenshots — `tools/pngkit.py` has `redact` and `crop`;
  there is no Pillow on this machine.
- **Unresolved:** pre-crop screenshots exposing two colleagues' bookmark bars
  are still in published history at commit `8046051`. Needs a history rewrite —
  a human decision, deliberately deferred.
- **Direct commits to `main` are blocked** by a pre-commit guard. Branch first.
- **`npm run build` wipes `build/`.** Never write generated artefacts there.
- **Check `manaakicentral-npo-prod`, never `dev`.** That is the production
  branch in both `mcentral-frontend` and `manaakicare-backend`. Two agents swept
  `dev` this session and missed two PRs that reached production the same day.
  **UAT is a side branch and is routinely behind production**, not ahead.
- **Production CORS now allows this site.** Tested 2026-09-17 against
  `https://api.manaakicentral.npo.org.nz/api/v1/organisations/terminologies/<org>/docs/`.
  Both `docs.manaakitech.com` and `manaakicentral.npo.org.nz` get
  `access-control-allow-origin`. The older "CORS is broken" note was stale.
- **Serving to another machine needs `npm start -- --host 0.0.0.0`.** Plain
  `npm start` binds `127.0.0.1` only. Now documented in `README.md` — this was
  rediscovered several sessions running.
- **Updated an image? Hard-refresh.** Filenames are reused, so the browser
  serves the cached copy and the change looks like it did not happen.
- **Never rescale a screenshot to make it smaller on the page.** `.frame img` is
  `width: 100%`, so the image scales to the frame — use the `narrow` prop
  (26rem, `Screen.module.css:47`). Rescaling barely changes apparent size and
  makes images blurry on HiDPI.
- **Checking out a branch changes which subagents exist.** `.claude/agents/`
  defines `docs-sweeper`, `docs-writer`, `docs-critic`, `role-mapper`.
- **Verify subagent output, especially negative claims.** This session: one
  reported five of seven images missing when all seven were present; several
  swept the wrong branch. Their best contribution remains the things they
  correctly refused to confirm. Long reports arrive **truncated** — ask for the
  tail in small numbered pieces.

---

## Reminders for MJ — not Claude's to action

- **Two product issues found while documenting the exit approval flow**, both
  outside this repo:
  - `Complete now` posts to the legacy `/service-episode/{id}/exit/`, which is
    `IsAuthenticated` + an organisation match only and never checks position
    (`apps/case_managements/views.py:342,378-384`). The restriction on case
    workers is **client-side only**.
  - An empty approver list is an unrecoverable dead end — you cannot pick
    yourself, there is no bypass, submit stays disabled.
- **The reject form promises something the product does not do.** *"This will be
  shared with the submitting staff member"* — nothing renders the rejection
  reason back to them, and there is no notification system at all.
- **`static/img/manual/closure/01-close-the-journey.png` needs re-checking.**
  It was flagged when it showed an unshipped label. The dialog has since changed
  again — it is now titled `Exit {serviceEpisode}` or
  `Request {serviceEpisode} Exit`, with `Complete {serviceEpisode}` only as the
  button. Whether the capture still matches was not verified.
- **An unredacted phone number is published and you chose to leave it:**
  `static/img/manual/intake/05-referrer-and-risk.png`.

## Key reference docs

- `internal/sessions/2026-09-14-releases-section-sorting-and-exit-approval-closeout.md` — most recent.
- `internal/sessions/2026-08-15-role-restructure-closeout.md`
- `internal/sessions/2026-08-15-user-manual-launch-closeout.md`
- `internal/specs/2026-08-14-user-manual-launch-design.md`
- `tools/manual_redactions.json` — what was redacted from which image, and why.
