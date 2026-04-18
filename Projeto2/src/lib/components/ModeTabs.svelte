<script lang="ts">
	import { mode, setMode, type Mode } from '$lib/stores/mode';

	const tabs: { id: Mode; label: string; hint: string }[] = [
		{ id: 'template', label: 'Padrão mensal', hint: 'Gera turnos a partir de um horário fixo' },
		{ id: 'daily', label: 'Dia a dia', hint: 'Adiciona turno por turno' }
	];
</script>

<div class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-1 shadow-sm">
	<div class="grid grid-cols-2 gap-1">
		{#each tabs as tab}
			<button
				type="button"
				onclick={() => setMode(tab.id)}
				title={tab.hint}
				class="rounded-md px-3 py-2 text-sm font-medium transition-colors {$mode === tab.id
					? 'bg-ctp-blue text-ctp-base'
					: 'text-ctp-subtext1 hover:bg-ctp-surface0'}"
			>
				{tab.label}
			</button>
		{/each}
	</div>
</div>
