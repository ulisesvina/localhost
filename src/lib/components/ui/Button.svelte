<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'primary',
		children,
		class: className = '',
		...rest
	} = $props<{
		variant?: 'primary' | 'secondary' | 'ghost' | 'glow';
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}>();

	const base =
		'py-2.5 px-6 rounded-full flex gap-2 items-center justify-center min-w-fit font-medium transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20';

	const variants: Record<string, string> = {
		primary:
			'border-2 border-gray-700 bg-linear-to-b from-gray-400/80 to-gray-700 hover:from-gray-400 hover:to-gray-700/90 text-white',
		secondary:
			'bg-white/5 text-white border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20',
		ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
		glow: 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] border border-white'
	};
</script>

<button {...rest} class={`${base} ${variants[variant] ?? variants.primary} ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</button>
