<script lang="ts">
	import type { TimeRange } from '$lib/calc/types';

	interface Props {
		value: TimeRange;
		onchange: (next: TimeRange) => void;
		onremove: () => void;
	}

	let { value, onchange, onremove }: Props = $props();

	const inputClass = 'rounded-md border border-ctp-surface1 bg-ctp-mantle px-2 py-1 text-sm text-ctp-text focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender focus:outline-none';
</script>

<div class="flex items-center gap-2">
	<input
		type="time"
		value={value.start}
		oninput={(e) => onchange({ ...value, start: (e.target as HTMLInputElement).value })}
		class={inputClass}
	/>
	<span class="text-ctp-overlay1">→</span>
	<input
		type="time"
		value={value.end}
		oninput={(e) => onchange({ ...value, end: (e.target as HTMLInputElement).value })}
		class={inputClass}
	/>
	<button
		type="button"
		onclick={onremove}
		class="rounded px-2 py-1 text-sm text-ctp-red hover:bg-ctp-surface0"
		aria-label="Remover descanso"
	>
		×
	</button>
</div>
