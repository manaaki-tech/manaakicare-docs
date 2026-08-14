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
    //
    // Grouped by job rather than by the lifecycle, because the lifecycle order
    // mixes roles: taking on someone new is intake work, and a case worker
    // reading start to finish used to hit a long page describing a button they
    // cannot see. Each role now reads one sequence that is entirely theirs, and
    // anything genuinely universal sits once under Everyone.
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
        {
          type: 'category',
          label: 'Everyone',
          link: {
            type: 'generated-index',
            title: 'Everyone',
            description:
              'The parts that are the same whatever your job — signing in, finding your way around, and what to do when something looks wrong.',
          },
          items: [
            'manual/everyone/signing-in',
            'manual/everyone/finding-your-way-around',
            'manual/everyone/when-something-looks-wrong',
          ],
        },
        {
          type: 'category',
          label: 'Case Worker',
          link: {
            type: 'generated-index',
            title: 'Case Worker',
            description:
              'Your day, from opening your dashboard to closing a piece of work.',
          },
          items: [
            'manual/case-worker/what-you-can-do',
            'manual/case-worker/your-day-at-a-glance',
            'manual/case-worker/working-with-someone',
            'manual/case-worker/writing-up-what-you-did',
            'manual/case-worker/staying-on-top-of-deadlines',
            'manual/case-worker/finishing-up',
          ],
        },
        {
          type: 'category',
          label: 'Intake Officer',
          link: {
            type: 'generated-index',
            title: 'Intake Officer',
            description: 'Taking an enquiry from arrival through to somebody being assigned.',
          },
          items: [
            'manual/intake-officer/what-you-can-do',
            'manual/intake-officer/your-day-at-a-glance',
            'manual/intake-officer/taking-on-someone-new',
          ],
        },
        {
          type: 'category',
          label: 'Supervisor',
          link: {
            type: 'generated-index',
            title: 'Supervisor',
            description: 'Overseeing a team, and moving work between the people in it.',
          },
          items: [
            'manual/supervisor/what-you-can-do',
            'manual/supervisor/moving-work-between-staff',
          ],
        },
        {
          type: 'category',
          label: 'Program Manager',
          link: {
            type: 'generated-index',
            title: 'Program Manager',
            description: 'Oversight across the whole organisation.',
          },
          items: ['manual/program-manager/what-you-can-do'],
        },
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
    'glossary',
  ],
};

export default sidebars;
