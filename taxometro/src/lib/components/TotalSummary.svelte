<script lang="ts">
	import {
		products,
		selectedShippingMethod,
		selectedState,
		singlePackage
	} from '$lib/stores/cart';
	import { exchangeStore } from '$lib/stores/exchange';
	import {
		calculateTaxes,
		calculateShipping,
		calculateSeparateShipping,
		calculateTotalWeight,
		distributeShipping,
		resolveIcmsRate
	} from '$lib/calc/engine';
	import type { Product, RateTable, ShippingTable } from '$lib/calc/types';
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

	const singleShipping = $derived(
		calculateShipping(
			totalWeight,
			$selectedShippingMethod,
			shippingData as ShippingTable,
			$exchangeStore.jpyToBrl
		)
	);

	const separateShipping = $derived(
		calculateSeparateShipping(
			$products,
			$selectedShippingMethod,
			shippingData as ShippingTable,
			$exchangeStore.jpyToBrl
		)
	);

	function computeTotals(
		items: Product[],
		rates: RateTable,
		shippingPerItemJPY: number[],
		shippingBRL: number
	) {
		let subtotalProductsBRL = 0;
		let subtotalTaxesBRL = 0;
		for (let i = 0; i < items.length; i++) {
			const breakdown = calculateTaxes(items[i], rates, shippingPerItemJPY[i]);
			subtotalProductsBRL += breakdown.productPriceBRL;
			subtotalTaxesBRL += breakdown.totalTaxes;
		}
		return {
			subtotalProductsBRL,
			subtotalTaxesBRL,
			shippingBRL,
			grandTotalBRL: subtotalProductsBRL + subtotalTaxesBRL + shippingBRL
		};
	}

	const summary = $derived.by(() => {
		if ($products.length === 0) return null;

		const rates = getRateTable();
		const singleAlloc = distributeShipping($products, singleShipping.costJPY);
		const singleTotals = computeTotals($products, rates, singleAlloc, singleShipping.costBRL);

		if ($products.length < 2) {
			return { primary: singleTotals, alternative: null, mode: 'single' as const };
		}

		const separateTotals = computeTotals(
			$products,
			rates,
			separateShipping.perProductJPY,
			separateShipping.costBRL
		);

		return {
			primary: $singlePackage ? singleTotals : separateTotals,
			alternative: $singlePackage ? separateTotals : singleTotals,
			mode: $singlePackage ? ('single' as const) : ('separate' as const)
		};
	});

	function fmt(value: number): string {
		return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	}

	function fmtSigned(value: number): string {
		const sign = value > 0 ? '+' : value < 0 ? '−' : '';
		return sign + fmt(Math.abs(value));
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
				<span class="tx-mono text-ctp-text">{fmt(summary.primary.subtotalProductsBRL)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-red">Impostos</span>
				<span class="tx-mono text-ctp-red">{fmt(summary.primary.subtotalTaxesBRL)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-ctp-subtext0">
					Frete
					{#if summary.alternative}
						<span class="text-ctp-overlay0">
							({summary.mode === 'single' ? 'mesmo pacote' : 'separados'})
						</span>
					{/if}
				</span>
				<span class="tx-mono text-ctp-text">{fmt(summary.primary.shippingBRL)}</span>
			</div>
			<hr class="tx-divider" />
			<div class="flex items-end justify-between pt-1">
				<span class="text-xs font-medium tracking-wider text-ctp-subtext0 uppercase">
					Total
				</span>
				<span class="tx-mono text-[1.75rem] font-bold tracking-tight text-ctp-lavender">
					{fmt(summary.primary.grandTotalBRL)}
				</span>
			</div>
		</div>

		{#if summary.alternative}
			{@const diff = summary.alternative.grandTotalBRL - summary.primary.grandTotalBRL}
			<div class="mt-4 rounded-lg border border-ctp-surface1 bg-ctp-mantle/50 p-3">
				<div class="mb-1.5 text-[0.7rem] font-medium tracking-wider text-ctp-subtext0 uppercase">
					Comparação
				</div>
				<div class="flex justify-between text-xs text-ctp-subtext1">
					<span>
						Se {summary.mode === 'single' ? 'enviados separados' : 'tudo no mesmo pacote'}
					</span>
					<span class="tx-mono text-ctp-text">
						{fmt(summary.alternative.grandTotalBRL)}
					</span>
				</div>
				<div class="mt-1 flex justify-between text-[0.7rem]">
					<span class="text-ctp-overlay1">Diferença</span>
					<span
						class="tx-mono"
						class:text-ctp-green={diff > 0}
						class:text-ctp-red={diff < 0}
						class:text-ctp-overlay1={diff === 0}
					>
						{fmtSigned(diff)}
					</span>
				</div>
			</div>
		{/if}

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
