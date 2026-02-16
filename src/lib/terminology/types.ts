/** Flat key-value terminology map for docs */
export type Terminology = Record<string, string>;

/** Org-specific overrides (same flat structure) */
export type TerminologyOverrides = Record<string, string>;

/** Context value returned by useTerminology hook */
export interface TerminologyContextValue {
	t: Terminology;
	orgId: string | null;
	isLoading: boolean;
}
