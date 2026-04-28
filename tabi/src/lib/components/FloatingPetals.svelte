<script lang="ts">
	import { untrack } from 'svelte';

	type Props = {
		count?: number;
	};

	let { count = 14 }: Props = $props();

	const petals = untrack(() =>
		Array.from({ length: count }, (_, i) => ({
			left: Math.random() * 100,
			delay: Math.random() * 12,
			duration: 14 + Math.random() * 12,
			size: 8 + Math.random() * 10,
			drift: (Math.random() - 0.5) * 80,
			rotate: Math.random() * 360,
			opacity: 0.45 + Math.random() * 0.4,
			key: i
		}))
	);
</script>

<div class="tabi-petals" aria-hidden="true">
	{#each petals as p (p.key)}
		<svg
			class="tabi-petal"
			viewBox="0 0 24 24"
			width={p.size}
			height={p.size}
			style="left: {p.left}%; animation-delay: {-p.delay}s; animation-duration: {p.duration}s; --drift: {p.drift}px; --rot-end: {p.rotate}deg; opacity: {p.opacity};"
		>
			<path
				d="M12 2 C 13.5 6, 18 8, 22 12 C 18 14, 14 18, 12 22 C 10 18, 6 14, 2 12 C 6 8, 10.5 6, 12 2 Z"
				fill="#f5c2c7"
				opacity="0.85"
			/>
		</svg>
	{/each}
</div>

<style>
	.tabi-petals {
		position: fixed;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
		z-index: 1;
	}

	.tabi-petal {
		position: absolute;
		top: -5%;
		animation-name: tabi-petal-fall;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		will-change: transform;
	}

	@keyframes tabi-petal-fall {
		0% {
			transform: translate3d(0, 0, 0) rotate(0deg);
		}
		50% {
			transform: translate3d(calc(var(--drift) * 0.5), 50vh, 0) rotate(calc(var(--rot-end) * 0.5));
		}
		100% {
			transform: translate3d(var(--drift), 110vh, 0) rotate(var(--rot-end));
		}
	}
</style>
