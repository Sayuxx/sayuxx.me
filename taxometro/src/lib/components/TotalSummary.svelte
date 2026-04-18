<script lang="ts">
	import { products, selectedShippingMethod, selectedState } from '$lib/stores/cart';
	import { exchangeStore } from '$lib/stores/exchange';
	import { calculateTaxes, calculateShipping, calculateTotalWeight, distributeShipping, resolveIcmsRate } from '$lib/calc/engine';
	import type { RateTable, ShippingTable } from '$lib/calc/types';
	import ratesData from '$lib/data/rates.json';
	import shippingData from '$lib/data/shipping.json';

	function getRateTable(): RateTable {
		return {
			exchangeRates: {
				jpyToBrl: $exchangeStore.jpyToBrl,
				jpyToUsd: $exchangeStore.jpyToUsd
			},
			taxes: {
				...ratesData.taxes,
				icmsRate: resolveIcmsRate($selectedState, ratesData.icmsByState, ratesData.taxes.icmsRate)
			}
		};
	}

	const totalWeight = $derived(calculateTotalWeight($products));
	const shipping = $derived(
		calculateShipping(totalWeight, $selectedShippingMethod, shippingData as ShippingTable, $exchangeStore.jpyToBrl)
	);

	const summary = $derived.by(() => {
		if ($products.length === 0) return null;

		const rates = getRateTable();
		const shippingDistribution = distributeShipping($products, shipping.costJPY);

		let subtotalProductsBRL = 0;
		let subtotalTaxesBRL = 0;

		for (let i = 0; i < $products.length; i++) {
			const breakdown = calculateTaxes($products[i], rates, shippingDistribution[i]);
			subtotalProductsBRL += breakdown.productPriceBRL;
			subtotalTaxesBRL += breakdown.totalTaxes;
		}

		return {
			subtotalProductsBRL,
			subtotalTaxesBRL,
			shippingBRL: shipping.costBRL,
			grandTotalBRL: subtotalProductsBRL + subtotalTaxesBRL + shipping.costBRL
		};
	});

	function fmt(value: number): string {
		return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	}
</script>

{#if summary}
	<div class="rounded-lg border-2 border-ctp-lavender/30 bg-gradient-to-br from-ctp-surface0 to-ctp-mantle p-5 shadow-sm">
		<h2 class="mb-4 text-lg font-semibold text-ctp-text">Resumo Total</h2>

		<div class="space-y-2 text-sm">
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">Produtos ({$products.length})</span>
				<span class="font-mono text-ctp-text">{fmt(summary.subtotalProductsBRL)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-red">Impostos</span>
				<span class="font-mono text-ctp-red">{fmt(summary.subtotalTaxesBRL)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">Frete</span>
				<span class="font-mono text-ctp-text">{fmt(summary.shippingBRL)}</span>
			</div>
			<hr class="border-ctp-surface1" />
			<div class="flex justify-between text-xl font-bold">
				<span class="text-ctp-text">TOTAL</span>
				<span class="text-ctp-lavender">{fmt(summary.grandTotalBRL)}</span>
			</div>
		</div>

		<p class="mt-3 text-xs text-ctp-overlay0">
			Valores estimados. Taxas reais podem variar conforme classificação aduaneira.
		</p>
	</div>
{/if}
