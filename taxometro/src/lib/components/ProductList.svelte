<script lang="ts">
	import { products, removeProduct, updateProduct } from '$lib/stores/cart';
	import { exchangeStore } from '$lib/stores/exchange';
	import { calculateTaxes } from '$lib/calc/engine';
	import type { Product, ProductCategory, RateTable } from '$lib/calc/types';
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

	let editingId = $state<string | null>(null);
	let editName = $state('');
	let editCategory = $state<ProductCategory>('electronics');
	let editPrice = $state('');
	let editQuantity = $state(1);
	let editWeight = $state<number | ''>('');

	const editPriceValue = $derived(Number(editPrice.replace(/\D/g, '')) || 0);
	const editValid = $derived(
		editName.trim() !== '' && editPriceValue > 0 && editWeight !== '' && Number(editWeight) > 0
	);

	function startEdit(p: Product) {
		editingId = p.id;
		editName = p.name;
		editCategory = p.category;
		editPrice = String(p.priceJPY);
		editQuantity = p.quantity;
		editWeight = p.weightGrams;
	}

	function cancelEdit() {
		editingId = null;
	}

	function saveEdit() {
		if (!editingId || !editValid) return;
		updateProduct(editingId, {
			name: editName.trim(),
			category: editCategory,
			priceJPY: editPriceValue,
			quantity: editQuantity,
			weightGrams: Number(editWeight)
		});
		editingId = null;
	}

	const inputClass =
		'w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-2 text-sm text-ctp-text placeholder-ctp-overlay0 focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender focus:outline-none';
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
				{#if editingId === product.id}
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<div class="sm:col-span-2 lg:col-span-1">
							<label for="edit-name-{product.id}" class="mb-1 block text-sm font-medium text-ctp-subtext1">Nome</label>
							<input id="edit-name-{product.id}" type="text" bind:value={editName} class={inputClass} />
						</div>
						<div>
							<label for="edit-category-{product.id}" class="mb-1 block text-sm font-medium text-ctp-subtext1">Categoria</label>
							<select id="edit-category-{product.id}" bind:value={editCategory} class={inputClass}>
								{#each categoriesData as cat}
									<option value={cat.id}>{cat.label}</option>
								{/each}
							</select>
						</div>
						<div>
							<label for="edit-price-{product.id}" class="mb-1 block text-sm font-medium text-ctp-subtext1">Preço (JPY)</label>
							<input
								id="edit-price-{product.id}"
								type="text"
								inputmode="numeric"
								bind:value={editPrice}
								class={inputClass}
							/>
						</div>
						<div>
							<label for="edit-quantity-{product.id}" class="mb-1 block text-sm font-medium text-ctp-subtext1">Quantidade</label>
							<input
								id="edit-quantity-{product.id}"
								type="number"
								bind:value={editQuantity}
								min="1"
								max="99"
								class={inputClass}
							/>
						</div>
						<div>
							<label for="edit-weight-{product.id}" class="mb-1 block text-sm font-medium text-ctp-subtext1">Peso (g)</label>
							<input
								id="edit-weight-{product.id}"
								type="number"
								bind:value={editWeight}
								min="1"
								class={inputClass}
							/>
						</div>
					</div>
					<div class="mt-3 flex gap-2">
						<button
							onclick={saveEdit}
							disabled={!editValid}
							class="rounded-md bg-ctp-blue px-4 py-1.5 text-sm font-medium text-ctp-base transition-colors hover:bg-ctp-sapphire disabled:cursor-not-allowed disabled:bg-ctp-surface1 disabled:text-ctp-overlay0"
						>
							Salvar
						</button>
						<button
							onclick={cancelEdit}
							class="rounded-md bg-ctp-surface0 px-4 py-1.5 text-sm text-ctp-text transition-colors hover:bg-ctp-surface1"
						>
							Cancelar
						</button>
					</div>
				{:else}
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
						<div class="flex shrink-0 gap-1">
							<button
								onclick={() => startEdit(product)}
								class="rounded p-1 text-ctp-overlay0 hover:bg-ctp-surface0 hover:text-ctp-lavender"
								title="Editar produto"
								aria-label="Editar {product.name}"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
							</button>
							<button
								onclick={() => removeProduct(product.id)}
								class="rounded p-1 text-ctp-overlay0 hover:bg-ctp-surface0 hover:text-ctp-red"
								title="Remover produto"
								aria-label="Remover {product.name}"
							>
								&#x2715;
							</button>
						</div>
					</div>
					<div class="mt-2">
						<TaxBreakdown {breakdown} />
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}
