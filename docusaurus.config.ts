import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// =============================================================================
// PRODUCT NAME CONFIGURATION
// To rename the product, update these values and run find/replace in MDX files
// =============================================================================
const PRODUCT_NAME = 'ManaakiCare';
const PRODUCT_TAGLINE = 'Case Management Documentation';
const DOCS_URL = 'https://docs.manaakitech.com';
const ORG_NAME = 'manaaki-tech';
const REPO_NAME = 'manaakicare-docs';

const config: Config = {
  title: PRODUCT_NAME,
  tagline: PRODUCT_TAGLINE,
  favicon: 'img/favicon.ico',

  // Production URL
  url: DOCS_URL,
  baseUrl: '/',

  // GitHub pages deployment config (if using)
  organizationName: ORG_NAME,
  projectName: REPO_NAME,

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
      copyright: `Copyright © ${new Date().getFullYear()} Manaaki Technologies. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },

    // Mermaid diagram theming - ManaakiCare earthy palette
    mermaid: {
      theme: {
        light: 'base',
        dark: 'dark',
      },
      options: {
        themeVariables: {
          // Primary colours (Sage green)
          primaryColor: '#E8F2EC',
          primaryTextColor: '#2D4A3E',
          primaryBorderColor: '#5C8A72',
          // Secondary colours (Teal)
          secondaryColor: '#E6F2F2',
          secondaryTextColor: '#2A4A4A',
          secondaryBorderColor: '#4A8B8C',
          // Tertiary colours (Amber)
          tertiaryColor: '#F7F0E0',
          tertiaryTextColor: '#4A3D20',
          tertiaryBorderColor: '#C4A35A',
          // Background
          background: '#FDFCFA',
          mainBkg: '#E8F2EC',
          // Lines and text
          lineColor: '#8B8178',
          textColor: '#3D3830',
          // Node colours
          nodeBorder: '#5C8A72',
          clusterBkg: '#F5F3F0',
          clusterBorder: '#8B8178',
          // State diagram specific
          labelBackground: '#FDFCFA',
          // Notes (Brown)
          noteBkgColor: '#F5F0E8',
          noteTextColor: '#4A3D30',
          noteBorderColor: '#8B7355',
        },
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
