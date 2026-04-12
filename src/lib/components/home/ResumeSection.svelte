<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '@iconify/svelte';
	import { translations, useLocaleContext } from '$lib/i18n';

	type ResumeBlockId = 'education' | 'experience' | 'achievements' | 'strengths';

	let sectionEl: HTMLElement | null = $state(null);
	let activeBlock: ResumeBlockId = $state('education');
	const locale = useLocaleContext();
	const copy = $derived(translations[$locale].resume);

	onMount(() => {
		const blocks = sectionEl?.querySelectorAll<HTMLElement>('[data-section]');
		if (!blocks || blocks.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const id = entry.target.getAttribute('data-section') as ResumeBlockId | null;
					if (id) activeBlock = id;
				}
			},
			{
				root: null,
				threshold: 0.45,
				rootMargin: '-15% 0px -35% 0px'
			}
		);

		for (const block of blocks) observer.observe(block);

		return () => observer.disconnect();
	});

</script>

<section id="resume" class="resume-paper" bind:this={sectionEl}>
	<h2 class="flat text-center text-5xl font-bold tracking-wide">{copy.heading}</h2>
	<div class="resume-block" data-section="education" class:active={activeBlock === 'education'}>
		<h3>{copy.sections.education}</h3>
		<div class="entry">
			<div>
				<h4>{copy.education.school}</h4>
				<p>{copy.education.degree}</p>
			</div>
			<p class="entry-meta">{copy.education.date}<br />{copy.education.location}</p>
		</div>
	</div>

	<div class="resume-block" data-section="experience" class:active={activeBlock === 'experience'}>
		<h3>{copy.sections.experience}</h3>
		{#each copy.experience as experience}
			<div class="entry">
				<div>
					<h4>{experience.company}</h4>
					<p class="role">{experience.role}</p>
					<ul>
						{#each experience.bullets as bullet}
							<li>{bullet}</li>
						{/each}
					</ul>
				</div>
				<p class="entry-meta">{experience.date}<br />{experience.location}</p>
			</div>
		{/each}
	</div>

	<div
		class="resume-block"
		data-section="achievements"
		class:active={activeBlock === 'achievements'}
	>
		<h3>{copy.sections.achievements}</h3>
		{#each copy.achievements as achievement}
			<div class="entry">
				<div>
					<h4>{achievement.title}</h4>
					<ul>
						{#each achievement.bullets as bullet}
							<li>{bullet}</li>
						{/each}
					</ul>
				</div>
				<p class="entry-meta">{achievement.date}</p>
			</div>
		{/each}
	</div>

	<div class="resume-block" data-section="strengths" class:active={activeBlock === 'strengths'}>
		<h3>{copy.sections.strengths}</h3>
		<div class="skills-grid">
			{#each copy.strengths as strength}
				<p>
					<strong>{strength.label}</strong><span>{strength.value}</span>
				</p>
			{/each}
		</div>
	</div>
	<a
		href="https://static.ulisesv.com/docs/Resume.pdf"
		target="_blank"
		class="mx-auto mt-8 inline-flex items-center gap-2 w-full"
	>
		<Button class="w-full">{copy.downloadResume} <Icon icon="heroicons:arrow-down-solid" /></Button>
	</a>
</section>

<style>
	.resume-paper {
		width: min(900px, 100%);
		box-shadow:
			0 22px 50px rgb(0 0 0 / 42%),
			inset 0 1px 0 rgb(255 255 255 / 4%);
		padding: clamp(1.25rem, 2.5vw, 2.2rem);
	}

	.resume-block {
		margin-top: 1.25rem;
		padding: 0.95rem 1rem;
		border: 1px solid color-mix(in oklab, var(--color-border) 90%, white 10%);
		border-radius: 0.8rem;
		background: color-mix(in oklab, var(--color-surface) 82%, black 18%);
		transition:
			border-color 220ms ease,
			box-shadow 220ms ease,
			transform 220ms ease,
			background-color 220ms ease;
	}

	.resume-block:hover {
		transform: translateY(-2px);
		border-color: color-mix(in oklab, var(--color-primary) 45%, var(--color-border) 55%);
	}

	.resume-block.active {
		border-color: color-mix(in oklab, var(--color-primary) 70%, white 30%);
		box-shadow:
			0 0 0 1px rgb(122 240 255 / 14%),
			0 14px 28px rgb(0 0 0 / 30%);
		background: color-mix(in oklab, var(--color-surface-elevated) 88%, black 12%);
	}

	.resume-block h3 {
		font-size: 1.1rem;
		margin: 0;
		padding-bottom: 0.35rem;
		border-bottom: 1px solid color-mix(in oklab, var(--color-border) 82%, white 18%);
		color: var(--color-primary);
		letter-spacing: 0.03em;
	}

	.entry {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 1rem;
		padding-top: 0.55rem;
	}

	.entry h4 {
		margin: 0;
		font-size: 1.02rem;
		color: var(--color-foreground);
	}

	.role {
		margin: 0.1rem 0 0.35rem;
		font-style: italic;
		color: var(--color-foreground-muted);
	}

	.entry ul {
		margin: 0;
		padding-left: 1.1rem;
		display: grid;
		gap: 0.25rem;
	}

	.entry li {
		line-height: 1.4;
		color: var(--color-foreground-muted);
	}

	.entry > div > p {
		margin: 0.2rem 0 0;
	}

	.entry-meta {
		margin: 0;
		text-align: right;
		font-style: italic;
		white-space: nowrap;
		color: var(--color-foreground-subtle);
	}

	.skills-grid {
		display: grid;
		gap: 0.3rem;
		padding-top: 0.4rem;
	}

	.skills-grid p {
		margin: 0;
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 0.75rem;
	}

	.skills-grid strong {
		color: var(--color-foreground);
	}

	.skills-grid span {
		color: var(--color-foreground-muted);
	}

	@media (max-width: 760px) {
		.entry {
			grid-template-columns: 1fr;
		}

		.entry-meta {
			text-align: left;
			white-space: normal;
		}

		.skills-grid p {
			grid-template-columns: 1fr;
			gap: 0.2rem;
		}
	}
</style>
