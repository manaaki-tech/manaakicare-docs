/**
 * A screenshot in the user manual.
 *
 * Two things matter for the people reading these: the image must be sharp, and
 * "make it bigger" must not cost them their place.
 *
 * Sharpness is handled in the stylesheet — images are never upscaled past their
 * captured size, so the text in a screenshot is the size it is in the real
 * application.
 *
 * Enlarging opens the image over the page rather than in a new browser tab. A
 * new tab strands a reader who is mid-task: on a phone, getting back means
 * finding the tab switcher. Here, Escape or the close button returns them to
 * exactly where they were.
 *
 * The affordance only appears when the image is actually being shown smaller
 * than it was captured, so clicking always does something. That is measured
 * from the rendered element rather than decided in advance, because it depends
 * on the viewport: on a narrow phone almost every screenshot is squeezed, on a
 * wide desktop only the large ones are.
 *
 * Usage in MDX:
 *   <Screen src="/img/manual/intake/01-choose-service.png"
 *           alt="The service list open on the first step"
 *           caption="Pick the service first — it decides which questions you get asked."
 *           narrow />
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

/**
 * Enlarging is only worth offering above this ratio. A screenshot displayed at
 * 95% of its captured width gains nothing from a click, and an affordance that
 * does nothing teaches a hesitant reader to distrust the ones that do.
 */
const WORTH_ENLARGING = 1.2;

export default function Screen({ src, alt, caption, narrow = false }: ScreenProps) {
	const imgRef = useRef<HTMLImageElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);

	const [zoomable, setZoomable] = useState(false);
	const [open, setOpen] = useState(false);
	// createPortal needs a document, which does not exist while Docusaurus is
	// statically rendering these pages.
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const measure = useCallback(() => {
		const img = imgRef.current;
		if (!img || !img.naturalWidth || !img.clientWidth) {
			return;
		}
		setZoomable(img.naturalWidth >= img.clientWidth * WORTH_ENLARGING);
	}, []);

	useEffect(() => {
		measure();
		window.addEventListener('resize', measure);
		return () => window.removeEventListener('resize', measure);
	}, [measure]);

	const close = useCallback(() => {
		setOpen(false);
		triggerRef.current?.focus();
	}, []);

	useEffect(() => {
		if (!open) {
			return;
		}

		closeRef.current?.focus();

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				close();
			}
			// The overlay holds exactly one focusable control, so keeping focus
			// on it is the whole trap.
			if (event.key === 'Tab') {
				event.preventDefault();
				closeRef.current?.focus();
			}
		};

		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [open, close]);

	const image = (
		<img ref={imgRef} src={src} alt={alt} loading="lazy" onLoad={measure} />
	);

	return (
		<figure className={`${styles.screen} ${narrow ? styles.narrow : ''}`}>
			{zoomable ? (
				<button
					ref={triggerRef}
					type="button"
					className={`${styles.frame} ${styles.zoomable}`}
					onClick={() => setOpen(true)}
					aria-label={`Enlarge screenshot: ${alt}`}
				>
					{image}
				</button>
			) : (
				<div className={styles.frame}>{image}</div>
			)}

			{caption && <figcaption className={styles.caption}>{caption}</figcaption>}

			{zoomable && (
				<p className={styles.hint} aria-hidden="true">
					<span>⤢</span> Click the picture to make it bigger
				</p>
			)}

			{mounted &&
				open &&
				createPortal(
					<div
						className={styles.backdrop}
						role="dialog"
						aria-modal="true"
						aria-label={alt}
						onClick={close}
					>
						{/* Clicks inside the image itself must not dismiss it — only
						    the backdrop around it. */}
						<div className={styles.dialog} onClick={(event) => event.stopPropagation()}>
							<button
								ref={closeRef}
								type="button"
								className={styles.close}
								onClick={close}
								aria-label="Close the enlarged picture"
							>
								✕
							</button>
							<img src={src} alt={alt} />
							{caption && <p className={styles.dialogCaption}>{caption}</p>}
						</div>
					</div>,
					document.body,
				)}
		</figure>
	);
}
