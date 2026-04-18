<script lang="ts">
	import { template, templateMonth, setTemplate, setTemplateMonth } from '$lib/stores/template';
	import { shifts, replaceMonthShifts } from '$lib/stores/shifts';
	import { expandTemplate } from '$lib/calc/template';
	import type { TimeRange } from '$lib/calc/types';
	import BreakInput from './BreakInput.svelte';

	const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

	const inputClass = 'w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-2 text-sm text-ctp-text placeholder-ctp-overlay0 focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender focus:outline-none';

	function updateRange(field: 'start' | 'end', value: string) {
		setTemplate({ ...$template, range: { ...$template.range, [field]: value } });
	}

	function updateBreak(i: number, next: TimeRange) {
		const breaks = $template.breaks.map((b, idx) => (idx === i ? next : b));
		setTemplate({ ...$template, breaks });
	}

	function addBreak() {
		setTemplate({ ...$template, breaks: [...$template.breaks, { start: '', end: '' }] });
	}

	function removeBreak(i: number) {
		setTemplate({ ...$template, breaks: $template.breaks.filter((_, idx) => idx !== i) });
	}

	function toggleWeekday(dow: number) {
		const set = new Set($template.weekdays);
		if (set.has(dow)) set.delete(dow);
		else set.add(dow);
		setTemplate({ ...$template, weekdays: [...set].sort((a, b) => a - b) });
	}

	function toggleSaturdayBonus() {
		setTemplate({ ...$template, saturdayBonus: !$template.saturdayBonus });
	}

	const saturdayInWeekdays = $derived($template.weekdays.includes(6));

	const existingInMonth = $derived(
		$shifts.filter((s) => s.date.startsWith($templateMonth + '-')).length
	);

	const previewCount = $derived(expandTemplate($template, $templateMonth).length);

	function handleGenerate() {
		const validBreaks = $template.breaks.filter((b) => b.start !== '' && b.end !== '');
		const cleanTemplate = { ...$template, breaks: validBreaks };
		const generated = expandTemplate(cleanTemplate, $templateMonth);
		replaceMonthShifts($templateMonth, generated);
	}

	const canGenerate = $derived(
		$template.weekdays.length > 0 &&
			$template.range.start !== '' &&
			$template.range.end !== '' &&
			/^\d{4}-\d{2}$/.test($templateMonth)
	);
</script>

<div class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-4 shadow-sm">
	<h2 class="mb-3 text-lg font-semibold text-ctp-text">Turno padrão do mês</h2>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
		<div>
			<label for="tpl-month" class="mb-1 block text-sm font-medium text-ctp-subtext1">Mês</label>
			<input
				id="tpl-month"
				type="month"
				value={$templateMonth}
				oninput={(e) => setTemplateMonth((e.target as HTMLInputElement).value)}
				class={inputClass}
			/>
		</div>
		<div>
			<label for="tpl-start" class="mb-1 block text-sm font-medium text-ctp-subtext1">Início</label>
			<input
				id="tpl-start"
				type="time"
				value={$template.range.start}
				oninput={(e) => updateRange('start', (e.target as HTMLInputElement).value)}
				class={inputClass}
			/>
		</div>
		<div>
			<label for="tpl-end" class="mb-1 block text-sm font-medium text-ctp-subtext1">Fim</label>
			<input
				id="tpl-end"
				type="time"
				value={$template.range.end}
				oninput={(e) => updateRange('end', (e.target as HTMLInputElement).value)}
				class={inputClass}
			/>
		</div>
	</div>

	<div class="mt-4">
		<span class="mb-2 block text-sm font-medium text-ctp-subtext1">Dias da semana</span>
		<div class="flex flex-wrap gap-2">
			{#each WEEKDAY_LABELS as label, dow}
				<button
					type="button"
					onclick={() => toggleWeekday(dow)}
					class="rounded-full border px-3 py-1 text-sm transition-colors {$template.weekdays.includes(dow)
						? 'border-ctp-blue bg-ctp-blue text-ctp-base'
						: 'border-ctp-surface1 bg-ctp-mantle text-ctp-subtext1 hover:bg-ctp-surface0'}"
				>
					{label}
				</button>
			{/each}
		</div>

		{#if saturdayInWeekdays}
			<label class="mt-3 flex items-center gap-2 text-sm text-ctp-subtext1">
				<input
					type="checkbox"
					checked={$template.saturdayBonus}
					onchange={toggleSaturdayBonus}
					class="h-4 w-4 rounded border-ctp-surface1 bg-ctp-mantle text-ctp-lavender focus:ring-ctp-lavender"
				/>
				Sábados recebem +25% o dia inteiro
			</label>
		{/if}
	</div>

	<div class="mt-4">
		<div class="mb-2 flex items-center justify-between">
			<span class="text-sm font-medium text-ctp-subtext1">Descansos (todos os dias)</span>
			<button
				type="button"
				onclick={addBreak}
				class="rounded px-2 py-1 text-xs text-ctp-blue hover:bg-ctp-surface0"
			>
				+ adicionar
			</button>
		</div>
		<div class="space-y-2">
			{#each $template.breaks as br, i (i)}
				<BreakInput
					value={br}
					onchange={(next) => updateBreak(i, next)}
					onremove={() => removeBreak(i)}
				/>
			{/each}
			{#if $template.breaks.length === 0}
				<p class="text-xs text-ctp-overlay0">Nenhum descanso.</p>
			{/if}
		</div>
	</div>

	<div class="mt-4 rounded border border-ctp-surface1 bg-ctp-base/40 p-3 text-sm text-ctp-subtext1">
		Vai gerar <strong class="text-ctp-text">{previewCount}</strong> turno{previewCount === 1 ? '' : 's'} em {$templateMonth}.
		{#if existingInMonth > 0}
			<span class="block text-ctp-peach">
				⚠ Gerar vai substituir os {existingInMonth} turno{existingInMonth === 1 ? '' : 's'} já cadastrado{existingInMonth === 1 ? '' : 's'} neste mês.
			</span>
		{/if}
	</div>

	<button
		type="button"
		onclick={handleGenerate}
		disabled={!canGenerate}
		class="mt-3 w-full rounded-md bg-ctp-blue px-4 py-2 text-sm font-medium text-ctp-base transition-colors hover:bg-ctp-sapphire disabled:cursor-not-allowed disabled:bg-ctp-surface1 disabled:text-ctp-overlay0 sm:w-auto"
	>
		Gerar turnos do mês
	</button>

	<p class="mt-3 text-xs text-ctp-overlay0">
		Depois de gerar, troque para "Dia a dia" para marcar feriados ou corrigir horários específicos.
	</p>
</div>
