import defaultTerminology from './default.json';

/** Escapes regex metacharacters so a term can be used in a RegExp. */
function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every occurrence of `find` in `input`, literally (not just the first). */
function replaceAll(input: string, find: string, replacement: string): string {
	return input.replace(new RegExp(escapeRegExp(find), 'g'), replacement);
}

/**
 * Applies an organisation's terminology overrides to a plain string.
 *
 * Used wherever the `<Term>` component cannot reach: sidebar labels (plain
 * strings in `sidebars.ts` / MDX frontmatter) and mermaid diagram source
 * (handed to mermaid.js as raw text, so JSX never renders inside it).
 *
 * Replaces the plural form before the singular, since the plural is the longer
 * match and replacing the singular first would corrupt it ("Referrals" ->
 * "<override>s").
 *
 * Replacement is global — a single mermaid diagram can mention the same term
 * many times, and replacing only the first occurrence would leave the diagram
 * half-translated.
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
			result = replaceAll(result, defaultParts[1], overrideParts[1]);
		}
		if (defaultParts[0] && overrideParts[0] && result.includes(defaultParts[0])) {
			result = replaceAll(result, defaultParts[0], overrideParts[0]);
		}
	}

	// Keys stored as a single value
	const simpleKeys = ['caseload', 'cases', 'dashboard', 'supervisorDashboard'] as const;

	for (const key of simpleKeys) {
		const defaultVal = (defaultTerminology as Record<string, string>)[key];
		const overrideVal = t[key];
		if (!defaultVal || !overrideVal || defaultVal === overrideVal) continue;

		if (result.includes(defaultVal)) {
			result = replaceAll(result, defaultVal, overrideVal);
		}
	}

	return result;
}
