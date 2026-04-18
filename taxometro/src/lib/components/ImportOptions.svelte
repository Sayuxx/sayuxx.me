<script lang="ts">
	import { importChannel, paymentMethod } from '$lib/stores/cart';
	import type { ImportChannel, PaymentMethod } from '$lib/calc/types';
	import Icon from './Icon.svelte';

	const channels: { id: ImportChannel; label: string; hint: string }[] = [
		{
			id: 'postal_common',
			label: 'Postal comum',
			hint: 'Japan Post via Correios — II 60% + despacho R$ 15'
		},
		{
			id: 'remessa_conforme',
			label: 'Remessa Conforme',
			hint: 'Plataforma certificada — II 20% até US$ 50'
		}
	];

	const payments: { id: PaymentMethod; label: string; hint: string }[] = [
		{ id: 'other', label: 'Sem IOF cartão', hint: 'PayPal, cartão estrangeiro, cripto' },
		{ id: 'br_card', label: 'Cartão brasileiro', hint: 'Adiciona IOF 3,5% sobre produto + frete' }
	];
</script>

<section class="tx-card p-5">
	<div class="mb-4 flex items-center gap-3">
		<span class="tx-icon-badge" aria-hidden="true">
			<Icon name="info" size={16} />
		</span>
		<h2 class="text-base font-semibold text-ctp-text">Opções de importação</h2>
	</div>

	<div class="space-y-4">
		<div>
			<p class="mb-2 text-xs font-medium tracking-wider text-ctp-subtext0 uppercase">
				Canal de importação
			</p>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{#each channels as channel}
					<label
						class="tx-method-card"
						class:is-selected={$importChannel === channel.id}
					>
						<input
							type="radio"
							name="import-channel"
							value={channel.id}
							bind:group={$importChannel}
							class="sr-only"
						/>
						<div class="min-w-0 flex-1">
							<div class="text-sm font-semibold text-ctp-text">{channel.label}</div>
							<div class="text-xs text-ctp-subtext0">{channel.hint}</div>
						</div>
					</label>
				{/each}
			</div>
		</div>

		<div>
			<p class="mb-2 text-xs font-medium tracking-wider text-ctp-subtext0 uppercase">
				Forma de pagamento
			</p>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{#each payments as payment}
					<label
						class="tx-method-card"
						class:is-selected={$paymentMethod === payment.id}
					>
						<input
							type="radio"
							name="payment-method"
							value={payment.id}
							bind:group={$paymentMethod}
							class="sr-only"
						/>
						<div class="min-w-0 flex-1">
							<div class="text-sm font-semibold text-ctp-text">{payment.label}</div>
							<div class="text-xs text-ctp-subtext0">{payment.hint}</div>
						</div>
					</label>
				{/each}
			</div>
		</div>
	</div>
</section>
