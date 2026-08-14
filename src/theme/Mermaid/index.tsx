import React from 'react';
import OriginalMermaid from '@theme-original/Mermaid';
import type { Props } from '@theme/Mermaid';
import { useTerminology } from '@site/src/lib/terminology/TerminologyContext';
import { applyTerminology } from '@site/src/lib/terminology/applyTerminology';

/**
 * Wraps the default Mermaid renderer to apply terminology overrides to
 * diagram source before it reaches mermaid.js.
 *
 * Everything inside a ```mermaid fence is handed to mermaid as raw text —
 * React never renders it — so the <Term> component cannot be used there.
 * Without this wrapper, an organisation with custom terminology reads its own
 * words throughout a page and then hits a flowchart still labelled "Case
 * Worker" and "Service Episode".
 *
 * Replacement is plain text substitution over the whole diagram definition.
 * That includes node ids as well as labels, but ids in these diagrams are
 * lowercase snake_case (`load_staff`) while the terms are capitalised
 * ("Case Worker"), so they do not collide.
 */
export default function MermaidWrapper(props: Props) {
	const { t } = useTerminology();

	return <OriginalMermaid {...props} value={applyTerminology(props.value, t)} />;
}
