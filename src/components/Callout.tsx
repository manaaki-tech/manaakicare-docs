/**
 * Flexible callout component with earthy palette color variants
 *
 * Usage in MDX:
 * <Callout color="teal">Information content here</Callout>
 * <Callout color="amber">Warning content here</Callout>
 * <Callout color="terracotta">Critical content here</Callout>
 * <Callout color="sage">Success content here</Callout>
 * <Callout color="olive">Medium priority content</Callout>
 * <Callout color="brown">Pending/referral content</Callout>
 */

import React, { ReactNode } from 'react';
import styles from './Callout.module.css';

type CalloutColor = 'teal' | 'sage' | 'amber' | 'terracotta' | 'olive' | 'brown' | 'stone';

interface CalloutProps {
  children: ReactNode;
  color?: CalloutColor;
  title?: string;
}

export default function Callout({ children, color = 'teal', title }: CalloutProps) {
  return (
    <div className={`${styles.callout} ${styles[`callout--${color}`]}`}>
      {title && <div className={styles.calloutTitle}>{title}</div>}
      <div className={styles.calloutContent}>{children}</div>
    </div>
  );
}
