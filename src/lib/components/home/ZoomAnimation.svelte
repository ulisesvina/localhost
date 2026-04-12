<script lang="ts">
	import { translations, useLocaleContext } from '$lib/i18n';
	import { onMount } from 'svelte';

	let container: HTMLElement | null = $state(null);
	let scrollY = $state(0);
	let innerHeight = $state(0);
	let containerTop = $state(0);
	let containerHeight = $state(0);

	const locale = useLocaleContext();
	const copy = $derived(translations[$locale].scroll);

	// Update dimensions only when they change, not on every scroll
	onMount(() => {
		const updateRects = () => {
			if (container) {
				containerTop = container.offsetTop;
				containerHeight = container.offsetHeight;
			}
		};
		updateRects();
		window.addEventListener('resize', updateRects);
		return () => window.removeEventListener('resize', updateRects);
	});

	const progress = $derived(
		containerHeight > 0
			? Math.max(0, Math.min(1, (scrollY - containerTop) / (containerHeight - innerHeight)))
			: 0
	);

	const scale = $derived(Math.max(1, 2.5 - progress * 3));
	const opacity = $derived(Math.min(1, progress * 5));
	const isSettled = $derived(scale <= 1);
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div class="scroll-container" bind:this={container} aria-label={copy.ariaLabel}>
	<div class="scroll-container-background" aria-hidden="true"></div>
	<div class="sticky-content">
		<div class="text-wrapper" style:transform="scale({scale}) translateZ(0)" style:opacity>
			<h1
				class="main-title line-clamp-3 px-20 text-5xl md:text-8xl"
				class:gradient-live={isSettled}
			>
				{copy.title}
			</h1>
		</div>
	</div>
</div>

<style>
	.scroll-container-background {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		background: #000;
		z-index: 0;
	}

	.scroll-container {
		position: relative;
		left: 50%;
		width: 100vw;
		margin-left: -50vw;
		height: 150vh;
		margin-top: clamp(1.5rem, 5vh, 3.5rem);
		z-index: 0;
	}

	@supports (width: 100dvw) {
		.scroll-container {
			width: 100dvw;
			margin-left: -50dvw;
		}
	}

	.sticky-content {
		position: sticky;
		top: 0;
		height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		color: white;
		z-index: 1;
	}

	.text-wrapper {
		text-align: center;
		will-change: transform, opacity;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		width: min(78rem, 94vw);
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.main-title {
		line-height: 0.95;
		font-weight: 700;
		text-wrap: balance;
		color: #fff;
		transition: color 180ms ease;
	}

	.main-title.gradient-live {
		color: transparent;
		background-image: linear-gradient(
			110deg,
			#7af0ff 0%,
			#baf7ff 20%,
			#ffffff 40%,
			#76deff 60%,
			#4dc6ff 80%,
			#7af0ff 100%
		);
		background-size: 220% 100%;
		background-position: 0% 50%;
		-webkit-background-clip: text;
		background-clip: text;
		animation: text-gradient-shift 2.8s linear infinite;
	}

	@media (max-width: 640px) {
		.scroll-container-background,
		.scroll-container {
			height: 540vh;
		}

		.main-title {
			font-size: clamp(2rem, 12vw, 3.4rem);
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
