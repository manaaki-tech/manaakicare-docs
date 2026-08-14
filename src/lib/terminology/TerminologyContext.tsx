import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useIsBrowser from '@docusaurus/useIsBrowser';
import defaultTerminology from './default.json';
import type { Terminology, TerminologyContextValue, TerminologyOverrides } from './types';

const TerminologyContext = createContext<TerminologyContextValue>({
	t: defaultTerminology as Terminology,
	orgId: null,
	isLoading: false,
});

const SESSION_KEY_ENV = 'mc_docs_env';
const SESSION_KEY_ORG = 'mc_docs_org_id';

/** Env keys that mean "the machine serving these docs", not a fixed hostname. */
const LOCAL_ENVS = ['local', 'development'];

/**
 * Resolves the API base URL for an env key.
 *
 * Local envs are resolved against whatever host the docs are being served
 * from, rather than the literal hostname in the config. Serving the docs over
 * the LAN (http://192.168.100.10:3000) and pointing at `http://localhost:8000`
 * would send the request to the *viewer's* machine, not the server running
 * the backend. The port still comes from the config entry, so it stays
 * configurable in one place.
 *
 * Browsing at http://localhost:3000 is unaffected — the hostname resolves
 * back to `localhost`.
 *
 * `development` is in that list because it is what the application actually
 * sends outside a deployed environment; `local` is kept because it is what
 * anyone testing this by hand has been typing.
 */
function resolveBaseUrl(env: string, apiUrls: Record<string, string>): string | undefined {
	const configured = apiUrls[env];
	if (!configured) return undefined;
	if (!LOCAL_ENVS.includes(env)) return configured;

	try {
		const url = new URL(configured);
		url.hostname = window.location.hostname;
		url.protocol = window.location.protocol;
		return url.origin;
	} catch {
		return configured;
	}
}

export function TerminologyProvider({ children }: { children: React.ReactNode }) {
	const isBrowser = useIsBrowser();
	const location = useLocation();
	const { siteConfig } = useDocusaurusContext();
	const apiUrls = (siteConfig.customFields?.terminologyApiUrls ?? {}) as Record<string, string>;
	const apiUrlsRef = useRef(apiUrls);
	apiUrlsRef.current = apiUrls;

	const [terminology, setTerminology] = useState<Terminology>(defaultTerminology as Terminology);
	const [orgId, setOrgId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const fetchedRef = useRef(false);

	// Fetch terminology once on initial load
	useEffect(() => {
		if (!isBrowser || fetchedRef.current) return;

		const params = new URLSearchParams(window.location.search);
		let env = params.get('env');
		let org = params.get('org_id');

		if (env && org) {
			sessionStorage.setItem(SESSION_KEY_ENV, env);
			sessionStorage.setItem(SESSION_KEY_ORG, org);
		} else {
			env = sessionStorage.getItem(SESSION_KEY_ENV);
			org = sessionStorage.getItem(SESSION_KEY_ORG);
		}

		if (!env || !org) return;

		const baseUrl = resolveBaseUrl(env, apiUrlsRef.current);
		if (!baseUrl) {
			console.warn(
				`[terminology] Unknown env "${env}". Expected one of: ${Object.keys(apiUrlsRef.current).join(', ')}. ` +
					`Falling back to default terminology.`,
			);
			return;
		}

		fetchedRef.current = true;
		setOrgId(org);
		setIsLoading(true);

		const url = `${baseUrl}/api/v1/organisations/terminologies/${org}/docs/`;

		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then((data: TerminologyOverrides) => {
				if (data && typeof data === 'object' && Object.keys(data).length > 0) {
					setTerminology({ ...defaultTerminology, ...data });
				} else {
					// An org with no docs-type terminology row returns {}. That is
					// indistinguishable from a working fetch unless we say so.
					console.warn(
						`[terminology] ${url} returned no overrides — org "${org}" has no active ` +
							`docs terminology configured. Showing default terminology.`,
					);
				}
			})
			.catch((err) => {
				console.warn(
					`[terminology] Could not load terminology from ${url} (${err.message}). ` +
						`Showing default terminology.`,
				);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [isBrowser]);

	// Re-append query params to URL after every client-side navigation
	useEffect(() => {
		if (!isBrowser) return;

		const env = sessionStorage.getItem(SESSION_KEY_ENV);
		const org = sessionStorage.getItem(SESSION_KEY_ORG);
		if (!env || !org) return;

		const currentParams = new URLSearchParams(window.location.search);
		if (currentParams.get('env') && currentParams.get('org_id')) return;

		const newParams = new URLSearchParams(window.location.search);
		newParams.set('env', env);
		newParams.set('org_id', org);
		window.history.replaceState(
			null,
			'',
			`${window.location.pathname}?${newParams.toString()}${window.location.hash}`,
		);
	}, [isBrowser, location]);

	return (
		<TerminologyContext.Provider value={{ t: terminology, orgId, isLoading }}>
			{children}
		</TerminologyContext.Provider>
	);
}

export function useTerminology(): TerminologyContextValue {
	return useContext(TerminologyContext);
}
