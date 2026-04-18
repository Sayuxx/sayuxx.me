<script lang="ts">
	import { products, removeProduct, updateProduct, selectedState } from '$lib/stores/cart';
	import { exchangeStore } from '$lib/stores/exchange';
	import { calculateTaxes, resolveIcmsRate } from '$lib/calc/engine';
	import type { Product, ProductCategory, RateTable } from '$lib/calc/types';
	import ratesData from '$lib/data/rates.json';
	import categoriesData from '$lib/data/categories.json';
	import TaxBreakdown from './TaxBreakdown.svelte';
	import Icon from './Icon.svelte';

	const categoryLabels: Record<string, string> = {};
	for (const cat of categoriesData) {
		categoryLabels[cat.id] = cat.label;
	}

	function getRateTable(exchange: typeof $exchangeStore, state: string): RateTable {
		return {
			exchangeRates: {
				jpyToBrl: exchange.jpyToBrl,
				jpyToUsd: exchange.jpyToUsd
			},
			taxes: {
				...ratesData.taxes,
				icmsRate: resolveIcmsRate(state, ratesData.icmsByState, ratesData.taxes.icmsRate)
			}
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
</script>

{#if $products.length === 0}
	<div class="tx-empty flex flex-col items-center gap-3">
		<span class="tx-icon-badge tx-icon-badge-lg" aria-hidden="true">
			<Icon name="cart-empty" size={22} />
		</span>
		<div>
			<p class="font-medium text-ctp-subtext1">Nenhum produto adicionado.</p>
			<p class="mt-1 text-sm">Adicione produtos acima para calcular os impostos.</p>
		</div>
	</div>
{:else}
	<div class="space-y-3">
		{#each $products as product (product.id)}
			{@const rates = getRateTable($exchangeStore, $selectedState)}
			{@const breakdown = calculateTaxes(product, rates)}
			<article class="tx-card p-4 tx-anim-in">
				{#if editingId === product.id}
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
						<div class="lg:col-span-3">
							<label for="edit-name-{product.id}" class="tx-label">Nome</label>
							<input
								id="edit-name-{product.id}"
								type="text"
								bind:value={editName}
								class="tx-input"
							/>
						</div>
						<div class="lg:col-span-3">
							<label for="edit-category-{product.id}" class="tx-label">Categoria</label>
							<div class="tx-select-wrap">
								<select
									id="edit-category-{product.id}"
									bind:value={editCategory}
									class="tx-input"
								>
									{#each categoriesData as cat}
										<option value={cat.id}>{cat.label}</option>
									{/each}
								</select>
								<span class="tx-select-chevron">
									<Icon name="chevron-down" size={16} />
								</span>
							</div>
						</div>
						<div class="lg:col-span-2">
							<label for="edit-price-{product.id}" class="tx-label">Preço (JPY)</label>
							<input
								id="edit-price-{product.id}"
								type="text"
								inputmode="numeric"
								bind:value={editPrice}
								class="tx-input tx-num"
							/>
						</div>
						<div class="lg:col-span-2">
							<label for="edit-quantity-{product.id}" class="tx-label">Quantidade</label>
							<input
								id="edit-quantity-{product.id}"
								type="number"
								bind:value={editQuantity}
								min="1"
								max="99"
								class="tx-input tx-num"
							/>
						</div>
						<div class="lg:col-span-2">
							<label for="edit-weight-{product.id}" class="tx-label">Peso (g)</label>
							<input
								id="edit-weight-{product.id}"
								type="number"
								bind:value={editWeight}
								min="1"
								class="tx-input tx-num"
							/>
						</div>
					</div>
					<div class="mt-4 flex flex-wrap gap-2">
						<button
							onclick={saveEdit}
							disabled={!editValid}
							class="tx-btn tx-btn-primary"
						>
							Salvar
						</button>
						<button onclick={cancelEdit} class="tx-btn tx-btn-ghost">
							Cancelar
						</button>
					</div>
				{:else}
					<div class="flex items-start justify-between gap-4">
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<h3 class="truncate text-[0.9375rem] font-semibold text-ctp-text">
									{product.name}
								</h3>
								<span class="tx-chip">
									{categoryLabels[product.category] ?? product.category}
								</span>
							</div>
							<div class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ctp-subtext0">
								<span class="tx-num">{fmtJpy(product.priceJPY)} × {product.quantity}</span>
								<span class="tx-num">{product.weightGrams}g</span>
								<span class="tx-num font-medium text-ctp-subtext1">
									{fmt(breakdown.productPriceBRL)}
								</span>
							</div>
						</div>
						<div class="text-right">
							<p class="tx-num text-lg font-bold text-ctp-text">
								{fmt(breakdown.totalWithTaxes)}
							</p>
							<p class="tx-num text-xs text-ctp-red">
								+{fmt(breakdown.totalTaxes)} impostos
							</p>
						</div>
						<div class="flex shrink-0 items-center gap-1">
							<button
								onclick={() => startEdit(product)}
								class="tx-icon-btn"
								title="Editar produto"
								aria-label="Editar {product.name}"
							>
								<Icon name="edit-pencil" size={16} />
							</button>
							<button
								onclick={() => removeProduct(product.id)}
								class="tx-icon-btn is-danger"
								title="Remover produto"
								aria-label="Remover {product.name}"
							>
								<Icon name="trash" size={16} />
							</button>
						</div>
					</div>
					<div class="mt-3">
						<TaxBreakdown {breakdown} icmsRate={rates.taxes.icmsRate} />
					</div>
				{/if}
			</article>
		{/each}
	</div>
{/if}
