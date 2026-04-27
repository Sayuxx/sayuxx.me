<script lang="ts">
	interface Props {
		label: string;
		value: string;
		onchange: (hex: string) => void;
		clearable?: boolean;
		onclear?: () => void;
	}

	let { label, value, onchange, clearable = false, onclear }: Props = $props();

	let textValue = $state('');

	$effect(() => {
		textValue = value;
	});

	function commitText() {
		const v = textValue.trim().toLowerCase();
		if (/^#?[0-9a-f]{6}$/.test(v)) {
			onchange(v.startsWith('#') ? v : `#${v}`);
		} else {
			textValue = value;
		}
	}
</script>

<label>
	<span>{label}</span>
	<div class="row">
		<input
			class="swatch"
			type="color"
			value={value}
			oninput={(e) => onchange((e.currentTarget as HTMLInputElement).value)}
		/>
		<input
			class="hex"
			type="text"
			bind:value={textValue}
			onblur={commitText}
			onkeydown={(e) => e.key === 'Enter' && commitText()}
			spellcheck="false"
		/>
		{#if clearable && onclear}
			<button class="clear" onclick={onclear} aria-label="clear">×</button>
		{/if}
	</div>
</label>

<style>
	.row {
		display: flex;
		gap: 6px;
		align-items: stretch;
	}
	.swatch {
		width: 32px;
		height: 28px;
		padding: 2px;
		border-radius: var(--radius);
		cursor: pointer;
		flex: none;
	}
	.hex {
		flex: 1;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		text-transform: lowercase;
	}
	.clear {
		padding: 0 8px;
		font-size: 16px;
		line-height: 1;
		flex: none;
	}
</style>
