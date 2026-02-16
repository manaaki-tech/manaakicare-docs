import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'generated-index',
        title: 'Getting Started',
        description: 'Learn how to get started with Manaaki Central',
      },
      items: [
        'getting-started/workflow-overview',
        'getting-started/logging-in',
        'getting-started/understanding-your-dashboard',
        'getting-started/navigating-the-system',
      ],
    },
    {
      type: 'category',
      label: 'Dashboards',
      link: {
        type: 'generated-index',
        title: 'Dashboards',
        description: 'Learn about the different dashboards in Manaaki Central based on your role',
      },
      items: [
        'dashboards/intake-officer',
        'dashboards/supervisor',
        'dashboards/case-worker',
      ],
    },
    // NOTE: Clients, Referrals, Service Episodes, and Activities sections
    // are hidden from sidebar for now. The docs files still exist and are
    // accessible via direct URL. Uncomment when ready to publish.
    //
    // {
    //   type: 'category',
    //   label: 'Clients',
    //   link: { type: 'generated-index', title: 'Client Management', description: 'Learn how to manage clients in Manaaki Central' },
    //   items: ['clients/searching-for-clients', 'clients/viewing-client-details', 'clients/client-documents', 'clients/family-relationships'],
    // },
    // {
    //   type: 'category',
    //   label: 'Referrals',
    //   link: { type: 'generated-index', title: 'Referral Management', description: 'Learn how to create and manage referrals' },
    //   items: ['referrals/overview', 'referrals/creating-a-referral', 'referrals/client-information', 'referrals/referral-details', 'referrals/uploading-documents', 'referrals/submitting-for-review'],
    // },
    // {
    //   type: 'category',
    //   label: 'Service Episodes',
    //   link: { type: 'generated-index', title: 'Service Episodes', description: 'Learn about service episode management' },
    //   items: ['service-episodes/what-are-service-episodes', 'service-episodes/starting-an-episode', 'service-episodes/managing-episodes', 'service-episodes/closing-an-episode'],
    // },
    // {
    //   type: 'category',
    //   label: 'Activities',
    //   link: { type: 'generated-index', title: 'Activities & Case Notes', description: 'Learn how to record and manage activities' },
    //   items: ['activities/overview', 'activities/recording-visits', 'activities/phone-calls-and-emails', 'activities/case-notes', 'activities/viewing-activity-history'],
    // },
    {
      type: 'category',
      label: 'User Roles',
      link: {
        type: 'generated-index',
        title: 'User Roles',
        description: 'Learn about different user roles and permissions',
      },
      items: [
        'user-roles/case-worker',
        'user-roles/supervisor',
        'user-roles/program-manager',
        'user-roles/intake-officer',
      ],
    },
    'glossary',
  ],
};

export default sidebars;
