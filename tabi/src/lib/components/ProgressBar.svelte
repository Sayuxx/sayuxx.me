<script lang="ts">
	type Props = {
		value: number;
		max: number;
	};

	let { value, max }: Props = $props();

	const segments = $derived(Array.from({ length: max }, (_, i) => i < value));
</script>

<div class="tabi-progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
	<div class="tabi-progress-track">
		{#each segments as filled, i (i)}
			<span class="tabi-progress-tick" class:is-filled={filled}></span>
		{/each}
	</div>
	<div class="tabi-progress-label tabi-jp">
		{value} <span class="tabi-progress-sep">／</span> {max}
	</div>
</div>

<style>
	.tabi-progress {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}
	.tabi-progress-track {
		flex: 1;
		display: flex;
		gap: 0.375rem;
	}
	.tabi-progress-tick {
		flex: 1;
		height: 4px;
		background-color: color-mix(in oklch, var(--color-navy) 14%, transparent);
		border-radius: var(--radius-full);
		transition: background-color 320ms var(--ease-out);
	}
	.tabi-progress-tick.is-filled {
		background-color: var(--color-red);
	}
	.tabi-progress-label {
		font-size: 0.8125rem;
		color: color-mix(in oklch, var(--color-navy) 65%, var(--color-cream));
		font-variant-numeric: tabular-nums;
		min-width: 3.5rem;
		text-align: right;
	}
	.tabi-progress-sep {
		color: color-mix(in oklch, var(--color-navy) 35%, var(--color-cream));
		margin: 0 0.125rem;
	}
</style>
