<script lang="ts">
	import { products, selectedShippingMethod, singlePackage } from '$lib/stores/cart';
	import { exchangeStore } from '$lib/stores/exchange';
	import { calculateShipping, calculateTotalWeight } from '$lib/calc/engine';
	import type { ShippingMethod, ShippingTable } from '$lib/calc/types';
	import shippingData from '$lib/data/shipping.json';

	const methods: { id: ShippingMethod; label: string; time: string }[] = [
		{ id: 'ems', label: 'EMS (Expresso)', time: '~7-10 dias' },
		{ id: 'sal', label: 'SAL (Econômico Aéreo)', time: '~2-4 semanas' },
		{ id: 'surface', label: 'Surface (Marítimo)', time: '~2-3 meses' },
		{ id: 'airmail', label: 'Airmail (Aéreo)', time: '~1-2 semanas, até 2kg' }
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
	<div class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-4 shadow-sm">
		<h2 class="mb-3 text-lg font-semibold text-ctp-text">Frete</h2>

		<div class="mb-3 text-sm text-ctp-subtext0">
			Peso total: <span class="font-medium">{totalWeight}g</span> ({(totalWeight / 1000).toFixed(2)}kg)
		</div>

		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each methods as method}
				{@const result = calculateShipping(totalWeight, method.id, shippingData as ShippingTable, $exchangeStore.jpyToBrl)}
				<label
					class="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors
						{$selectedShippingMethod === method.id
							? 'border-ctp-lavender bg-ctp-surface0'
							: 'border-ctp-surface1 hover:border-ctp-surface2'}"
				>
					<input
						type="radio"
						name="shipping-method"
						value={method.id}
						bind:group={$selectedShippingMethod}
						class="accent-ctp-lavender"
					/>
					<div class="flex-1">
						<div class="text-sm font-medium text-ctp-text">{method.label}</div>
						<div class="text-xs text-ctp-overlay1">{method.time}</div>
					</div>
					<div class="text-right">
						{#if result.costJPY > 0}
							<div class="text-sm font-semibold text-ctp-text">{fmt(result.costBRL)}</div>
							<div class="text-xs text-ctp-overlay1">{fmtJpy(result.costJPY)}</div>
						{:else}
							<div class="text-xs text-ctp-overlay0">Indisponível</div>
						{/if}
					</div>
				</label>
			{/each}
		</div>

		{#if $products.length > 1}
			<div class="mt-3 flex items-center gap-2">
				<input
					type="checkbox"
					id="single-package"
					bind:checked={$singlePackage}
					class="rounded accent-ctp-lavender"
				/>
				<label for="single-package" class="text-sm text-ctp-subtext1">
					Enviar tudo no mesmo pacote
				</label>
			</div>
		{/if}
	</div>
{/if}
