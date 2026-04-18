<script lang="ts">
	import type { TaxBreakdown } from '$lib/calc/types';
	import { untrack } from 'svelte';
	import Icon from './Icon.svelte';

	interface Props {
		breakdown: TaxBreakdown;
		icmsRate: number;
		expanded?: boolean;
	}

	let { breakdown, icmsRate, expanded = false }: Props = $props();
	let isOpen = $state(untrack(() => expanded));

	function fmt(value: number): string {
		return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	}
</script>

<div class="text-sm">
	<button
		type="button"
		onclick={() => (isOpen = !isOpen)}
		class="inline-flex items-center gap-1.5 text-xs font-medium text-ctp-lavender transition-colors hover:text-ctp-blue"
		aria-expanded={isOpen}
	>
		<span class="tx-chevron-toggle" class:is-open={isOpen} aria-hidden="true">
			<Icon name="chevron-right" size={12} />
		</span>
		<span>Detalhes dos impostos</span>
	</button>

	{#if isOpen}
		<div
			class="mt-2 space-y-1.5 rounded-xl border border-ctp-surface1/50 bg-ctp-crust/60 p-3 text-xs tx-anim-in"
			style="border-color: color-mix(in oklch, var(--ctp-surface1) 50%, transparent);"
		>
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">Valor CIF (USD)</span>
				<span class="tx-mono text-ctp-text">$ {breakdown.cifUSD.toFixed(2)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">Valor CIF (BRL)</span>
				<span class="tx-mono text-ctp-text">{fmt(breakdown.cifBRL)}</span>
			</div>
			<hr class="tx-divider" />
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">II (Imposto de Importação)</span>
				<span class="tx-mono text-ctp-red">{fmt(breakdown.ii)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">ICMS ({(icmsRate * 100).toFixed(0)}%)</span>
				<span class="tx-mono text-ctp-red">{fmt(breakdown.icms)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">IOF</span>
				<span class="tx-mono text-ctp-red">{fmt(breakdown.iof)}</span>
			</div>
			<hr class="tx-divider" />
			<div class="flex justify-between font-semibold">
				<span class="text-ctp-text">Total impostos</span>
				<span class="tx-mono text-ctp-maroon">{fmt(breakdown.totalTaxes)}</span>
			</div>
		</div>
	{/if}
</div>
