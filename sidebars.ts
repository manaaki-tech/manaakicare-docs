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
            'manual/case-worker/dashboard',
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
            'manual/intake-officer/dashboard',
          ],
        },
        {
          // One section, not two: the roles do the same things at different
          // scope, so two sequences meant two near-identical pages drifting
          // apart. The difference is a column in the permissions table.
          type: 'category',
          label: 'Supervisor & Program Manager',
          link: {
            type: 'generated-index',
            title: 'Supervisor & Program Manager',
            description:
              'Overseeing work and moving it between people. Both roles do the same things — a supervisor over their team, a programme manager over the organisation.',
          },
          items: [
            'manual/supervisor/what-you-can-do',
            'manual/supervisor/moving-work-between-staff',
            'manual/supervisor/dashboard',
          ],
        },
      ],
    },
    'how-the-work-flows',
    {
      // The concept page IS the landing page, rather than a generated index
      // above it: an organisation's word for this is the section name, and a
      // reader arriving here wants to know what the thing is before the how-tos.
      type: 'category',
      label: 'Entries',
      link: { type: 'doc', id: 'entries/overview' },
      items: [
        'entries/creating-a-referral',
        'entries/client-information',
        'entries/referral-details',
        'entries/uploading-documents',
        'entries/submitting-for-review',
      ],
    },
    {
      type: 'category',
      label: 'Care Journeys',
      link: { type: 'doc', id: 'care-journeys/overview' },
      items: [
        'care-journeys/starting-an-episode',
        'care-journeys/managing-episodes',
        'care-journeys/closing-an-episode',
      ],
    },
    {
      type: 'category',
      label: 'Whānau',
      link: { type: 'doc', id: 'whanau/overview' },
      items: [
        'whanau/searching-for-clients',
        'whanau/viewing-client-details',
        'whanau/client-documents',
        'whanau/family-relationships',
      ],
    },
    {
      type: 'category',
      label: 'Activities',
      link: { type: 'doc', id: 'activities/overview' },
      items: [
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
      items: ['external-organisations/overview', 'external-organisations/managing-contacts'],
    },
    {
      type: 'category',
      label: 'Document Library',
      link: {
        type: 'generated-index',
        title: 'Document Library',
        description: 'Manage shared templates and documents for your organisation.',
      },
      items: ['organisation-documents/overview'],
    },
    'finding-your-way-around-the-system',
    'glossary',
  ],
};

export default sidebars;
