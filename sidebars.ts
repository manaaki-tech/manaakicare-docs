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
    // The task-oriented layer, pinned above the entity-organised reference
    // below it. Someone who has just been handed a login is looking for "how
    // do I write up a visit", not for the Activities section.
    {
      type: 'category',
      label: 'User Manual',
      link: {
        type: 'generated-index',
        title: 'User Manual',
        description:
          'Step-by-step walkthroughs of the everyday jobs, with pictures. Start here if you are new.',
      },
      items: [
        'manual/start-here',
        'manual/signing-in',
        'manual/finding-your-way-around',
        'manual/your-day-at-a-glance',
        'manual/taking-on-someone-new',
        'manual/working-with-someone',
        'manual/writing-up-what-you-did',
        'manual/staying-on-top-of-deadlines',
        'manual/finishing-up',
        'manual/when-something-looks-wrong',
      ],
    },
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
    {
      type: 'category',
      label: 'Referrals',
      link: {
        type: 'generated-index',
        title: 'Referral Management',
        description: 'Learn how to create and manage referrals',
      },
      items: [
        'referrals/overview',
        'referrals/creating-a-referral',
        'referrals/client-information',
        'referrals/referral-details',
        'referrals/uploading-documents',
        'referrals/submitting-for-review',
      ],
    },
    {
      type: 'category',
      label: 'Clients',
      link: {
        type: 'generated-index',
        title: 'Client Management',
        description: 'Learn how to manage clients in Manaaki Central',
      },
      items: [
        'clients/searching-for-clients',
        'clients/viewing-client-details',
        'clients/client-documents',
        'clients/family-relationships',
      ],
    },
    {
      type: 'category',
      label: 'Service Episodes',
      link: {
        type: 'generated-index',
        title: 'Service Episodes',
        description: 'Learn about service episode management',
      },
      items: [
        'service-episodes/what-are-service-episodes',
        'service-episodes/starting-an-episode',
        'service-episodes/managing-episodes',
        'service-episodes/closing-an-episode',
      ],
    },
    {
      type: 'category',
      label: 'Activities',
      link: {
        type: 'generated-index',
        title: 'Activities & Case Notes',
        description: 'Learn how to record and manage activities',
      },
      items: [
        'activities/overview',
        'activities/recording-visits',
        'activities/phone-calls-and-emails',
        'activities/case-notes',
        'activities/viewing-activity-history',
      ],
    },
    {
      type: 'category',
      label: 'Organisations',
      link: {
        type: 'generated-index',
        title: 'External Organisations',
        description: 'Manage partner and referrer organisations and their contacts.',
      },
      items: [
        'external-organisations/overview',
        'external-organisations/managing-contacts',
      ],
    },
    {
      type: 'category',
      label: 'Document Library',
      link: {
        type: 'generated-index',
        title: 'Document Library',
        description: 'Manage shared templates and documents for your organisation.',
      },
      items: [
        'organisation-documents/overview',
      ],
    },
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
