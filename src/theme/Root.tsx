import React from 'react';
import { TerminologyProvider } from '@site/src/lib/terminology/TerminologyContext';

export default function Root({ children }: { children: React.ReactNode }) {
	return <TerminologyProvider>{children}</TerminologyProvider>;
}
