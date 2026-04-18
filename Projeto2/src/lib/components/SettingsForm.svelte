<script lang="ts">
	import { hourlyWageJPY, setHourlyWage } from '$lib/stores/settings';

	const inputClass = 'w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-2 text-sm text-ctp-text placeholder-ctp-overlay0 focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender focus:outline-none';
</script>

<div class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-4 shadow-sm">
	<label for="hourly-wage" class="mb-1 block text-sm font-medium text-ctp-subtext1">
		Salário por hora (¥)
	</label>
	<input
		id="hourly-wage"
		type="number"
		value={$hourlyWageJPY || ''}
		oninput={(e) => setHourlyWage(Number((e.target as HTMLInputElement).value))}
		min="0"
		step="10"
		placeholder="Ex: 1200"
		class={inputClass}
	/>
	<p class="mt-1 text-xs text-ctp-overlay0">時給 — valor base para todos os cálculos</p>
</div>
