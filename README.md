# Manaaki Central Documentation

This repository contains the documentation for Manaaki Central, built with [Docusaurus](https://docusaurus.io/).

## Development

### Prerequisites

- Node.js 18+ installed
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

This command starts a local development server and opens up a browser window at `http://localhost:3000`. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static hosting service.

### Deployment

The site is automatically deployed via GitHub Actions when changes are pushed to the `main` branch.

## Project Structure

```
manaakicare-docs/
├── docs/                        # Documentation MDX files
│   ├── intro.mdx
│   ├── getting-started/
│   ├── clients/
│   ├── referrals/
│   ├── service-episodes/
│   ├── activities/
│   ├── user-roles/
│   └── glossary.mdx
├── src/
│   └── css/
│       └── custom.css           # Custom styling
├── static/
│   └── img/                     # Static assets
├── docusaurus.config.ts         # Site configuration
└── sidebars.ts                  # Sidebar navigation
```

## Previewing a customer's terminology

Words like "Referral", "Service User" and "Case Worker" are white-labelled per
organisation. In the MDX they are written as `<Term path="referral" />`, which
renders the default English from `src/lib/terminology/default.json` unless the
site is told which organisation to load.

To preview the site as a given customer sees it, add `env` and `org_id` to the
URL **once**:

```
http://localhost:3000/?env=uat&org_id=<ORG_UUID>
```

| Param | Values |
|---|---|
| `env` | `local`, `sit` (api.manaakitech.com), `uat` (api-uat.manaakicentral.com) — see `customFields.terminologyApiUrls` in `docusaurus.config.ts` |
| `org_id` | The organisation's UUID — the `Organisation` record's own id, **not** the id of its `Terminology` row |

`local` resolves against whichever host you are viewing the docs on, keeping
the port from the config entry. Serving the docs over the LAN at
`http://192.168.100.10:3000` therefore fetches from
`http://192.168.100.10:8000`, not from the viewer's own machine. Browsing at
`localhost:3000` behaves as before.

The pair is cached in `sessionStorage` and re-appended on every client-side
navigation, so you only pass it once — the whole site stays in that
organisation's terminology for the rest of the session. Open a new tab or clear
session storage to go back to the defaults.

**Finding an organisation's UUID:** there is no public list endpoint. Log into
that environment's app, open DevTools → Network, and read it out of any request
path that embeds it (for example
`/api/v1/organisations/<uuid>/relationship-master/`).

The terminology endpoint itself
(`/api/v1/organisations/terminologies/<org_id>/docs/`) is public — no auth
needed — and returns `{}` if that organisation has no **active `docs`-type**
terminology row. Note that an organisation's `frontend` terminology is a
separate row with different key names, and the docs site cannot read it.

If the words do not change, open the browser console: an unknown `env`, a
failed fetch, and an empty `{}` response each log a warning naming the URL
that was tried. All three still fall back to the default terminology, so the
page renders normally either way.

## Product Name Configuration

To rename the product throughout the documentation:

1. Update `PRODUCT_NAME` constant in `docusaurus.config.ts`
2. Run find/replace in MDX files if needed

## Contributing

1. Create a new branch for your changes
2. Make your edits to the MDX files
3. Test locally with `npm start`
4. Submit a pull request

## Documentation Status

Most documentation pages are currently placeholders with the following structure:

- Overview of the topic
- Key concepts placeholder
- Related topics links

Content is being progressively added to these pages.
