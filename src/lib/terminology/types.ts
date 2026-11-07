/** Flat key-value terminology map for docs */
export type Terminology = Record<string, string>;

/** Org-specific overrides (same flat structure) */
export type TerminologyOverrides = Record<string, string>;

/** Context value returned by useTerminology hook */
export interface TerminologyContextValue {
	t: Terminology;
	orgId: string | null;
	isLoading: boolean;
	/**
	 * True only once an organisation's overrides have actually been fetched and
	 * applied. `orgId` is set optimistically from the query string, so it is NOT
	 * a safe proxy for this: a request that is blocked by CORS, fails, or comes
	 * back empty leaves `orgId` set while `t` is still default English.
	 *
	 * Anything that would tell the reader something about *their* vocabulary has
	 * to check this, not `orgId`, or it will make claims on default data.
	 */
	resolved: boolean;
}
