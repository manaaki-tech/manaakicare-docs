/**
 * A YouTube video in the user manual.
 *
 * Served from youtube-nocookie.com, so YouTube sets no cookies until the
 * reader presses play. The frame keeps a 16:9 shape at any width, so it fits a
 * phone as well as a desktop.
 *
 * Usage in MDX:
 *   <Video id="I_pK1CGvCMI" title="What a safety alert is" />
 */

import React from 'react';
import styles from './Video.module.css';

interface VideoProps {
	/** The YouTube video id — the part after "watch?v=" in its link. */
	id: string;
	/** Names the video for anyone using a screen reader. Required. */
	title: string;
}

export default function Video({ id, title }: VideoProps) {
	return (
		<div className={styles.video}>
			<iframe
				src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
				title={title}
				loading="lazy"
				allow="encrypted-media; picture-in-picture; fullscreen"
				allowFullScreen
			/>
		</div>
	);
}
