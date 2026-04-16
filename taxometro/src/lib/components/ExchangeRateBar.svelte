<script lang="ts">
	import { exchangeStore, refreshExchangeRates } from '$lib/stores/exchange';
	import { onMount } from 'svelte';

	onMount(() => {
		refreshExchangeRates();
	});

	const sourceLabel: Record<string, string> = {
		bundled: 'valor padrão',
		cached: 'cache',
		live: 'BCB ao vivo'
	};
</script>

<div class="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-ctp-mantle px-4 py-2 text-sm">
	<div class="flex items-center gap-3">
		<span class="font-medium text-ctp-blue">
			1 JPY = R$ {$exchangeStore.jpyToBrl.toFixed(4)}
		</span>
		<span class="text-ctp-sapphire">
			1 USD = R$ {$exchangeStore.usdToBrl.toFixed(2)}
		</span>
	</div>
	<div class="flex items-center gap-2 text-ctp-subtext0">
		{#if $exchangeStore.loading}
			<span>Atualizando...</span>
		{:else}
			<span>
				Atualizado: {$exchangeStore.date} ({sourceLabel[$exchangeStore.source]})
			</span>
			<button
				onclick={() => refreshExchangeRates()}
				class="rounded px-2 py-0.5 text-xs hover:bg-ctp-surface0"
				title="Atualizar câmbio"
			>
				&#x21bb;
			</button>
		{/if}
	</div>
	{#if $exchangeStore.error}
		<p class="w-full text-xs text-ctp-yellow">{$exchangeStore.error}</p>
	{/if}
</div>
