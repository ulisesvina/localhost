<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import portfolioModelUrl from '$lib/assets/models/macintosh.glb?url';
	import Icon from '@iconify/svelte';
	import Button from '../ui/Button.svelte';
	import { translations, useLocaleContext } from '$lib/i18n';

	let canvasEl: HTMLCanvasElement | null = $state(null);
	let sectionEl: HTMLElement | null = $state(null);
	let emailInput = $state('');
	let modalEmail = $state('');
	let isContactModalOpen = $state(false);
	let modelRadius = 1;
	const locale = useLocaleContext();
	const copy = $derived(translations[$locale].contact);

	const openContactModal = () => {
		modalEmail = emailInput.trim();
		isContactModalOpen = true;
	};

	const closeContactModal = () => {
		isContactModalOpen = false;
	};

	const onEmailStepSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		if (!emailInput.trim()) return;
		openContactModal();
	};

	const onModalBackdropClick = (event: MouseEvent) => {
		if (event.target === event.currentTarget) {
			closeContactModal();
		}
	};

	const onModalKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closeContactModal();
		}
	};

	onMount(() => {
		if (!canvasEl || !sectionEl) return;
		const canvas = canvasEl;
		const section = sectionEl;
		if (!canvas || !section) return;

		const renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true,
			alpha: true
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.outputColorSpace = THREE.SRGBColorSpace;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 1000);
		camera.position.set(0, 0, 4);

		const keyLight = new THREE.DirectionalLight(0xfff6dc, 1.4);
		keyLight.position.set(4, 7, 8);
		scene.add(keyLight);

		const rimLight = new THREE.DirectionalLight(0x8fb8ff, 0.8);
		rimLight.position.set(-5, 2, -3);
		scene.add(rimLight);

		scene.add(new THREE.AmbientLight(0xffffff, 0.75));
		const modelGroup = new THREE.Group();
		scene.add(modelGroup);

		let loadedModel: THREE.Object3D | null = null;
		let isDisposed = false;
		let pausedTime = 0;
		let scrollPauseStart: number | null = null;
		let scrollResumeTimer: number | null = null;
		const scrollPauseDelay = 140;

		const frameCamera = () => {
			const vFov = THREE.MathUtils.degToRad(camera.fov);
			const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);

			const distanceByHeight = modelRadius / Math.tan(vFov / 2);
			const distanceByWidth = modelRadius / Math.tan(hFov / 2);
			const distance = Math.max(distanceByHeight, distanceByWidth) * 1.35;

			camera.position.set(0, 0, distance);
			camera.near = Math.max(distance * 0.05, 0.01);
			camera.far = Math.max(distance * 25, 100);
			camera.lookAt(0, 0, 0);
			camera.updateProjectionMatrix();
		};

		const loadModel = async () => {
			try {
				const loader = new GLTFLoader();
				const gltf = await loader.loadAsync(portfolioModelUrl);
				if (isDisposed) return;

				loadedModel = gltf.scene;
				const bounds = new THREE.Box3().setFromObject(loadedModel);
				const center = bounds.getCenter(new THREE.Vector3());
				const sphere = bounds.getBoundingSphere(new THREE.Sphere());

				loadedModel.position.sub(center);
				modelRadius = Math.max(sphere.radius, 0.01);
				loadedModel.rotation.y = 0.35;

				modelGroup.add(loadedModel);
				frameCamera();
			} catch (error) {
				console.error('Failed to load portfolio model', error);
			}
		};

		void loadModel();

		const resize = () => {
			const { width, height } = canvas.getBoundingClientRect();
			if (!width || !height) return;

			renderer.setSize(width, height, false);
			camera.aspect = width / height;
			frameCamera();
		};

		const getScrollProgress = () => {
			const rect = section.getBoundingClientRect();
			const viewportHeight = window.innerHeight || 1;
			const start = viewportHeight;
			const end = -rect.height;
			const raw = (start - rect.top) / (start - end);
			return THREE.MathUtils.clamp(raw, 0, 1);
		};

		const pauseTimeAnimation = () => {
			if (scrollPauseStart === null) {
				scrollPauseStart = performance.now();
			}

			if (scrollResumeTimer !== null) {
				window.clearTimeout(scrollResumeTimer);
			}

			scrollResumeTimer = window.setTimeout(() => {
				if (scrollPauseStart !== null) {
					pausedTime += performance.now() - scrollPauseStart;
					scrollPauseStart = null;
				}
				scrollResumeTimer = null;
			}, scrollPauseDelay);
		};

		let rafId = 0;

		const tick = (time: number) => {
			const progress = getScrollProgress();

			const scrollRotation = THREE.MathUtils.lerp(-0.45, 0.45, progress);
			const effectiveTime =
				scrollPauseStart === null ? time - pausedTime : scrollPauseStart - pausedTime;
			const timeRotation = effectiveTime * 0.00025;

			modelGroup.rotation.y = scrollRotation + timeRotation;

			renderer.render(scene, camera);
			rafId = requestAnimationFrame(tick);
		};

		resize();
		rafId = requestAnimationFrame(tick);
		window.addEventListener('resize', resize);
		window.addEventListener('scroll', pauseTimeAnimation, { passive: true });

		return () => {
			isDisposed = true;
			cancelAnimationFrame(rafId);
			window.removeEventListener('resize', resize);
			window.removeEventListener('scroll', pauseTimeAnimation);
			if (scrollResumeTimer !== null) {
				window.clearTimeout(scrollResumeTimer);
			}

			modelGroup.traverse((object: THREE.Object3D) => {
				if (!(object instanceof THREE.Mesh)) return;
				object.geometry.dispose();
				if (Array.isArray(object.material)) {
					for (const material of object.material) material.dispose();
					return;
				}
				object.material.dispose();
			});

			if (loadedModel) modelGroup.remove(loadedModel);

			renderer.dispose();
		};
	});
</script>

<section bind:this={sectionEl} class="grid items-center py-24 md:grid-cols-2 md:gap-12 md:py-28" id="contact">
	<div class="copy">
		<h3>{copy.heading}</h3>
		<p class="flat leading-tight">
			{copy.intro}
			<br /><br />
		</p>
		<form onsubmit={onEmailStepSubmit} class="mt-4 flex max-w-md flex-col gap-4">
			<input
				type="email"
				name="lead_email"
				placeholder={copy.emailPlaceholder}
				required
				bind:value={emailInput}
				class="flex-1 rounded-md border border-border bg-transparent px-4 py-3
					focus:ring-2 focus:ring-primary/50 focus:outline-none"
			/>
			<Button type="submit" variant="primary" class="rounded-lg py-1 max-h-fit">
				{copy.continue} <Icon icon="heroicons-outline:mail" />
			</Button
			>
		</form>
	</div>

	<div aria-hidden="true">
		<canvas bind:this={canvasEl} aria-label="3D portfolio model"></canvas>
	</div>
</section>

{#if isContactModalOpen}
		<div
			class="contact-modal-backdrop"
			role="presentation"
			onclick={onModalBackdropClick}
			onkeydown={onModalKeydown}
		>
		<div class="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
			<button
				type="button"
				class="close-button"
				onclick={closeContactModal}
				aria-label={copy.close}
			>
				<Icon icon="heroicons-outline:x" />
			</button>

			<h4 id="contact-modal-title">{copy.modalTitle}</h4>

			<form
				action="https://formspree.io/f/maqawwzy"
				method="POST"
				class="contact-form"
			>
				<input
					type="email"
					name="email"
					placeholder={copy.emailPlaceholder}
					required
					bind:value={modalEmail}
					class="rounded-md border border-border bg-transparent px-4 py-3
						focus:ring-2 focus:ring-primary/50 focus:outline-none"
				/>
				<input
					type="text"
					name="name"
					placeholder={copy.namePlaceholder}
					required
					class="rounded-md border border-border bg-transparent px-4 py-3
						focus:ring-2 focus:ring-primary/50 focus:outline-none"
				/>
				<input
					type="text"
					name="subject"
					placeholder={copy.subjectPlaceholder}
					required
					class="rounded-md border border-border bg-transparent px-4 py-3
						focus:ring-2 focus:ring-primary/50 focus:outline-none"
				/>
				<textarea
					name="message"
					placeholder={copy.messagePlaceholder}
					required
					rows="6"
					class="rounded-md border border-border bg-transparent px-4 py-3
						focus:ring-2 focus:ring-primary/50 focus:outline-none"
				></textarea>

				<div class="contact-actions">
					<button type="button" class="cancel-button" onclick={closeContactModal}>{copy.cancel}</button>
					<Button type="submit" variant="primary" class="rounded-lg py-2"
						>{copy.send} <Icon icon="heroicons-outline:paper-airplane" /></Button
					>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.copy {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h3 {
		font-size: clamp(1.65rem, 3vw, 2.2rem);
		line-height: 1.2;
		text-wrap: balance;
	}

	p {
		color: var(--color-foreground-muted);
		font-size: clamp(1rem, 1.4vw, 1.08rem);
		max-width: 34ch;
	}

	canvas {
		width: 100%;
		height: clamp(300px, 48vh, 500px);
		display: block;
	}

	.contact-modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: grid;
		place-items: center;
		padding: 1.25rem;
		background: rgb(8 10 18 / 62%);
		backdrop-filter: blur(6px);
	}

	.contact-modal {
		position: relative;
		width: min(580px, 100%);
		border-radius: 1rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		padding: 1.5rem;
		display: grid;
		gap: 1rem;
	}

	h4 {
		font-size: clamp(1.2rem, 2.2vw, 1.5rem);
		line-height: 1.2;
	}

	.close-button {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		display: inline-grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		border: 1px solid var(--color-border);
		background: transparent;
		cursor: pointer;
	}

	.contact-form {
		display: grid;
		gap: 0.75rem;
	}

	.contact-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.cancel-button {
		border-radius: 0.75rem;
		border: 1px solid var(--color-border);
		background: transparent;
		padding: 0.6rem 1rem;
		cursor: pointer;
	}

	@media (max-width: 640px) {
		.contact-actions {
			flex-direction: column;
		}

		.contact-actions :global(button) {
			width: 100%;
		}
	}
</style>
