import React from 'react';
import OriginalCategory from '@theme-original/DocSidebarItem/Category';
import type { Props } from '@theme/DocSidebarItem/Category';
import { useTerminology } from '@site/src/lib/terminology/TerminologyContext';
import { applyTerminology } from '@site/src/lib/terminology/applyTerminology';

/**
 * Wraps the default DocSidebarItem/Category to apply terminology overrides to
 * sidebar *category* labels (e.g. the "Referrals" section heading).
 *
 * Category labels are defined as plain strings in sidebars.ts, so the <Term>
 * component cannot be used for them. Without this wrapper an organisation with
 * custom terminology sees its own word on every page link but the default
 * English on the category heading above them.
 */
export default function DocSidebarItemCategoryWrapper(props: Props) {
	const { t } = useTerminology();

	const modifiedProps = {
		...props,
		item: {
			...props.item,
			label: applyTerminology(props.item.label, t),
		},
	};

	return <OriginalCategory {...modifiedProps} />;
}
