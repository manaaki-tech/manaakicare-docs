import React from 'react';
import OriginalLink from '@theme-original/DocSidebarItem/Link';
import type { Props } from '@theme/DocSidebarItem/Link';
import { useTerminology } from '@site/src/lib/terminology/TerminologyContext';
import defaultTerminology from '@site/src/lib/terminology/default.json';

/**
 * Wraps the default DocSidebarItem/Link to apply terminology overrides
 * to sidebar labels at render time. Replaces default terms (e.g. "Case Worker")
 * with their org-specific overrides (e.g. "Kaiawhina").
 */
function applyTerminology(label: string, t: Record<string, string>): string {
	let result = label;

	// Keys with singular|plural format
	const pipeKeys = ['caseWorker', 'referral', 'serviceUser', 'serviceEpisode', 'activity'] as const;

	for (const key of pipeKeys) {
		const defaultRaw = (defaultTerminology as Record<string, string>)[key];
		const overrideRaw = t[key];
		if (!defaultRaw || !overrideRaw || defaultRaw === overrideRaw) continue;

		const defaultParts = defaultRaw.split('|');
		const overrideParts = overrideRaw.split('|');

		// Replace plural first (longer match) to avoid partial replacements
		if (defaultParts[1] && overrideParts[1] && result.includes(defaultParts[1])) {
			result = result.replace(defaultParts[1], overrideParts[1]);
		}
		if (defaultParts[0] && overrideParts[0] && result.includes(defaultParts[0])) {
			result = result.replace(defaultParts[0], overrideParts[0]);
		}
	}

	// Simple value keys (no pipe separator)
	const simpleKeys = ['caseload', 'cases', 'dashboard', 'supervisorDashboard'] as const;

	for (const key of simpleKeys) {
		const defaultVal = (defaultTerminology as Record<string, string>)[key];
		const overrideVal = t[key];
		if (!defaultVal || !overrideVal || defaultVal === overrideVal) continue;

		if (result.includes(defaultVal)) {
			result = result.replace(defaultVal, overrideVal);
		}
	}

	return result;
}

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
