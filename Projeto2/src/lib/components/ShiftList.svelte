<script lang="ts">
	import { shifts, removeShift } from '$lib/stores/shifts';

	function formatDate(iso: string): string {
		const [y, m, d] = iso.split('-');
		return `${d}/${m}/${y.slice(2)}`;
	}

	function summarizeBreaks(count: number): string {
		if (count === 0) return 'sem descansos';
		return `${count} descanso${count > 1 ? 's' : ''}`;
	}

	const sorted = $derived(
		[...$shifts].sort((a, b) => {
			if (a.date !== b.date) return a.date.localeCompare(b.date);
			return a.range.start.localeCompare(b.range.start);
		})
	);
</script>

{#if sorted.length > 0}
	<div class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-4 shadow-sm">
		<h2 class="mb-3 text-lg font-semibold text-ctp-text">Turnos ({sorted.length})</h2>
		<ul class="divide-y divide-ctp-surface0">
			{#each sorted as shift (shift.id)}
				<li class="flex items-center justify-between py-2">
					<div>
						<div class="flex items-center gap-2 text-sm text-ctp-text">
							<span class="font-medium">{formatDate(shift.date)}</span>
							<span class="text-ctp-overlay1">·</span>
							<span>{shift.range.start} – {shift.range.end}</span>
							{#if shift.dayType === 'legalHoliday'}
								<span class="rounded bg-ctp-peach/20 px-2 py-0.5 text-xs text-ctp-peach">法定休日</span>
							{:else if shift.dayType === 'saturdayBonus'}
								<span class="rounded bg-ctp-sapphire/20 px-2 py-0.5 text-xs text-ctp-sapphire">Sáb +25%</span>
							{/if}
						</div>
						<div class="text-xs text-ctp-overlay0">{summarizeBreaks(shift.breaks.length)}</div>
					</div>
					<button
						type="button"
						onclick={() => removeShift(shift.id)}
						class="rounded px-2 py-1 text-sm text-ctp-red hover:bg-ctp-surface0"
						aria-label="Remover turno"
					>
						Remover
					</button>
				</li>
			{/each}
		</ul>
	</div>
{/if}
