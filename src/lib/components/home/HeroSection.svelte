<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '@iconify/svelte';
	import { translations, useLocaleContext } from '$lib/i18n';

	const locale = useLocaleContext();
	const copy = $derived(translations[$locale].hero);
</script>

<section class="hero-shell relative flex min-h-svh items-center justify-center overflow-hidden">
	<div class="hero-background" aria-hidden="true"></div>

	<div
		class="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center md:py-20"
	>
		<h1
			class="intro-enter intro-enter-heading text-5xl font-medium tracking-tighter text-pretty sm:text-6xl md:text-8xl"
		>
			<span class="emphasis-wrap">
				<b class="emphasis-shift emphasis-shift-delay font-black text-foreground italic">
					{copy.title.lead}
				</b>
			</span>
			{copy.title.connector}
			<span class="emphasis-wrap">
				<b class="emphasis-shift font-black text-foreground italic">{copy.title.emphasis}</b>
			</span>
			{copy.title.tail}
		</h1>

		<h2
			class="intro-enter intro-enter-subheading max-w-2xl text-lg leading-relaxed font-light text-foreground-muted md:text-xl"
		>
			{copy.subtitle}
		</h2>

		<ul
			class="intro-enter intro-enter-cta flex w-full flex-col items-center gap-3 pt-6 sm:flex-row sm:justify-center sm:gap-4"
		>
			<li class="w-full max-w-65 sm:w-auto sm:max-w-none">
				<a
					href="#contact"
					class="block w-full text-foreground-muted transition-colors duration-200 hover:text-foreground"
				>
					<Button
						variant="primary"
						class="flex w-full items-center justify-center gap-2 py-2 px-5 text-[0.95rem] sm:py-2.5 sm:px-6 sm:text-base"
					>
						{copy.contactCta}
						<Icon icon="heroicons-outline:mail" />
					</Button>
				</a>
			</li>
			<li class="w-full max-w-65 sm:w-auto sm:max-w-none">
				<a
					href="#resume"
					class="block w-full text-foreground-muted transition-colors duration-200 hover:text-foreground"
				>
					<Button
						variant="secondary"
						class="flex w-full items-center justify-center gap-2 py-2 px-5 text-[0.95rem] sm:py-2.5 sm:px-6 sm:text-base"
					>
						{copy.resumeCta}
						<Icon icon="heroicons:arrow-right" />
					</Button>
				</a>
			</li>
		</ul>

		<div class="intro-enter intro-enter-subheading mx-auto mt-4 h-px w-12 bg-border"></div>
	</div>
</section>
<style>
	.hero-shell {
		width: 100%;
	}

	.hero-background {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		pointer-events: none;
		background-image: radial-gradient(
			circle at center,
			var(--color-background-muted) 0%,
			var(--color-background) 80%
		);
	}

	@media (min-width: 768px) {
		.hero-background {
			background-image: radial-gradient(
				circle at center,
				var(--color-background-muted) 0%,
				var(--color-background) 120%
			);
		}
	}

	.emphasis-wrap {
		display: inline-block;
		vertical-align: bottom;
		overflow: hidden;

		padding-right: 0.15em;
		margin-right: -0.15em;

		padding-top: 0.1em;
		margin-top: -0.1em;
	}

	.emphasis-shift {
		display: inline-block;
		padding-right: 0.05em;
		will-change: transform;
	}
</style>
