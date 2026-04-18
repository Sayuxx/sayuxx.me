<script lang="ts">
	import { products, selectedShippingMethod, singlePackage } from '$lib/stores/cart';
	import { exchangeStore } from '$lib/stores/exchange';
	import { calculateShipping, calculateTotalWeight } from '$lib/calc/engine';
	import type { ShippingMethod, ShippingTable } from '$lib/calc/types';
	import shippingData from '$lib/data/shipping.json';
	import Icon, { type IconName } from './Icon.svelte';

	const methods: { id: ShippingMethod; label: string; time: string; icon: IconName }[] = [
		{ id: 'ems', label: 'EMS (Expresso)', time: '~7–10 dias', icon: 'bolt' },
		{ id: 'airmail', label: 'Airmail Parcel (Aéreo)', time: '~2–3 semanas', icon: 'paper-plane' }
	];

	const totalWeight = $derived(calculateTotalWeight($products));

	function fmt(value: number): string {
		return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	}

	function fmtJpy(value: number): string {
		return '¥' + value.toLocaleString('ja-JP');
	}
</script>

{#if $products.length > 0}
	<section class="tx-card p-5">
		<div class="mb-4 flex items-center gap-3">
			<span class="tx-icon-badge" aria-hidden="true">
				<Icon name="shipping-truck" size={16} />
			</span>
			<h2 class="text-base font-semibold text-ctp-text">Frete</h2>
			<span class="tx-chip ml-auto tx-num">
				{totalWeight}g · {(totalWeight / 1000).toFixed(2)}kg
			</span>
		</div>

		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each methods as method}
				{@const result = calculateShipping(
					totalWeight,
					method.id,
					shippingData as ShippingTable,
					$exchangeStore.jpyToBrl
				)}
				<label
					class="tx-method-card"
					class:is-selected={$selectedShippingMethod === method.id}
				>
					<input
						type="radio"
						name="shipping-method"
						value={method.id}
						bind:group={$selectedShippingMethod}
						class="sr-only"
					/>
					<span
						class="tx-icon-badge"
						class:tx-chip-accent={$selectedShippingMethod === method.id}
						aria-hidden="true"
					>
						<Icon name={method.icon} size={16} />
					</span>
					<div class="min-w-0 flex-1">
						<div class="text-sm font-semibold text-ctp-text">{method.label}</div>
						<div class="text-xs text-ctp-subtext0">{method.time}</div>
					</div>
					<div class="text-right">
						{#if result.costJPY > 0}
							<div class="tx-num text-sm font-semibold text-ctp-text">
								{fmt(result.costBRL)}
							</div>
							<div class="tx-num text-xs text-ctp-subtext0">{fmtJpy(result.costJPY)}</div>
						{:else}
							<div class="text-xs text-ctp-overlay0">Indisponível</div>
						{/if}
					</div>
				</label>
			{/each}
		</div>

		{#if $products.length > 1}
			<label class="mt-4 flex items-center gap-2 text-sm text-ctp-subtext1">
				<input
					type="checkbox"
					id="single-package"
					bind:checked={$singlePackage}
					class="accent-ctp-lavender"
				/>
				Enviar tudo no mesmo pacote
			</label>
		{/if}
	</section>
{/if}
