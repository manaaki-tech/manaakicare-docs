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
