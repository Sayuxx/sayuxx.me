<script lang="ts">
	import { products, removeProduct } from '$lib/stores/cart';
	import { exchangeStore } from '$lib/stores/exchange';
	import { calculateTaxes } from '$lib/calc/engine';
	import type { RateTable } from '$lib/calc/types';
	import ratesData from '$lib/data/rates.json';
	import categoriesData from '$lib/data/categories.json';
	import TaxBreakdown from './TaxBreakdown.svelte';

	const categoryLabels: Record<string, string> = {};
	for (const cat of categoriesData) {
		categoryLabels[cat.id] = cat.label;
	}

	function getRateTable(exchange: typeof $exchangeStore): RateTable {
		return {
			exchangeRates: {
				jpyToBrl: exchange.jpyToBrl,
				jpyToUsd: exchange.jpyToUsd
			},
			taxes: ratesData.taxes
		};
	}

	function fmt(value: number): string {
		return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	}

	function fmtJpy(value: number): string {
		return '¥' + value.toLocaleString('ja-JP');
	}
</script>

{#if $products.length === 0}
	<div class="rounded-lg border-2 border-dashed border-ctp-surface1 p-8 text-center text-ctp-overlay1">
		<p>Nenhum produto adicionado.</p>
		<p class="text-sm">Adicione produtos acima para calcular os impostos.</p>
	</div>
{:else}
	<div class="space-y-3">
		{#each $products as product (product.id)}
			{@const rates = getRateTable($exchangeStore)}
			{@const breakdown = calculateTaxes(product, rates)}
			<div class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-4 shadow-sm">
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<h3 class="truncate font-medium text-ctp-text">{product.name}</h3>
							<span class="rounded-full bg-ctp-surface0 px-2 py-0.5 text-xs text-ctp-subtext0">
								{categoryLabels[product.category] ?? product.category}
							</span>
						</div>
						<div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ctp-overlay1">
							<span>{fmtJpy(product.priceJPY)} x {product.quantity}</span>
							<span>{product.weightGrams}g</span>
							<span class="font-medium text-ctp-subtext1">{fmt(breakdown.productPriceBRL)}</span>
						</div>
					</div>
					<div class="text-right">
						<p class="text-lg font-bold text-ctp-text">{fmt(breakdown.totalWithTaxes)}</p>
						<p class="text-xs text-ctp-red">+{fmt(breakdown.totalTaxes)} em impostos</p>
					</div>
					<button
						onclick={() => removeProduct(product.id)}
						class="shrink-0 rounded p-1 text-ctp-overlay0 hover:bg-ctp-surface0 hover:text-ctp-red"
						title="Remover produto"
					>
						&#x2715;
					</button>
				</div>
				<div class="mt-2">
					<TaxBreakdown {breakdown} />
				</div>
			</div>
		{/each}
	</div>
{/if}
