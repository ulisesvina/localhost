<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import { translations, useLocaleContext, type Locale } from '$lib/i18n';

	let isAtTop = $state(true);
	let mobileMenuOpen = $state(false);
	let innerWidth = $state(0);
	const locale = useLocaleContext();
	const copy = $derived(translations[$locale].header);
	const currentLocale = $derived($locale);

	const MOBILE_BREAKPOINT = 768;

	let isMobile = $derived(innerWidth < MOBILE_BREAKPOINT);

	function handleScroll(): void {
		if (browser) {
			isAtTop = window.scrollY < 50;
		}
	}

	function toggleMobileMenu(): void {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu(): void {
		mobileMenuOpen = false;
	}

	function setLocale(nextLocale: Locale): void {
		locale.set(nextLocale);
	}

	onMount(() => {
		handleScroll();
	});

	$effect(() => {
		if (!isMobile && mobileMenuOpen) {
			mobileMenuOpen = false;
		}
	});

</script>

<svelte:window on:scroll={handleScroll} bind:innerWidth />

<header
	in:fly={{ y: -20, duration: 300 }}
	class="sticky top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out {isAtTop
		? 'bg-transparent py-2'
		: 'border-b border-border bg-black/90 py-1 backdrop-blur-sm'}"
>
	<div class="mx-auto flex w-full max-w-4xl items-center justify-between px-4">
		<h1 class="flat text-xl leading-relaxed font-medium">Ulises Viña</h1>

		<nav class="hidden md:block">
			<ul class="flex items-center gap-3">
				<li>
					<div class="flex items-center gap-1 rounded-full border border-border bg-black/30 p-1">
						<button
							type="button"
							onclick={() => setLocale('es')}
							class="grid h-8 w-8 place-items-center rounded-full text-base transition-colors duration-200 {currentLocale === 'es' ? 'bg-white/12' : 'text-foreground-muted hover:text-foreground hover:bg-white/6'}"
							aria-label="Spanish"
							aria-pressed={currentLocale === 'es'}
						>
							<span aria-hidden="true">🇲🇽</span>
						</button>
						<button
							type="button"
							onclick={() => setLocale('en')}
							class="grid h-8 w-8 place-items-center rounded-full text-base transition-colors duration-200 {currentLocale === 'en' ? 'bg-white/12' : 'text-foreground-muted hover:text-foreground hover:bg-white/6'}"
							aria-label="English"
							aria-pressed={currentLocale === 'en'}
						>
							<span aria-hidden="true">🇺🇸</span>
						</button>
					</div>
				</li>
				<li>
					<a
						href="https://www.linkedin.com/in/ulisesvina/"
						target="_blank"
						rel="noopener noreferrer"
						class="text-foreground-muted transition-colors duration-200 hover:text-foreground"
					>
						<Icon icon="mdi:linkedin" width="24" height="24" />
						<span class="sr-only">{copy.socialLinks.linkedin}</span>
					</a>
				</li>
				<li>
					<a
						href="https://github.com/ulisesvina"
						target="_blank"
						rel="noopener noreferrer"
						class="text-foreground-muted transition-colors duration-200 hover:text-foreground"
					>
						<Icon icon="mdi:github" width="24" height="24" />
						<span class="sr-only">{copy.socialLinks.github}</span>
					</a>
				</li>
				<li>
					<a
						href="https://x.com/ulisesvina"
						target="_blank"
						rel="noopener noreferrer"
						class="text-foreground-muted transition-colors duration-200 hover:text-foreground"
					>
						<Icon icon="pajamas:twitter" width="24" height="24" />
						<span class="sr-only">{copy.socialLinks.x}</span>
					</a>
				</li>
			</ul>
		</nav>

		<button
			type="button"
			onclick={toggleMobileMenu}
			class="ml-auto flex h-8 w-8 items-center justify-center rounded-md p-1 text-foreground md:hidden"
			aria-expanded={mobileMenuOpen}
			aria-controls="mobile-header-nav"
			aria-label={mobileMenuOpen ? copy.closeMenu : copy.openMenu}
		>
			{#if mobileMenuOpen}
				<Icon icon="lucide:x" width="20" height="20" />
			{:else}
				<Icon icon="lucide:menu" width="20" height="20" />
			{/if}
		</button>
	</div>
</header>

{#if mobileMenuOpen && isMobile}
	<button
		type="button"
		class="sticky inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
		onclick={closeMobileMenu}
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
		aria-label={copy.closeOverlay}
	></button>

	<nav
		id="mobile-header-nav"
		class="fixed top-0 right-0 bottom-0 z-50 w-[min(22rem,90vw)] border-l border-border bg-black p-6 shadow-lg md:hidden"
		in:fly={{ x: 320, duration: 300 }}
		out:fly={{ x: 320, duration: 300 }}
	>
		<ul class="mt-14 flex flex-col gap-5">
			<li>
				<div class="inline-flex items-center gap-2 rounded-full border border-border bg-black/30 p-1">
					<button
						type="button"
						onclick={() => setLocale('es')}
						class="grid h-9 w-9 place-items-center rounded-full text-lg transition-colors duration-200 {currentLocale === 'es' ? 'bg-white/12' : 'text-foreground-muted hover:text-foreground hover:bg-white/6'}"
						aria-label="Spanish"
						aria-pressed={currentLocale === 'es'}
					>
						<span aria-hidden="true">🇲🇽</span>
					</button>
					<button
						type="button"
						onclick={() => setLocale('en')}
						class="grid h-9 w-9 place-items-center rounded-full text-lg transition-colors duration-200 {currentLocale === 'en' ? 'bg-white/12' : 'text-foreground-muted hover:text-foreground hover:bg-white/6'}"
						aria-label="English"
						aria-pressed={currentLocale === 'en'}
					>
						<span aria-hidden="true">🇺🇸</span>
					</button>
				</div>
			</li>
			<li>
				<a
					href="https://www.linkedin.com/in/ulisesvina/"
					target="_blank"
					rel="noopener noreferrer"
					onclick={closeMobileMenu}
					class="flex items-center gap-3 text-base text-foreground-muted transition-colors duration-200 hover:text-foreground"
				>
					<Icon icon="mdi:linkedin" width="22" height="22" />
					<span>{copy.socialLinks.linkedin}</span>
				</a>
			</li>
			<li>
				<a
					href="https://github.com/ulisesvina"
					target="_blank"
					rel="noopener noreferrer"
					onclick={closeMobileMenu}
					class="flex items-center gap-3 text-base text-foreground-muted transition-colors duration-200 hover:text-foreground"
				>
					<Icon icon="mdi:github" width="22" height="22" />
					<span>{copy.socialLinks.github}</span>
				</a>
			</li>
			<li>
				<a
					href="https://x.com/ulisesvina"
					target="_blank"
					rel="noopener noreferrer"
					onclick={closeMobileMenu}
					class="flex items-center gap-3 text-base text-foreground-muted transition-colors duration-200 hover:text-foreground"
				>
					<Icon icon="pajamas:twitter" width="22" height="22" />
					<span>{copy.socialLinks.x}</span>
				</a>
			</li>
		</ul>
	</nav>
{/if}
