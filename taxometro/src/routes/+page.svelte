<script lang="ts">
	import ExchangeRateBar from '$lib/components/ExchangeRateBar.svelte';
	import StateSelector from '$lib/components/StateSelector.svelte';
	import ProductForm from '$lib/components/ProductForm.svelte';
	import ProductList from '$lib/components/ProductList.svelte';
	import ShippingEstimate from '$lib/components/ShippingEstimate.svelte';
	import TotalSummary from '$lib/components/TotalSummary.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { products, clearCart } from '$lib/stores/cart';
</script>

<svelte:head>
	<title>Taxômetro - Calculadora de Impostos para Importações do Japão</title>
	<meta name="description" content="Calcule o custo total de importar produtos do Japão para o Brasil, incluindo impostos e frete." />
</svelte:head>

<div class="mx-auto min-h-screen max-w-4xl bg-ctp-base px-4 py-6">
	<header class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-ctp-text">
				Taxômetro
			</h1>
			<p class="mt-1 text-ctp-subtext0">
				Calculadora de impostos para importações do Japão
			</p>
		</div>
		<ThemeToggle />
	</header>

	<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<ExchangeRateBar />
	</div>

	<div class="mb-4">
		<StateSelector />
	</div>

	<div class="space-y-4">
		<ProductForm />

		{#if $products.length > 0}
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-ctp-text">
					Produtos ({$products.length})
				</h2>
				<button
					onclick={() => clearCart()}
					class="rounded px-3 py-1 text-sm text-ctp-red hover:bg-ctp-surface0"
				>
					Limpar tudo
				</button>
			</div>
		{/if}

		<ProductList />
		<ShippingEstimate />
		<TotalSummary />
	</div>

	<footer class="mt-8 border-t border-ctp-surface1 pt-4 text-center text-xs text-ctp-overlay0">
		<p>Os valores apresentados são estimativas. Consulte a Receita Federal para valores oficiais.</p>
		<p class="mt-1">Taxômetro &copy; {new Date().getFullYear()}</p>
	</footer>
</div>
