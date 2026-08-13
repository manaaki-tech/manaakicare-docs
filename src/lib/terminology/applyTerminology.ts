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
 * Replaces whole-word occurrences of an alias form, preserving the casing of
 * what was matched and correcting the indefinite article if one precedes it.
 *
 * Matching is case-insensitive because diagram labels and prose use lowercase
 * ("Case Worker activated episode") while headings use title case. The
 * replacement follows the matched casing, so lowercase stays lowercase rather
 * than dropping a capitalised term into the middle of a sentence.
 *
 * The article is rewritten because substitution changes the initial sound:
 * "an Episode" must become "a Care Journey", not "an Care Journey".
 */
function replaceAlias(input: string, find: string, replacement: string): string {
	const pattern = new RegExp(`\\b(an?\\s+)?(${escapeRegExp(find)})\\b`, 'gi');

	return input.replace(pattern, (_match, article: string | undefined, term: string) => {
		const isLower = term[0] === term[0].toLowerCase();
		const value = isLower ? replacement.toLowerCase() : replacement;
		if (!article) return value;

		const startsWithVowel = /^[aeiou]/i.test(value);
		const articleWord = startsWithVowel ? 'an' : 'a';
		const cased = article[0] === article[0].toUpperCase()
			? articleWord.charAt(0).toUpperCase() + articleWord.slice(1)
			: articleWord;
		return `${cased} ${value}`;
	});
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

	// Alternative phrasings that mean the same entity but do not match the
	// default term literally. "Service Episode" is also written as "Episode"
	// and "Episode of Care" in headings, page titles and diagram labels, and
	// an organisation that renames it to "Care Journey" expects all three to
	// change — otherwise a page reads "Care Journeys" while the heading above
	// it still says "Episodes".
	//
	// Ordered longest-first so a shorter alias cannot corrupt a longer one
	// ("Episodes of Care" must be consumed before "Episodes").
	const aliases: Record<string, { plural: string[]; singular: string[] }> = {
		serviceEpisode: {
			plural: ['Service Episodes', 'Episodes of Care', 'Episodes'],
			singular: ['Service Episode', 'Episode of Care', 'Episode'],
		},
	};

	for (const [key, forms] of Object.entries(aliases)) {
		const defaultRaw = (defaultTerminology as Record<string, string>)[key];
		const overrideRaw = t[key];
		if (!defaultRaw || !overrideRaw || defaultRaw === overrideRaw) continue;

		const overrideParts = overrideRaw.split('|');
		const overridePlural = overrideParts[1] ?? overrideParts[0];
		const overrideSingular = overrideParts[0];

		for (const form of forms.plural) {
			result = replaceAlias(result, form, overridePlural);
		}
		for (const form of forms.singular) {
			result = replaceAlias(result, form, overrideSingular);
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
