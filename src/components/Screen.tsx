/**
 * A screenshot in the user manual.
 *
 * Wraps the image in a link to itself so a reader can open it full size. Many
 * of these screenshots are dense, the people reading them are often not
 * confident users, and "make it bigger" is the first thing they try.
 *
 * Usage in MDX:
 *   <Screen src="/img/manual/intake/01-choose-service.png"
 *           alt="The service list open on the first step"
 *           caption="Pick the service first — it decides which questions you get asked."
 *           narrow />
 */

import React from 'react';
import styles from './Screen.module.css';

interface ScreenProps {
	/** Path under static/, e.g. "/img/manual/intake/01-choose-service.png" */
	src: string;
	/** Describes the screen for anyone using a screen reader. Required. */
	alt: string;
	/** Optional line under the image saying what to notice. */
	caption?: React.ReactNode;
	/** Constrain the width — for small dialogs and cropped panels. */
	narrow?: boolean;
}

export default function Screen({ src, alt, caption, narrow = false }: ScreenProps) {
	return (
		<figure className={`${styles.screen} ${narrow ? styles.narrow : ''}`}>
			<a className={styles.frame} href={src} target="_blank" rel="noreferrer">
				<img src={src} alt={alt} loading="lazy" />
			</a>
			{caption && <figcaption className={styles.caption}>{caption}</figcaption>}
		</figure>
	);
}
