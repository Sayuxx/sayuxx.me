<script lang="ts">
	import { addShift } from '$lib/stores/shifts';
	import type { DayType, TimeRange } from '$lib/calc/types';
	import BreakInput from './BreakInput.svelte';

	function todayISO(): string {
		const d = new Date();
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}

	let date = $state(todayISO());
	let start = $state('09:00');
	let end = $state('18:00');
	let dayType = $state<DayType>('regular');
	let breaks = $state<TimeRange[]>([{ start: '12:00', end: '13:00' }]);

	const isValid = $derived(date !== '' && start !== '' && end !== '');

	function handleSubmit() {
		if (!isValid) return;
		const validBreaks = breaks.filter((b) => b.start !== '' && b.end !== '');
		addShift({
			date,
			range: { start, end },
			breaks: validBreaks,
			dayType
		});
		breaks = [{ start: '12:00', end: '13:00' }];
		dayType = 'regular';
	}

	function addBreak() {
		breaks = [...breaks, { start: '', end: '' }];
	}

	function updateBreak(i: number, next: TimeRange) {
		breaks = breaks.map((b, idx) => (idx === i ? next : b));
	}

	function removeBreak(i: number) {
		breaks = breaks.filter((_, idx) => idx !== i);
	}

	const inputClass = 'w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-2 text-sm text-ctp-text placeholder-ctp-overlay0 focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender focus:outline-none';
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-4 shadow-sm">
	<h2 class="mb-3 text-lg font-semibold text-ctp-text">Adicionar turno</h2>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
		<div>
			<label for="shift-date" class="mb-1 block text-sm font-medium text-ctp-subtext1">Data</label>
			<input id="shift-date" type="date" bind:value={date} class={inputClass} />
		</div>
		<div>
			<label for="shift-start" class="mb-1 block text-sm font-medium text-ctp-subtext1">Início</label>
			<input id="shift-start" type="time" bind:value={start} class={inputClass} />
		</div>
		<div>
			<label for="shift-end" class="mb-1 block text-sm font-medium text-ctp-subtext1">Fim</label>
			<input id="shift-end" type="time" bind:value={end} class={inputClass} />
		</div>
	</div>

	<div class="mt-3">
		<label for="shift-daytype" class="mb-1 block text-sm font-medium text-ctp-subtext1">Tipo do dia</label>
		<select id="shift-daytype" bind:value={dayType} class={inputClass}>
			<option value="regular">Normal</option>
			<option value="saturdayBonus">Sábado (+25% o dia inteiro)</option>
			<option value="legalHoliday">法定休日 (feriado legal, +35%)</option>
		</select>
	</div>

	<div class="mt-4">
		<div class="mb-2 flex items-center justify-between">
			<span class="text-sm font-medium text-ctp-subtext1">Descansos</span>
			<button
				type="button"
				onclick={addBreak}
				class="rounded px-2 py-1 text-xs text-ctp-blue hover:bg-ctp-surface0"
			>
				+ adicionar
			</button>
		</div>
		<div class="space-y-2">
			{#each breaks as br, i (i)}
				<BreakInput
					value={br}
					onchange={(next) => updateBreak(i, next)}
					onremove={() => removeBreak(i)}
				/>
			{/each}
			{#if breaks.length === 0}
				<p class="text-xs text-ctp-overlay0">Nenhum descanso — clique em "+ adicionar" para incluir.</p>
			{/if}
		</div>
	</div>

	<button
		type="submit"
		disabled={!isValid}
		class="mt-4 w-full rounded-md bg-ctp-blue px-4 py-2 text-sm font-medium text-ctp-base transition-colors hover:bg-ctp-sapphire disabled:cursor-not-allowed disabled:bg-ctp-surface1 disabled:text-ctp-overlay0 sm:w-auto"
	>
		Adicionar turno
	</button>
</form>
