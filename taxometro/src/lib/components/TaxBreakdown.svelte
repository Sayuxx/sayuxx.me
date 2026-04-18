<script lang="ts">
	import type { TaxBreakdown } from '$lib/calc/types';

	interface Props {
		breakdown: TaxBreakdown;
		icmsRate: number;
		expanded?: boolean;
	}

	let { breakdown, icmsRate, expanded = false }: Props = $props();
	let isOpen = $state(expanded);

	function fmt(value: number): string {
		return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	}
</script>

<div class="text-sm">
	<button
		onclick={() => isOpen = !isOpen}
		class="flex w-full items-center gap-1 text-left text-ctp-lavender hover:text-ctp-blue"
	>
		<span class="text-xs transition-transform" class:rotate-90={isOpen}>&#9654;</span>
		<span>Detalhes dos impostos</span>
	</button>

	{#if isOpen}
		<div class="mt-2 space-y-1 rounded-md bg-ctp-crust p-3 text-xs">
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">Valor CIF (USD)</span>
				<span class="font-mono text-ctp-text">$ {breakdown.cifUSD.toFixed(2)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">Valor CIF (BRL)</span>
				<span class="font-mono text-ctp-text">{fmt(breakdown.cifBRL)}</span>
			</div>
			<hr class="border-ctp-surface1" />
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">II (Imposto de Importação)</span>
				<span class="font-mono text-ctp-red">{fmt(breakdown.ii)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">ICMS ({(icmsRate * 100).toFixed(0)}%)</span>
				<span class="font-mono text-ctp-red">{fmt(breakdown.icms)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">IOF</span>
				<span class="font-mono text-ctp-red">{fmt(breakdown.iof)}</span>
			</div>
			<hr class="border-ctp-surface1" />
			<div class="flex justify-between font-semibold">
				<span class="text-ctp-text">Total Impostos</span>
				<span class="font-mono text-ctp-maroon">{fmt(breakdown.totalTaxes)}</span>
			</div>
		</div>
	{/if}
</div>
