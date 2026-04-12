<script lang="ts">
	import { onMount } from 'svelte';
	import { translations, useLocaleContext } from '$lib/i18n';

	let container: any = $state(null);
	let laptopFrame: any = $state(null);
	let overlayCanvas: any = $state(null);
	let scrollY = $state(0);
	let innerHeight = $state(0);
	const laptopImageSrc = 'https://static.ulisesv.com/imgs/macbook.png';
	const locale = useLocaleContext();
	const copy = $derived(translations[$locale].scroll);
	const features = $derived(copy.features);

	const overlayImages = new Map();
	const containerTop = $derived(container ? container.offsetTop : 0);
	const scrollDistance = $derived(container ? container.offsetHeight - innerHeight : 1);
	const progress = $derived(
		container ? Math.max(0, Math.min(1, (scrollY - containerTop) / scrollDistance)) : 0
	);
	const activeIndex = $derived(Math.min(features.length - 1, Math.floor(progress * features.length)));

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {number} radius
	 */
	function drawRoundedRect(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		radius: number
	) {
		const safeRadius = Math.min(radius, width / 2, height / 2);
		ctx.beginPath();
		ctx.moveTo(x + safeRadius, y);
		ctx.lineTo(x + width - safeRadius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
		ctx.lineTo(x + width, y + height - safeRadius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
		ctx.lineTo(x + safeRadius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
		ctx.lineTo(x, y + safeRadius);
		ctx.quadraticCurveTo(x, y, x + safeRadius, y);
		ctx.closePath();
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {HTMLImageElement} image
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {number} [radius=0]
	 */
	function drawImageContain(
		ctx: CanvasRenderingContext2D,
		image: HTMLImageElement,
		x: number,
		y: number,
		width: number,
		height: number,
		radius = 0
	) {
		if (!image) return;
		const imageRatio = image.width / image.height;
		const targetRatio = width / height;
		let drawWidth = width;
		let drawHeight = height;

		if (imageRatio > targetRatio) {
			drawWidth = width;
			drawHeight = width / imageRatio;
		} else {
			drawHeight = height;
			drawWidth = height * imageRatio;
		}

		const drawX = x + (width - drawWidth) / 2;
		const drawY = y + (height - drawHeight) / 2;

		ctx.save();
		if (radius > 0) {
			drawRoundedRect(ctx, x, y, width, height, radius);
			ctx.clip();
		}
		ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
		ctx.restore();
	}

	/** @param {string} src */
	async function ensureOverlayImage(src: string) {
		if (overlayImages.has(src)) return overlayImages.get(src);

		const image = new Image();
		const imageLoaded = new Promise((resolve, reject) => {
			image.onload = () => resolve(image);
			image.onerror = reject;
		});
		image.src = src;
		overlayImages.set(src, imageLoaded);
		return imageLoaded;
	}

	function drawOverlayCards() {
		if (!overlayCanvas || !laptopFrame) return;

		const dpr = Math.max(1, window.devicePixelRatio || 1);
		const bounds = laptopFrame.getBoundingClientRect();
		const width = Math.max(1, Math.floor(bounds.width));
		const height = Math.max(1, Math.floor(bounds.height));
		const canvasWidth = Math.floor(width * dpr);
		const canvasHeight = Math.floor(height * dpr);

		if (overlayCanvas.width !== canvasWidth || overlayCanvas.height !== canvasHeight) {
			overlayCanvas.width = canvasWidth;
			overlayCanvas.height = canvasHeight;
		}

		overlayCanvas.style.width = `${width}px`;
		overlayCanvas.style.height = `${height}px`;

		const ctx = overlayCanvas.getContext('2d');
		if (!ctx) return;

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, width, height);

		const screenX = width * 0.09;
		const screenY = height * 0.1;
		const screenWidth = width * 0.8;
		const screenHeight = height * 0.8;

		const activeFeature = features[activeIndex] ?? features[0];

		ensureOverlayImage(activeFeature.image)
			.then((mainImage) => {
				ctx.save();
				drawRoundedRect(ctx, screenX, screenY, screenWidth, screenHeight, 12);
				ctx.clip();
				drawImageContain(ctx, mainImage, screenX, screenY, screenWidth, screenHeight, 0);
				ctx.restore();
			})
			.catch(() => {
				console.warn(`Failed to load image: ${activeFeature.image}`);
			});
	}

	$effect(() => {
		activeIndex;
		drawOverlayCards();
	});

	onMount(() => {
		const observer = new ResizeObserver(() => drawOverlayCards());
		if (laptopFrame) observer.observe(laptopFrame);

		window.addEventListener('resize', drawOverlayCards);
		drawOverlayCards();

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', drawOverlayCards);
		};
	});
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div class="scroll-container" bind:this={container}>
	<div class="sticky-master-wrapper">
		<div
			class="feature-grid-container relative mt-[15vh] w-full max-w-6xl px-6 md:px-12"
			style:pointer-events="auto"
		>
			<div class="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
				<div class="image-stack relative w-full overflow-visible" bind:this={laptopFrame}>
					<img
						src={laptopImageSrc}
						alt="MacBook"
						class="laptop-base"
						loading="eager"
						decoding="async"
					/>
					<canvas bind:this={overlayCanvas} class="laptop-overlay" aria-hidden="true"></canvas>
				</div>

				<div class="text-stack relative flex min-h-50 flex-col justify-center">
					{#each features as feature, i}
						<div
							class="absolute inset-0 flex flex-col justify-center transition-all duration-500 ease-in-out"
							style:opacity={activeIndex === i ? 1 : 0}
							style:transform="translateY({activeIndex === i ? '0' : '20px'})"
							style:pointer-events={activeIndex === i ? 'auto' : 'none'}
						>
							<h2 class="mb-4 text-3xl font-bold md:text-5xl">{feature.title}</h2>
							<p class="text-lg md:text-xl">{feature.text}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.absolute {
		position: absolute;
	}
	.relative {
		position: relative;
	}
	.inset-0 {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	.w-full {
		width: 100%;
	}
	.flex {
		display: flex;
	}
	.flex-col {
		flex-direction: column;
	}
	.items-center {
		align-items: center;
	}
	.justify-center {
		justify-content: center;
	}

	.grid {
		display: grid;
	}
	.grid-cols-1 {
		grid-template-columns: repeat(1, minmax(0, 1fr));
	}
	.gap-8 {
		gap: 2rem;
	}
	.scroll-container {
		position: relative;
		left: 50%;
		width: 100vw;
		margin-left: -50vw;
		height: 600vh;
		margin-top: clamp(1.5rem, 5vh, 3.5rem);
		z-index: 0;
	}

	@supports (width: 100dvw) {
		.scroll-container {
			width: 100dvw;
			margin-left: -50dvw;
		}
	}

	.sticky-master-wrapper {
		position: sticky;
		top: 0;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		z-index: 10;
	}
	.feature-grid-container {
		transition: opacity 0.2s ease-out;
	}

	.text-stack h2,
	.text-stack p {
		margin: 0;
	}

	.image-stack {
		display: grid;
		place-items: center;
	}

	.laptop-base {
		display: block;
		width: 100%;
		height: auto;
		max-width: min(700px, 100%);
		object-fit: contain;
		filter: drop-shadow(0 22px 48px rgba(0, 0, 0, 0.45));
	}

	.laptop-overlay {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	@media (min-width: 768px) {
		.md\:grid-cols-2 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.md\:gap-16 {
			gap: 4rem;
		}
		.md\:px-12 {
			padding-left: 3rem;
			padding-right: 3rem;
		}
		.md\:text-5xl {
			font-size: 3rem;
			line-height: 1.2;
		}
		.md\:text-xl {
			font-size: 1.25rem;
			line-height: 1.75;
		}

		.image-stack {
			min-height: 320px;
		}
	}

	@media (max-width: 767px) {
		.px-6 {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
		.mt-\[15vh\] {
			margin-top: 15vh;
		}
		.mb-4 {
			margin-bottom: 1rem;
		}
		.text-3xl {
			font-size: 1.875rem;
			line-height: 1.2;
		}
		.text-lg {
			font-size: 1.125rem;
			line-height: 1.75;
		}
		.image-stack {
			max-width: 92vw;
			margin-inline: auto;
		}

		.laptop-base {
			max-width: 100%;
		}
	}

	@keyframes text-gradient-shift {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 200% 50%;
		}
	}
</style>
