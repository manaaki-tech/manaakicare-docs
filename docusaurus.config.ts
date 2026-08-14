import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// =============================================================================
// PRODUCT NAME CONFIGURATION
// To rename the product, update these values and run find/replace in MDX files
// =============================================================================
const PRODUCT_NAME = 'Manaaki Central';
const PRODUCT_TAGLINE = 'Case Management Documentation';
const DOCS_URL = 'https://docs.manaakitech.com';
const ORG_NAME = 'manaaki-tech';
const REPO_NAME = 'manaakicare-docs';

const config: Config = {
  title: PRODUCT_NAME,
  tagline: PRODUCT_TAGLINE,
  favicon: 'img/favicon.svg',

  // Production URL
  url: DOCS_URL,
  baseUrl: '/',

  // GitHub pages deployment config (if using)
  organizationName: ORG_NAME,
  projectName: REPO_NAME,

  customFields: {
    // Keyed by the `env` query parameter the application appends when it links
    // here. The application builds that link in AppHeader.tsx from
    // `import.meta.env.VITE_ENVIRONMENT`, which its deploy workflows hardcode.
    // The keys below must match those strings exactly — an unrecognised `env`
    // falls through to default English with only a console warning, which no
    // reader will ever see.
    //
    // What the application actually sends:
    //
    //   production  — the NPO production deployment. Only NPO exists; the
    //                 manaakicentral-prod environment and branch never did.
    //   sandbox     — HOSTNAME UNKNOWN, still absent rather than guessed.
    //   uat         — see the warning on the uat entry.
    //   sit         — believed correct.
    //   development — the dev-time fallback when VITE_ENVIRONMENT is unset.
    //
    // TWO THINGS OUTSIDE THIS REPO STILL BREAK TERMINOLOGY IN PRODUCTION.
    // Setting the URL below is necessary but not sufficient:
    //
    //   1. No organisation has a Terminology row of type=DOCS.
    //      TerminologyDocsView filters on that type and returns {} when there
    //      is none, so the endpoint answers every reader with an empty object.
    //   2. CORS on the production backend does not allow this site. Verified
    //      2026-08-14: the endpoint returns 200 to any origin, but only echoes
    //      access-control-allow-origin for https://manaakicentral.npo.org.nz.
    //      With no such header a browser blocks the read, and we fall back to
    //      English. Fix is adding https://docs.manaakitech.com to
    //      CORS_ALLOWED_ORIGINS on the backend App Service.
    terminologyApiUrls: {
      local: 'http://localhost:8000',
      development: 'http://localhost:8000',
      sit: 'https://api.manaakitech.com',
      // Recovered from the deployed NPO production bundle, where it is the
      // configured SDK baseUrl, rather than from the runbook — the runbook
      // still names api.manaakitech.com here, which is SIT.
      production: 'https://api.manaakicentral.npo.org.nz',
      // UNVERIFIED. The deployed UAT bundle references
      // manaakicentral-uat-backend.azurewebsites.net and never mentions
      // api-uat.manaakicentral.com, and the two resolve to different hosts.
      // Confirm before relying on this.
      uat: 'https://api-uat.manaakicentral.com',
    },
  },

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en-NZ',
    locales: ['en-NZ'],
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: '/',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchBarShortcutHint: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Serve docs at root
          editUrl: `https://github.com/${ORG_NAME}/${REPO_NAME}/tree/main/`,
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Social card image
    image: 'img/social-card.jpg',

    navbar: {
      title: PRODUCT_NAME,
      logo: {
        alt: `${PRODUCT_NAME} Logo`,
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: `https://github.com/${ORG_NAME}/${REPO_NAME}`,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started/logging-in',
            },
            {
              label: 'Referrals',
              to: '/referrals/overview',
            },
            {
              label: 'Activities',
              to: '/activities/overview',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Glossary',
              to: '/glossary',
            },
            {
              label: 'User Roles',
              to: '/user-roles/case-worker',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: `https://github.com/${ORG_NAME}/${REPO_NAME}`,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ManaakiTech. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },

    // Mermaid diagram theming
    mermaid: {
      theme: {
        light: 'neutral',
        dark: 'dark',
      },
    },

    // Algolia search (configure when ready)
    // algolia: {
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_SEARCH_API_KEY',
    //   indexName: 'manaakicare',
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
