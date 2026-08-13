import React from 'react';
import OriginalLink from '@theme-original/DocSidebarItem/Link';
import type { Props } from '@theme/DocSidebarItem/Link';
import { useTerminology } from '@site/src/lib/terminology/TerminologyContext';
import { applyTerminology } from '@site/src/lib/terminology/applyTerminology';

/**
 * Wraps the default DocSidebarItem/Link to apply terminology overrides
 * to sidebar labels at render time. Replaces default terms (e.g. "Case Worker")
 * with their org-specific overrides (e.g. "Kaiawhina").
 *
 * See also DocSidebarItem/Category, which does the same for category labels.
 */
export default function DocSidebarItemLinkWrapper(props: Props) {
	const { t } = useTerminology();

	const modifiedProps = {
		...props,
		item: {
			...props.item,
			label: applyTerminology(props.item.label, t),
		},
	};

	return <OriginalLink {...modifiedProps} />;
}
