import React from 'react';
import { useTerminology } from '@site/src/lib/terminology/TerminologyContext';
import defaultTerminology from '@site/src/lib/terminology/default.json';

interface TermProps {
	/** Key into the terminology map, e.g. "referral", "serviceUser" */
	path: string;
	/** If true, use the plural form (after the | separator) */
	plural?: boolean;
}

export default function Term({ path, plural = false }: TermProps) {
	const { t } = useTerminology();
	const raw = t[path] ?? defaultTerminology[path] ?? path;
	const parts = raw.split('|');
	const value = plural && parts.length > 1 ? parts[1] : parts[0];
	return <span>{value}</span>;
}
