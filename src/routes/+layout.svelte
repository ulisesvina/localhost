<script lang="ts">
	import '$lib/css/fonts.css';
	import '../app.css';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import favicon from '$lib/assets/favicon.svg';
	import {
		createLocaleStore,
		detectLocaleFromNavigator,
		defaultLocale,
		setLocaleContext,
		translations,
		type Locale
	} from '$lib/i18n';

	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children, data } = $props<{
		children: import('svelte').Snippet;
		data: { locale?: Locale };
	}>();

	const localeStore = createLocaleStore(defaultLocale);
	setLocaleContext(localeStore);

	$effect(() => {
		localeStore.set(data.locale ?? defaultLocale);
	});

	const setVpHeight = () => {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	};

	onMount(() => {
		const browserLocale = detectLocaleFromNavigator();
		if (browserLocale !== get(localeStore)) {
			localeStore.set(browserLocale);
		}

    setVpHeight();
	});
</script>

<svelte:window on:orientationchange={setVpHeight} on:resize={setVpHeight} />

<svelte:head>
	<html lang={$localeStore}></html>
	<title>{translations[$localeStore].siteTitle}</title>
	<meta name="description" content={translations[$localeStore].siteDescription} />
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="layout">
	<Header />
	<div class="mx-auto max-w-3xl px-4">
		{@render children()}
	</div>
	<Footer />
</div>

<style>
	.layout {
		display: flex;
		flex-direction: column;
		min-height: 100svh;
	}
</style>
