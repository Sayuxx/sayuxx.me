<script lang="ts">
	import { shifts } from '$lib/stores/shifts';
	import { hourlyWageJPY } from '$lib/stores/settings';
	import { computeMonth, MULTIPLIERS } from '$lib/calc/engine';
	import type { Buckets } from '$lib/calc/types';

	const result = $derived(computeMonth($shifts, $hourlyWageJPY));

	function fmtJPY(n: number): string {
		return '¥' + Math.round(n).toLocaleString('ja-JP');
	}

	function fmtHours(min: number): string {
		const h = Math.floor(min / 60);
		const m = min % 60;
		if (m === 0) return `${h}h`;
		return `${h}h${String(m).padStart(2, '0')}`;
	}

	interface BucketRow {
		label: string;
		min: number;
		multiplier: number;
		valueJPY: number;
	}

	interface Sections {
		regular: BucketRow[];
		overtime: BucketRow[];
		saturday: BucketRow[];
		holiday: BucketRow[];
	}

	function rowsFor(buckets: Buckets, wage: number): Sections {
		const perMin = wage / 60;
		const mk = (label: string, min: number, mult: number): BucketRow => ({
			label,
			min,
			multiplier: mult,
			valueJPY: min * mult * perMin
		});
		return {
			regular: [
				mk('Normal (dia)', buckets.regularDayMin, MULTIPLIERS.regularDay),
				mk('Normal (noturno 22h–5h)', buckets.regularNightMin, MULTIPLIERS.regularNight)
			],
			overtime: [
				mk('Extra (dia)', buckets.overtimeDayMin, MULTIPLIERS.overtimeDay),
				mk('Extra (noturno)', buckets.overtimeNightMin, MULTIPLIERS.overtimeNight),
				mk('Extra pesada >60h (dia)', buckets.overtimeHeavyDayMin, MULTIPLIERS.overtimeHeavyDay),
				mk('Extra pesada >60h (noturno)', buckets.overtimeHeavyNightMin, MULTIPLIERS.overtimeHeavyNight)
			],
			saturday: [
				mk('Sábado (dia)', buckets.saturdayDayMin, MULTIPLIERS.saturdayDay),
				mk('Sábado (noturno)', buckets.saturdayNightMin, MULTIPLIERS.saturdayNight)
			],
			holiday: [
				mk('Feriado legal (dia)', buckets.holidayDayMin, MULTIPLIERS.holidayDay),
				mk('Feriado legal (noturno)', buckets.holidayNightMin, MULTIPLIERS.holidayNight)
			]
		};
	}

	const rows = $derived(rowsFor(result.totalBuckets, $hourlyWageJPY));

	let showDaily = $state(false);
</script>

{#if $shifts.length > 0}
	<div class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-4 shadow-sm">
		<h2 class="mb-3 text-lg font-semibold text-ctp-text">Resumo do mês</h2>

		{#if $hourlyWageJPY <= 0}
			<p class="mb-3 rounded border border-ctp-peach/40 bg-ctp-peach/10 p-2 text-sm text-ctp-peach">
				Defina o salário por hora acima para ver os valores.
			</p>
		{/if}

		{#if result.crossedOvertimeThreshold}
			<p class="mb-3 rounded border border-ctp-yellow/40 bg-ctp-yellow/10 p-2 text-sm text-ctp-yellow">
				⚠ Você cruzou 60h de horas extras no mês. As horas excedentes passam a ser pagas com adicional de 50%.
			</p>
		{/if}

		<div class="space-y-4">
			{#each [
				{ title: 'Dia útil normal', items: rows.regular },
				{ title: 'Hora extra', items: rows.overtime },
				{ title: 'Sábado (+25%)', items: rows.saturday },
				{ title: 'Feriado legal', items: rows.holiday }
			] as section}
				{#if section.items.some((r) => r.min > 0)}
					<div>
						<h3 class="mb-1 text-sm font-semibold text-ctp-subtext1">{section.title}</h3>
						<ul class="divide-y divide-ctp-surface0 text-sm">
							{#each section.items as row}
								{#if row.min > 0}
									<li class="flex items-center justify-between py-1.5">
										<span class="text-ctp-text">
											{row.label}
											<span class="text-xs text-ctp-overlay0"> × {row.multiplier.toFixed(2)}</span>
										</span>
										<span class="tabular-nums">
											<span class="text-ctp-subtext0">{fmtHours(row.min)}</span>
											<span class="ml-3 font-medium text-ctp-text">{fmtJPY(row.valueJPY)}</span>
										</span>
									</li>
								{/if}
							{/each}
						</ul>
					</div>
				{/if}
			{/each}
		</div>

		<div class="mt-4 flex items-baseline justify-between border-t border-ctp-surface1 pt-3">
			<div>
				<div class="text-sm text-ctp-subtext1">Total bruto</div>
				<div class="text-xs text-ctp-overlay0">{fmtHours(result.totalWorkedMin)} trabalhadas</div>
			</div>
			<div class="text-2xl font-bold text-ctp-green tabular-nums">{fmtJPY(result.totalGrossJPY)}</div>
		</div>

		<button
			type="button"
			onclick={() => (showDaily = !showDaily)}
			class="mt-3 text-xs text-ctp-blue hover:underline"
		>
			{showDaily ? 'Ocultar' : 'Ver'} quebra por dia
		</button>

		{#if showDaily}
			<ul class="mt-2 divide-y divide-ctp-surface0 text-sm">
				{#each result.days as day}
					<li class="flex items-center justify-between py-1.5">
						<span class="text-ctp-text">
							{day.date}
							<span class="ml-2 text-xs text-ctp-overlay0">{fmtHours(day.totalWorkedMin)}</span>
						</span>
						<span class="tabular-nums text-ctp-text">{fmtJPY(day.grossJPY)}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{/if}
