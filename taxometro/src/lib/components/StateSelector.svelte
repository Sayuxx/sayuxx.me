<script lang="ts">
	import { selectedState } from '$lib/stores/cart';
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

<div class="flex items-center gap-2">
	<label for="state-select" class="text-sm font-medium text-ctp-subtext1">Estado:</label>
	<select
		id="state-select"
		bind:value={$selectedState}
		class="rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-1.5 text-sm text-ctp-text shadow-sm focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender focus:outline-none"
	>
		{#each states as uf}
			<option value={uf}>
				{uf} - {stateNames[uf]}
			</option>
		{/each}
	</select>
</div>
