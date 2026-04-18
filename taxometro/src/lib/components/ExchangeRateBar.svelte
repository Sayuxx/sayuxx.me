<script lang="ts">
	import { exchangeStore, refreshExchangeRates } from '$lib/stores/exchange';
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';

	onMount(() => {
		refreshExchangeRates();
	});

	const sourceLabel: Record<string, string> = {
		bundled: 'valor padrão',
		cached: 'cache',
		live: 'BCB ao vivo'
	};

	const brlToJpy = $derived(
		$exchangeStore.jpyToBrl > 0 ? 1 / $exchangeStore.jpyToBrl : 0
	);
	const usdToJpy = $derived(
		$exchangeStore.jpyToUsd > 0 ? 1 / $exchangeStore.jpyToUsd : 0
	);
</script>

<div class="flex justify-start">
	<div
		class="tx-card inline-flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 text-sm"
	>
		<span class="inline-flex items-center gap-1.5 text-ctp-subtext0">
			<span>1 USD =</span>
			<span class="tx-hl tx-hl-green">R$ {$exchangeStore.usdToBrl.toFixed(2)}</span>
		</span>
		<span class="inline-flex items-center gap-1.5 text-ctp-subtext0">
			<span>1 BRL =</span>
			<span class="tx-hl tx-hl-peach">¥ {brlToJpy.toFixed(2)}</span>
		</span>
		<span class="inline-flex items-center gap-1.5 text-ctp-subtext0">
			<span>1 USD =</span>
			<span class="tx-hl tx-hl-red">¥ {usdToJpy.toFixed(2)}</span>
		</span>

		<span
			class="h-4 w-px shrink-0"
			style="background-color: color-mix(in oklch, var(--ctp-surface1) 60%, transparent);"
			aria-hidden="true"
		></span>

		<div class="flex items-center gap-2 text-xs text-ctp-subtext0">
			{#if $exchangeStore.loading}
				<span>Atualizando…</span>
			{:else}
				<span class="tx-num">
					{$exchangeStore.date} · {sourceLabel[$exchangeStore.source]}
				</span>
				<button
					onclick={() => refreshExchangeRates()}
					class="tx-icon-btn !h-7 !w-7"
					title="Atualizar câmbio"
					aria-label="Atualizar câmbio"
				>
					<Icon name="refresh" size={14} />
				</button>
			{/if}
		</div>

		{#if $exchangeStore.error}
			<p class="w-full text-center text-xs text-ctp-yellow">{$exchangeStore.error}</p>
		{/if}
	</div>
</div>
