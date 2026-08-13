import defaultTerminology from './default.json';

/**
 * Applies an organisation's terminology overrides to a plain string.
 *
 * Used for sidebar labels, which come from `sidebars.ts` / MDX frontmatter and
 * are therefore plain strings — the `<Term>` component cannot be used there.
 *
 * Replaces the plural form before the singular, since the plural is the longer
 * match and replacing the singular first would corrupt it ("Referrals" ->
 * "<override>s").
 */
export function applyTerminology(label: string, t: Record<string, string>): string {
	let result = label;

	// Keys stored as "Singular|Plural"
	const pipeKeys = ['caseWorker', 'referral', 'serviceUser', 'serviceEpisode', 'activity'] as const;

	for (const key of pipeKeys) {
		const defaultRaw = (defaultTerminology as Record<string, string>)[key];
		const overrideRaw = t[key];
		if (!defaultRaw || !overrideRaw || defaultRaw === overrideRaw) continue;

		const defaultParts = defaultRaw.split('|');
		const overrideParts = overrideRaw.split('|');

		// Plural first (longer match) to avoid partial replacements
		if (defaultParts[1] && overrideParts[1] && result.includes(defaultParts[1])) {
			result = result.replace(defaultParts[1], overrideParts[1]);
		}
		if (defaultParts[0] && overrideParts[0] && result.includes(defaultParts[0])) {
			result = result.replace(defaultParts[0], overrideParts[0]);
		}
	}

	// Keys stored as a single value
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
