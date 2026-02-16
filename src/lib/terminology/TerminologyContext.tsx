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

		const baseUrl = apiUrlsRef.current[env];
		if (!baseUrl) return;

		fetchedRef.current = true;
		setOrgId(org);
		setIsLoading(true);

		fetch(`${baseUrl}/api/v1/organisations/terminologies/${org}/docs/`)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then((data: TerminologyOverrides) => {
				if (data && typeof data === 'object' && Object.keys(data).length > 0) {
					setTerminology({ ...defaultTerminology, ...data });
				}
			})
			.catch(() => {
				// Silently fall back to defaults
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
