<script lang="ts">
	import { addProduct } from '$lib/stores/cart';
	import categoriesData from '$lib/data/categories.json';
	import type { ProductCategory } from '$lib/calc/types';

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

	const isValid = $derived(name.trim() !== '' && priceJPYValue > 0 && weightGrams !== '' && Number(weightGrams) > 0);

	const inputClass = 'w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-2 text-sm text-ctp-text placeholder-ctp-overlay0 focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender focus:outline-none';
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-4 shadow-sm">
	<h2 class="mb-3 text-lg font-semibold text-ctp-text">Adicionar Produto</h2>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		<div class="sm:col-span-2 lg:col-span-1">
			<label for="product-name" class="mb-1 block text-sm font-medium text-ctp-subtext1">Nome do Produto</label>
			<input
				id="product-name"
				type="text"
				bind:value={name}
				placeholder="Ex: Nintendo Switch"
				class={inputClass}
			/>
		</div>

		<div>
			<label for="product-category" class="mb-1 block text-sm font-medium text-ctp-subtext1">Categoria</label>
			<select
				id="product-category"
				bind:value={category}
				class="w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-2 text-sm text-ctp-text focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender focus:outline-none"
			>
				{#each categoriesData as cat}
					<option value={cat.id}>{cat.label}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="product-price" class="mb-1 block text-sm font-medium text-ctp-subtext1">Preço (JPY)</label>
			<input
				id="product-price"
				type="text"
				inputmode="numeric"
				bind:value={priceJPY}
				placeholder="Ex: 39.980"
				class={inputClass}
			/>
		</div>

		<div>
			<label for="product-quantity" class="mb-1 block text-sm font-medium text-ctp-subtext1">Quantidade</label>
			<input
				id="product-quantity"
				type="number"
				bind:value={quantity}
				min="1"
				max="99"
				class={inputClass}
			/>
		</div>

		<div>
			<label for="product-weight" class="mb-1 block text-sm font-medium text-ctp-subtext1">Peso (gramas)</label>
			<input
				id="product-weight"
				type="number"
				bind:value={weightGrams}
				placeholder="Ex: 500"
				min="1"
				class={inputClass}
			/>
		</div>
	</div>

	<button
		type="submit"
		disabled={!isValid}
		class="mt-4 w-full rounded-md bg-ctp-blue px-4 py-2 text-sm font-medium text-ctp-base transition-colors hover:bg-ctp-sapphire disabled:cursor-not-allowed disabled:bg-ctp-surface1 disabled:text-ctp-overlay0 sm:w-auto"
	>
		Adicionar ao Carrinho
	</button>
</form>
