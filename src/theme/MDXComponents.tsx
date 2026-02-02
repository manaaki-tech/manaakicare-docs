/**
 * Custom MDX components for Docusaurus
 * This file registers custom components that can be used in MDX files
 */

import React from 'react';
// Import the default MDX components from Docusaurus
import MDXComponents from '@theme-original/MDXComponents';
// Import our custom components
import Callout from '@site/src/components/Callout';

export default {
  // Spread the default components
  ...MDXComponents,
  // Add our custom components
  Callout,
};
