/**
 * Explains the gap between the words in the screenshots and the words on the
 * reader's own screen.
 *
 * Prose in these docs is swapped at runtime by <Term>. Screenshots cannot be —
 * they are pixels, captured on one organisation's configuration. So a reader
 * whose system says "Service Episode" sees pictures that say "Care Journey",
 * and with no explanation that reads as the manual being for a different
 * product.
 *
 * Rather than a vague apology, this builds the actual mapping: for each term
 * the screenshots show, it prints the word THIS reader's organisation uses,
 * pulled from the same terminology the rest of the page uses. Rows where the
 * two already agree are dropped, so an organisation whose configuration
 * matches the screenshots sees nothing at all.
 */

import React from 'react';
import { useTerminology } from '@site/src/lib/terminology/TerminologyContext';
import defaultTerminology from '@site/src/lib/terminology/default.json';
import Callout from './Callout';

/**
 * The vocabulary visible in the supplied screenshots. Captured on the Ngāti
 * Porou Oranga configuration in August 2026. If the screenshots are ever
 * retaken on a different configuration, update this map to match — it is the
 * one place that records what the pictures actually say.
 */
const PICTURE_WORDS: Record<string, string> = {
	serviceEpisode: 'Care Journey',
	referral: 'Entry',
	caseWorker: 'Kaiāwhina',
	serviceUser: 'Whānau',
};

function singular(raw: string | undefined): string | undefined {
	return raw?.split('|')[0];
}

export default function PictureWords() {
	const { t } = useTerminology();

	const rows = Object.entries(PICTURE_WORDS)
		.map(([key, pictureWord]) => ({
			pictureWord,
			yourWord: singular(t[key]) ?? singular(defaultTerminology[key]) ?? key,
		}))
		.filter((row) => row.yourWord.toLowerCase() !== row.pictureWord.toLowerCase());

	if (rows.length === 0) {
		return null;
	}

	return (
		<Callout color="stone" title="The words in the pictures">
			<p>
				The pictures in this manual were taken on one organisation's system. Yours uses
				some different words. The buttons, and where they sit on the screen, are the same.
			</p>
			<table>
				<thead>
					<tr>
						<th>Where a picture says</th>
						<th>Your screen says</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.pictureWord}>
							<td>{row.pictureWord}</td>
							<td>
								<strong>{row.yourWord}</strong>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Callout>
	);
}
