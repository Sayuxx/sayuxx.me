<script lang="ts">
	import { products, selectedShippingMethod, selectedState } from '$lib/stores/cart';
	import { exchangeStore } from '$lib/stores/exchange';
	import {
		calculateTaxes,
		calculateShipping,
		calculateTotalWeight,
		distributeShipping,
		resolveIcmsRate
	} from '$lib/calc/engine';
	import type { RateTable, ShippingTable } from '$lib/calc/types';
	import ratesData from '$lib/data/rates.json';
	import shippingData from '$lib/data/shipping.json';
	import Icon from './Icon.svelte';

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
		calculateShipping(
			totalWeight,
			$selectedShippingMethod,
			shippingData as ShippingTable,
			$exchangeStore.jpyToBrl
		)
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
	<aside class="tx-summary">
		<div class="mb-4 flex items-center gap-3">
			<span class="tx-icon-badge" aria-hidden="true">
				<Icon name="receipt" size={16} />
			</span>
			<h2 class="text-base font-semibold text-ctp-text">Resumo do pedido</h2>
		</div>

		<div class="space-y-2.5 text-sm">
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">Produtos ({$products.length})</span>
				<span class="tx-mono text-ctp-text">{fmt(summary.subtotalProductsBRL)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-red">Impostos</span>
				<span class="tx-mono text-ctp-red">{fmt(summary.subtotalTaxesBRL)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">Frete</span>
				<span class="tx-mono text-ctp-text">{fmt(summary.shippingBRL)}</span>
			</div>
			<hr class="tx-divider" />
			<div class="flex items-end justify-between pt-1">
				<span class="text-xs font-medium tracking-wider text-ctp-subtext0 uppercase">
					Total
				</span>
				<span class="tx-mono text-[1.75rem] font-bold tracking-tight text-ctp-lavender">
					{fmt(summary.grandTotalBRL)}
				</span>
			</div>
		</div>

		<p class="mt-4 flex items-start gap-2 text-xs text-ctp-overlay1">
			<span class="mt-0.5 shrink-0 text-ctp-overlay0" aria-hidden="true">
				<Icon name="info" size={14} />
			</span>
			<span>
				Valores estimados. Taxas reais podem variar conforme classificação aduaneira.
			</span>
		</p>
	</aside>
{/if}
