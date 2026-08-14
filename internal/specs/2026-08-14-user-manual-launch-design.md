# User Manual for Launch — Design

**Date:** 2026-08-14 (Friday evening)
**Launch:** Monday 2026-08-17
**Branch:** `docs/user-manual-launch`
**Status:** Draft for founder review

---

## 1. The reader we are writing for

A middle-aged community care worker. Competent at their job, often not
confident with software. They do not browse documentation. They open it at
the moment something has gone wrong or they are stuck part-way through a
form, usually with a whānau member sitting in front of them.

Three consequences, and every decision below follows from them:

- **They search by what they are trying to do, not by what the system calls
  it.** "how do I write up a visit", not "Activities > Recording Visits".
- **They need to see the screen.** A sentence describing a button is worth
  less than a picture of it. This is why the 38 screenshots matter more than
  any prose we could write this weekend.
- **A page that disagrees with their screen destroys trust.** Once. If the
  manual says "Service Episode" and their screen says "Care Journey", they
  stop believing the manual and ring us instead. Section 4 is mostly about
  this.

## 2. What we already have

A 36-page Docusaurus reference site at `docs.manaakitech.com`, written and
verified against source over the past two days. It is genuinely good, and it
is organised **by system entity** — Referrals, Clients, Service Episodes,
Activities, User Roles. That is how the engineers who built it think about
it.

It is not how the reader in section 1 thinks. They do not arrive knowing
that enrolling a new whānau lives under "Referrals" and that the thing they
do next lives under "Service Episodes".

We also have 38 screenshots across three Word documents, which map onto the
real working lifecycle almost perfectly:

| Source document | Shots | Covers |
|---|---|---|
| `Screenshots_MC_Intake.docx` | 23 | Entry processing, choose service, find/add client, consent, document upload, the three intake decisions, entry details, whānau background, support network |
| `CaseManagement_Overview_Compliance_Closure.docx` | 7 | Care journey overview, actions, exit, staff assignment, service-specific fields, compliance monitoring |
| `Screenshots_Activities.docx` | 8 | Kaiāwhina dashboard, activities/case notes, remote activity type, note templates |

## 3. The recommendation

**Do not reorganise the site.** There is not time, and the reference content
is good.

**Add a task-oriented Manual layer on top of it.** A new section, first in
the sidebar, of end-to-end walkthroughs that follow a real working day and
are led by the screenshots. Each walkthrough is shallow and complete: it
gets the reader from start to finish of one real task, and links down into
the existing reference pages when they want detail.

The reference site becomes what it already is — the place you look things
up. The Manual becomes the place you learn the job.

This is achievable by Monday because the walkthroughs are mostly
*sequencing and captioning* work over screenshots that already exist, not
new research.

### Proposed structure

A `Manual` category, pinned above `Getting Started`:

1. **Start here** — what the system is for, in plain language, five
   sentences. What a "journey" is in one paragraph, with no other jargon.
2. **Signing in** — thin wrapper linking to the existing SSO page.
3. **Finding your way around** — the left menu and the top bar, annotated.
4. **Your day at a glance** — the dashboard, what each tile means, what to
   click first.
5. **Taking on a new whānau** — the full intake walkthrough. The richest
   section; 23 screenshots. Ends at the three decisions (send for approval /
   accept / accept and assign) with plain-language guidance on which to pick.
6. **Working with someone** — the journey overview page, assigning and
   reassigning staff, service-specific fields.
7. **Writing up what you did** — activities, in-person vs remote, note
   templates.
8. **Staying on top of deadlines** — compliance monitoring.
9. **Finishing up** — exit summary, closure checklist, evaluation form.
10. **When something looks wrong** — troubleshooting, including "the words
    on my screen are different from the words in this manual".

That is ten pages. Items 2–4 largely re-frame existing content. Items 5–9
are new, and are where the weekend goes.

### Writing rules for these pages

Non-negotiable, because they are what makes it usable for this reader:

- Every page opens with what the reader will have achieved by the end.
- One action per numbered step. Never two.
- Button and field names in **bold**, quoted exactly as they appear.
- A screenshot at every decision point, not every step.
- No jargon without a plain-language gloss on first use, in the same
  sentence. "wizard", "modal", "dispatch", "toggle" and status names in
  CAPS are all suspect.
- Sentences under 25 words.
- Say what happens *after* they click. Non-confident users need
  confirmation they did the right thing.

---

## 4. Technical challenges — read this part

Ranked by how badly each one hurts on Monday.

### 4.1 BLOCKER — there is no `prod` terminology environment

`docusaurus.config.ts` configures terminology API URLs for `local`, `sit`
and `uat`. There is no `prod`.

Terminology only loads when the reader arrives with `?env=…&org_id=…` in the
URL; the site then fetches
`{baseUrl}/api/v1/organisations/terminologies/{org}/docs/`. With no `prod`
entry, a production deep link falls into the "unknown env" branch, logs a
console warning nobody will ever see, and silently renders **default English
terminology** — Service Episode, Client, Case Worker, Referral.

So on Monday, every user at a tenant that renames things reads a manual in
vocabulary their software does not use. Silently. This is the single highest
-value fix on the list and it is roughly one line, once we know the
production API hostname.

Three things must all be true for terminology to work in production:

1. `prod` added to `terminologyApiUrls` with the real hostname.
2. That endpoint publicly readable and CORS-enabled for
   `https://docs.manaakitech.com` — it is fetched from the browser, with no
   credentials.
3. The application links to the docs **with `env` and `org_id` attached**.
   This is a change in the app repo, not here. Needs confirming.

Related, and worth knowing: the org is remembered in `sessionStorage`, which
is per-tab. A user who opens the manual in a second tab, or reopens it
tomorrow from a bookmark, silently drops back to default terminology.

### 4.2 The screenshots and the prose cannot agree

This is the structural one, and it has no clean fix.

Prose is swapped at runtime by the `<Term>` component. **Screenshots are
pixels and cannot be.** The supplied screenshots were taken on a tenant that
renames nearly everything:

| Screenshot says | Default docs say |
|---|---|
| Care Journey | Service Episode |
| Entry / New Entry / Entry Details | Referral |
| Kaiāwhina (and Kaimahi) | Case Worker |
| Whānau | Client / Service User |
| In-progress Journeys | — |

Worse, **the application itself is only half-migrated**. In a single
screenshot of the caseload page the sidebar reads "In-progress Journeys",
the heading reads "My Caseload", the tile beneath it reads "Service episodes
currently in progress", and the table below is headed "My Service Episodes"
with references formatted `SEP-2026-…`. The journey overview screen uses
"Kaiāwhina" in one panel and "Kaimahi" in another. So the screenshots do not
even agree with themselves.

Options:

- **(a) Caption convention — recommended for Monday.** Standardise a note
  under every screenshot: *"Your organisation may use different words for
  some of these. The buttons and their positions are the same."* Plus a
  short "Words used in this manual" page mapping the common renames. Cheap,
  honest, ships tonight. Does not fix it, but stops it destroying trust.
- **(b) Re-shoot everything on default configuration.** Correct, and the
  right answer for the week after launch. Not a weekend job, and it needs a
  clean demo tenant that does not exist yet.
- **(c) Per-tenant screenshot sets.** The real long-term answer if we sell
  to more orgs with strong vocabulary preferences. Substantial build work —
  screenshot pipeline keyed by `org_id`. Not now.

**Separately, and this is a product bug worth raising with the team:** the
inconsistency inside the app is a defect in its own right. Our most
vocabulary-sensitive customer sees three different words for the same thing
on one screen. Fixing that fixes the docs problem at the source.

### 4.3 Search is indexed on default terminology

Search is `@easyops-cn/docusaurus-search-local` — a **static index built at
build time**, from the default English. A kaiāwhina who searches "care
journey", the only phrase they have ever seen on their screen, gets nothing.

For a non-confident user, an empty search result reads as "this manual does
not cover it" and they stop looking.

Cheap mitigation for Monday: seed each Manual page's frontmatter with
`keywords` covering the common tenant vocabulary, so those words are in the
index even when the visible prose says otherwise. Not elegant. Works.

### 4.4 We would be publishing a named customer's data on a public site

`docs.manaakitech.com` is public GitHub Pages. The screenshots contain:

- a named customer organisation, repeatedly ("Ngāti Porou Oranga – Whānau
  Oranga")
- staff names and a work email address (e.g. a signed-in user in the sidebar
  and an assigned kaiāwhina with their address visible)
- service and contract names

The *client* data looks like test data ("Test Smith", "test janeACC"), so
this is not a patient-privacy incident. It is still a commercial and
courtesy problem: we would be publicly disclosing who our customer is and
who works there, without asking. **Needs a decision before anything is
deployed.** Either redact, or get written sign-off from the customer, or
re-shoot on a demo tenant.

### 4.5 The screenshots show a pre-release build with visible defects

Present in the supplied shots:

- junk test content in user-visible fields — a "Reason for Entry" reading
  `a af adfD SGd`, clients called `test janeACC`
- a plural bug: a tile rendering **"1 activities"**
- placeholder-looking data throughout

Our reader is cautious and easily put off. A manual illustrated with
gibberish teaches them that the system is unfinished. Either clean the data
and re-shoot the worst offenders, or crop tightly enough to exclude them.

### 4.6 Screenshot quality and pipeline

- **Resolution is 1x and modest.** Most shots are 500–1200px wide; the
  Docusaurus content column is ~750–800px, so anything under about 1600px
  looks soft on a modern laptop, which is what most users have. The tight
  crops (down to 384×138) are fine as inline call-outs; the full-page ones
  are borderline.
- **Framing is inconsistent** — some include browser chrome and scrollbars,
  some do not; zoom levels vary between shots.
- **No document tooling on this machine.** No `pandoc`, `libreoffice`,
  `imagemagick`, or `python-docx`. *Already solved* — the `.docx` files are
  ZIP archives and I have extracted all 38 PNGs with the standard library,
  along with their captions and ordering. But there is no image-optimisation
  tool available, so PNGs go up unoptimised (~2.7 MB total) unless we
  install one.

### 4.7 Build will fail on a broken link

`onBrokenLinks: 'throw'`. Adding ten pages and a lot of cross-links, fast,
late at night, will break the build at least once. Mitigation is simply to
run `npm run build` before pushing, every time — not just `npm start`, which
does not enforce it.

### 4.8 Smaller things

- `themeConfig.image` points at `img/social-card.jpg`, which does not exist.
  Links shared into a WhatsApp or Teams group — very likely how this manual
  actually reaches staff — will preview badly.
- No print stylesheet. Some of this audience will want a printout, and some
  organisations will insist on one for induction packs.
- The site has no feedback path. On launch day we will want to know which
  page people got stuck on.

---

## 5. Plan of work

Ordered so that the highest-value, least-reversible-risk items land first.

**Tonight (no approval needed — additive, on a branch, nothing deployed):**

1. Extract and normalise all 38 screenshots into `static/img/manual/…` with
   meaningful names. *(Extraction already done.)*
2. Build a screenshot catalogue: what each shows, which walkthrough step it
   belongs to, what vocabulary and what personal data is visible in it.
3. Draft the ten Manual pages against that catalogue.
4. Add the `Manual` category to `sidebars.ts`, above Getting Started.
5. Add the "Words used in this manual" page and the standard screenshot
   caption.
6. Seed `keywords` frontmatter for tenant vocabulary (4.3).
7. Run `npm run build` clean.

**Needs a decision from you before deploy:**

- **4.4** — publishing a named customer's org and staff names. My
  recommendation: redact the sidebar user block and any email addresses,
  and replace the org name where it is legible. I will flag every affected
  image in the catalogue.
- **4.1** — the production API hostname, so `prod` can be added.
- Whether the app already deep-links to the docs with `env` and `org_id`.

**After launch, in priority order:**

- Re-shoot on a clean demo tenant with sensible sample data (fixes 4.2b,
  4.4, 4.5, 4.6 in one pass).
- Raise the in-app terminology inconsistency with the product team (4.2).
- Print stylesheet and a feedback widget.

## 6. What I am explicitly not doing

- Not restructuring or rewriting the existing 36 reference pages. They stay
  as they are and the Manual links into them.
- Not building a per-tenant screenshot pipeline.
- Not deploying anything. All work stays on `docs/user-manual-launch`.
