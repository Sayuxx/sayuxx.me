<script lang="ts">
	import { addProduct } from '$lib/stores/cart';
	import categoriesData from '$lib/data/categories.json';
	import type { ProductCategory } from '$lib/calc/types';
	import Icon from './Icon.svelte';

	let name = $state('');
	let category = $state<ProductCategory>('electronics');
	let priceJPY = $state('');
	let quantity = $state(1);
	let weightGrams = $state<number | ''>('');

	const priceJPYValue = $derived(Number(priceJPY.replace(/\D/g, '')) || 0);

	function handleSubmit() {
		if (!name.trim() || priceJPYValue <= 0 || !weightGrams) return;

		addProduct({
			name: name.trim(),
			category,
			priceJPY: priceJPYValue,
			quantity,
			weightGrams: Number(weightGrams)
		});

		name = '';
		priceJPY = '';
		quantity = 1;
		weightGrams = '';
	}

	const isValid = $derived(
		name.trim() !== '' && priceJPYValue > 0 && weightGrams !== '' && Number(weightGrams) > 0
	);
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
	class="tx-card p-5"
>
	<div class="mb-4 flex items-center gap-3">
		<span class="tx-icon-badge" aria-hidden="true">
			<Icon name="plus" size={16} />
		</span>
		<h2 class="text-base font-semibold text-ctp-text">Adicionar produto</h2>
	</div>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
		<div class="lg:col-span-3">
			<label for="product-name" class="tx-label">Nome do produto</label>
			<input
				id="product-name"
				type="text"
				bind:value={name}
				placeholder="Ex: Nintendo Switch"
				class="tx-input"
			/>
		</div>

		<div class="lg:col-span-3">
			<label for="product-category" class="tx-label">Categoria</label>
			<div class="tx-select-wrap">
				<select id="product-category" bind:value={category} class="tx-input">
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
			<label for="product-price" class="tx-label">Preço (JPY)</label>
			<input
				id="product-price"
				type="text"
				inputmode="numeric"
				bind:value={priceJPY}
				placeholder="Ex: 39980"
				class="tx-input tx-num"
			/>
		</div>

		<div class="lg:col-span-2">
			<label for="product-quantity" class="tx-label">Quantidade</label>
			<input
				id="product-quantity"
				type="number"
				bind:value={quantity}
				min="1"
				max="99"
				class="tx-input tx-num"
			/>
		</div>

		<div class="lg:col-span-2">
			<label for="product-weight" class="tx-label">Peso (g)</label>
			<input
				id="product-weight"
				type="number"
				bind:value={weightGrams}
				placeholder="Ex: 500"
				min="1"
				class="tx-input tx-num"
			/>
		</div>
	</div>

	<div class="mt-5 flex justify-end">
		<button type="submit" disabled={!isValid} class="tx-btn tx-btn-primary w-full sm:w-auto">
			<Icon name="plus" size={16} />
			<span>Adicionar ao carrinho</span>
		</button>
	</div>
</form>
