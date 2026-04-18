<script lang="ts">
	import { selectedState } from '$lib/stores/cart';
	import Icon from './Icon.svelte';

	const states = [
		'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
		'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
		'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
	];

	const stateNames: Record<string, string> = {
		AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas',
		BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
		GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
		MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná',
		PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
		RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
		SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins'
	};
</script>

<div class="tx-card flex items-center gap-3 px-4 py-3">
	<span class="tx-icon-badge" aria-hidden="true">
		<Icon name="pin-location" size={16} />
	</span>
	<label for="state-select" class="text-sm font-medium text-ctp-subtext1">
		Estado de destino
	</label>
	<div class="tx-select-wrap flex-1 sm:flex-none sm:min-w-[14rem]">
		<select
			id="state-select"
			bind:value={$selectedState}
			class="tx-input"
		>
			{#each states as uf}
				<option value={uf}>
					{uf} — {stateNames[uf]}
				</option>
			{/each}
		</select>
		<span class="tx-select-chevron">
			<Icon name="chevron-down" size={16} />
		</span>
	</div>
</div>
