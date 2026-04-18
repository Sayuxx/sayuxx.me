<script lang="ts">
	import ExchangeRateBar from '$lib/components/ExchangeRateBar.svelte';
	import ImportOptions from '$lib/components/ImportOptions.svelte';
	import ProductForm from '$lib/components/ProductForm.svelte';
	import ProductList from '$lib/components/ProductList.svelte';
	import ShippingEstimate from '$lib/components/ShippingEstimate.svelte';
	import StateSelector from '$lib/components/StateSelector.svelte';
	import TotalSummary from '$lib/components/TotalSummary.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { products, clearCart } from '$lib/stores/cart';
	import ratesData from '$lib/data/rates.json';

	const lastVerified = $derived(new Date(ratesData.lastVerified));
	const daysSinceVerified = $derived(
		Math.floor((Date.now() - lastVerified.getTime()) / 86_400_000)
	);
	const verifiedLabel = $derived(
		lastVerified.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
	);
	const isStale = $derived(daysSinceVerified > 30);
</script>

<svelte:head>
	<title>Taxômetro — Calculadora de Impostos para Importações do Japão</title>
	<meta
		name="description"
		content="Calcule o custo total de importar produtos do Japão para o Brasil, incluindo impostos e frete."
	/>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
	<header class="mb-8 flex items-start justify-between gap-4">
		<div class="flex items-center gap-3">
			<span class="tx-icon-badge tx-icon-badge-lg text-ctp-lavender" aria-hidden="true">
				<Icon name="brand-mark" size={22} />
			</span>
			<div>
				<h1
					class="text-2xl font-bold leading-tight tracking-tight text-ctp-text sm:text-3xl"
					style="letter-spacing: -0.02em;"
				>
					Taxômetro
				</h1>
				<p class="mt-0.5 text-sm text-ctp-subtext0">
					Calculadora de impostos para importações do Japão
				</p>
			</div>
		</div>
		<ThemeToggle />
	</header>

	<div class="mb-4">
		<ExchangeRateBar />
	</div>

	<div class="space-y-4">
		<StateSelector />
		<ImportOptions />
		<ProductForm />

		{#if $products.length > 0}
			<div class="flex items-center justify-between pt-1">
				<h2 class="text-base font-semibold text-ctp-text">
					Produtos ({$products.length})
				</h2>
				<button
					onclick={() => clearCart()}
					class="tx-btn tx-btn-danger-ghost !min-h-0 !py-1.5 !text-xs"
				>
					<Icon name="trash" size={14} />
					<span>Limpar tudo</span>
				</button>
			</div>
		{/if}

		<ProductList />
		<ShippingEstimate />
		<TotalSummary />
	</div>

	<footer
		class="mt-12 flex flex-col items-center gap-1 border-t pt-6 text-center text-xs text-ctp-overlay0"
		style="border-color: color-mix(in oklch, var(--ctp-surface1) 50%, transparent);"
	>
		<p>
			Os valores apresentados são estimativas. Consulte a Receita Federal para valores oficiais.
		</p>
		<p>
			Alíquotas verificadas em
			<span class:text-ctp-yellow={isStale} class:tx-num={true}>{verifiedLabel}</span>
			<span class="text-ctp-overlay1">({daysSinceVerified}d)</span>
			· Câmbio ao vivo via BCB
		</p>
		<p>Taxômetro &copy; {new Date().getFullYear()}</p>
	</footer>
</div>
