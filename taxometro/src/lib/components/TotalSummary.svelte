<script lang="ts">
	import {
		products,
		selectedShippingMethod,
		selectedState,
		singlePackage,
		importChannel,
		paymentMethod
	} from '$lib/stores/cart';
	import { exchangeStore } from '$lib/stores/exchange';
	import { calculateSummary, resolveIcmsRate, type SummaryInput } from '$lib/calc/engine';
	import type { RateTable, ShippingTable } from '$lib/calc/types';
	import ratesData from '$lib/data/rates.json';
	import shippingData from '$lib/data/shipping.json';
	import Icon from './Icon.svelte';

	const rates = $derived<RateTable>({
		exchangeRates: {
			jpyToBrl: $exchangeStore.jpyToBrl,
			jpyToUsd: $exchangeStore.jpyToUsd
		},
		taxes: {
			...ratesData.taxes,
			icmsRate: resolveIcmsRate(
				$selectedState,
				ratesData.icmsByState,
				ratesData.taxes.icmsRate
			)
		}
	});

	function buildInput(forceSinglePackage?: boolean): SummaryInput {
		return {
			products: $products,
			channel: $importChannel,
			paymentMethod: $paymentMethod,
			singlePackage: forceSinglePackage ?? $singlePackage,
			shippingMethod: $selectedShippingMethod,
			shippingTable: shippingData as ShippingTable,
			rates
		};
	}

	const primary = $derived(calculateSummary(buildInput()));
	const alternative = $derived(
		$products.length >= 2 ? calculateSummary(buildInput(!$singlePackage)) : null
	);

	const hasImmune = $derived($products.some((p) => p.category === 'manga_books'));

	function fmt(value: number): string {
		return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	}

	function fmtSigned(value: number): string {
		const sign = value > 0 ? '+' : value < 0 ? '−' : '';
		return sign + fmt(Math.abs(value));
	}
</script>

{#if $products.length > 0}
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
				<span class="tx-mono text-ctp-text">{fmt(primary.subtotalProductsBRL)}</span>
			</div>

			<div class="flex justify-between">
				<span class="text-ctp-red">
					Impostos
					{#if hasImmune}
						<span class="text-ctp-overlay0">(livros isentos)</span>
					{/if}
				</span>
				<span class="tx-mono text-ctp-red">{fmt(primary.subtotalTaxesBRL)}</span>
			</div>

			<div class="flex justify-between">
				<span class="text-ctp-subtext0">
					Frete
					{#if alternative}
						<span class="text-ctp-overlay0">
							({$singlePackage ? 'mesmo pacote' : 'separados'})
						</span>
					{/if}
				</span>
				<span class="tx-mono text-ctp-text">{fmt(primary.shippingBRL)}</span>
			</div>

			{#if primary.despachoPostalBRL > 0}
				<div class="flex justify-between">
					<span class="text-ctp-subtext0">
						Despacho postal
						<span class="text-ctp-overlay0">
							({primary.packagesCount}× Correios)
						</span>
					</span>
					<span class="tx-mono text-ctp-text">{fmt(primary.despachoPostalBRL)}</span>
				</div>
			{/if}

			{#if primary.cardIofBRL > 0}
				<div class="flex justify-between">
					<span class="text-ctp-subtext0">
						IOF cartão
						<span class="text-ctp-overlay0">(3,5%)</span>
					</span>
					<span class="tx-mono text-ctp-text">{fmt(primary.cardIofBRL)}</span>
				</div>
			{/if}

			<hr class="tx-divider" />
			<div class="flex items-end justify-between pt-1">
				<span class="text-xs font-medium tracking-wider text-ctp-subtext0 uppercase">
					Total
				</span>
				<span class="tx-mono text-[1.75rem] font-bold tracking-tight text-ctp-lavender">
					{fmt(primary.grandTotalBRL)}
				</span>
			</div>
		</div>

		{#if alternative}
			{@const diff = alternative.grandTotalBRL - primary.grandTotalBRL}
			<div class="mt-4 rounded-lg border border-ctp-surface1 bg-ctp-mantle/50 p-3">
				<div class="mb-1.5 text-[0.7rem] font-medium tracking-wider text-ctp-subtext0 uppercase">
					Comparação
				</div>
				<div class="flex justify-between text-xs text-ctp-subtext1">
					<span>
						Se {$singlePackage ? 'enviados separados' : 'tudo no mesmo pacote'}
					</span>
					<span class="tx-mono text-ctp-text">
						{fmt(alternative.grandTotalBRL)}
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
