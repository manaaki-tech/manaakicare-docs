import React from 'react';
import OriginalDocCard from '@theme-original/DocCard';
import type { Props } from '@theme/DocCard';
import { useDocById } from '@docusaurus/plugin-content-docs/client';
import { useTerminology } from '@site/src/lib/terminology/TerminologyContext';
import { applyTerminology } from '@site/src/lib/terminology/applyTerminology';

/**
 * Wraps the cards listed on a category's generated index page.
 *
 * A card's title is the target page's frontmatter `title` and its body is that
 * page's `description` — both plain strings written before we know who is
 * reading, so <Term> cannot reach either. Untouched, a category page lists
 * "Creating a Referral" to an organisation whose every other surface says
 * "Entry".
 *
 * The description needs resolving here rather than simply passed through: the
 * original component falls back to the target doc's own description when the
 * sidebar item carries none, and that fallback happens inside the component,
 * past the point where props can be rewritten. So we look the doc up and hand
 * the resolved string down as an explicit description.
 */
export default function DocCardWrapper(props: Props) {
	const { t } = useTerminology();
	const { item } = props;

	// Only link items have a docId; useDocById tolerates undefined for the rest.
	const doc = useDocById(item.type === 'link' ? item.docId ?? undefined : undefined);

	const resolvedDescription =
		item.description ?? (item.type === 'link' ? doc?.description : undefined);

	const modifiedItem = {
		...item,
		label: applyTerminology(item.label, t),
		// Left undefined for a category with no description of its own, so the
		// original's "N items" fallback still applies.
		...(resolvedDescription
			? { description: applyTerminology(resolvedDescription, t) }
			: {}),
	};

	return <OriginalDocCard {...props} item={modifiedItem} />;
}
