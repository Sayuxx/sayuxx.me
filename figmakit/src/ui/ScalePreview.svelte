<script lang="ts">
	import type { ColorScale, Step } from '../lib/palette/types';
	import { STEPS } from '../lib/palette/types';
	import { contrastRatio } from '../lib/palette/contrast';

	interface Props {
		label: string;
		scale: ColorScale;
	}

	let { label, scale }: Props = $props();

	function textColor(step: Step): string {
		const onWhite = contrastRatio(scale[step], '#ffffff');
		const onBlack = contrastRatio(scale[step], '#000000');
		return onWhite > onBlack ? '#ffffff' : '#000000';
	}
</script>

<div class="block">
	<div class="head">{label}</div>
	<div class="row">
		{#each STEPS as step (step)}
			<div class="cell" style:background={scale[step]} style:color={textColor(step)} title={`${step} · ${scale[step]}`}>
				<span class="num">{step}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.block {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.head {
		font-size: 11px;
		color: var(--muted);
		text-transform: capitalize;
	}
	.row {
		display: grid;
		grid-template-columns: repeat(11, 1fr);
		border-radius: var(--radius);
		overflow: hidden;
	}
	.cell {
		aspect-ratio: 1 / 2;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 2px;
		font-size: 9px;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
	}
	.num {
		opacity: 0.7;
	}
</style>
