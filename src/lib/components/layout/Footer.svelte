<script lang="ts">
	import { translations, useLocaleContext } from '$lib/i18n';

	const locale = useLocaleContext();
	const copy = $derived(translations[$locale].footer);
</script>

<footer class="bottom-0 mt-10 w-scree p-2 text-center md:p-3">
	<div class="grid grid-cols-2">
		<div class="w-full">
			© {new Date().getFullYear() + ' '}
			Ulises Viña.
		</div>
		<div class="w-full">{copy.headline}</div>
	</div>
	<p class="my-2 text-xs">
		{copy.license}
		{' '}
		<a
			target="_BLANK"
			href="https://github.com/ulisesvina/ulisesvina/blob/master/LICENSE"
			rel="noreferrer"
		>
			<span class="underline">GNU General Public License 3.0</span>
		</a>
	</p>
</footer>
