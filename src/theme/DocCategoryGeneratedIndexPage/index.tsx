import React from 'react';
import OriginalDocCategoryGeneratedIndexPage from '@theme-original/DocCategoryGeneratedIndexPage';
import type { Props } from '@theme/DocCategoryGeneratedIndexPage';
import { useTerminology } from '@site/src/lib/terminology/TerminologyContext';
import { applyTerminology } from '@site/src/lib/terminology/applyTerminology';

/**
 * Wraps the generated "switchboard" page a category link opens.
 *
 * Its heading and description come from `generated-index` in sidebars.ts, which
 * are plain strings, so <Term> cannot reach them. Without this an organisation
 * that calls a referral an "Entry" sees "Entries" in the sidebar and then
 * "Referral Management" as the heading of the page that sidebar item opens —
 * the one place the two disagree in the same glance.
 *
 * The cards on this page are handled separately, in DocCard.
 */
export default function DocCategoryGeneratedIndexPageWrapper(props: Props) {
	const { t } = useTerminology();
	const { categoryGeneratedIndex } = props;

	const modifiedProps = {
		...props,
		categoryGeneratedIndex: {
			...categoryGeneratedIndex,
			title: applyTerminology(categoryGeneratedIndex.title, t),
			description: categoryGeneratedIndex.description
				? applyTerminology(categoryGeneratedIndex.description, t)
				: categoryGeneratedIndex.description,
		},
	};

	return <OriginalDocCategoryGeneratedIndexPage {...modifiedProps} />;
}
