<script lang="ts">
	import type { CodeToUi, GenerateFoundationsPayload, UiToCode } from '../lib/messaging';
	import { colorRoleName } from '../lib/palette';
	import ColorPicker from './ColorPicker.svelte';

	let colors = $state<string[]>(['#3b82f6']);
	let typeRatio = $state<1.2 | 1.333>(1.2);
	let fontFamily = $state('Inter');
	let fonts = $state<string[]>([]);

	let foundationsBusy = $state(false);
	let styleGuideBusy = $state(false);
	let toast = $state<string | null>(null);

	const HEX_RE = /^#[0-9a-f]{6}$/i;
	let allValid = $derived(colors.every((c) => HEX_RE.test(c)) && colors.length > 0);

	function send(msg: UiToCode) {
		parent.postMessage({ pluginMessage: msg }, '*');
	}

	function addColor() {
		colors = [...colors, '#888888'];
	}

	function removeColor(i: number) {
		if (colors.length <= 1) return;
		colors = colors.filter((_, idx) => idx !== i);
	}

	function setColor(i: number, hex: string) {
		colors = colors.map((c, idx) => (idx === i ? hex : c));
	}

	function generate() {
		const payload: GenerateFoundationsPayload = {
			colors: [...colors],
			typeRatio,
			fontFamily
		};
		foundationsBusy = true;
		send({ type: 'generate-foundations', payload });
	}

	function insertGuide() {
		styleGuideBusy = true;
		send({ type: 'insert-style-guide' });
	}

	window.onmessage = (event: MessageEvent<{ pluginMessage: CodeToUi }>) => {
		const msg = event.data.pluginMessage;
		if (!msg) return;
		switch (msg.type) {
			case 'foundations-ready':
				foundationsBusy = false;
				flash('foundations applied');
				break;
			case 'style-guide-ready':
				styleGuideBusy = false;
				flash('style guide inserted');
				break;
			case 'fonts':
				fonts = msg.families;
				break;
			case 'restored':
				if (msg.colors && msg.colors.length > 0) colors = msg.colors;
				if (msg.fontFamily) fontFamily = msg.fontFamily;
				break;
			case 'error':
				foundationsBusy = false;
				styleGuideBusy = false;
				flash(`error: ${msg.message}`);
				break;
		}
	};

	function flash(text: string) {
		toast = text;
		setTimeout(() => (toast = null), 2400);
	}

	send({ type: 'ping' });
	send({ type: 'request-fonts' });
</script>

<main>
	<header>
		<h1>figmakit</h1>
		<p class="muted">design foundations generator</p>
	</header>

	<section class="form">
		<div class="colors">
			<div class="colors-head">
				<span>colors</span>
				<button type="button" class="add" onclick={addColor}>+ add color</button>
			</div>
			{#each colors as color, i (i)}
				<div class="slot">
					<div class="slot-picker">
						<ColorPicker
							label={colorRoleName(i)}
							value={color}
							onchange={(v) => setColor(i, v)}
						/>
					</div>
					{#if colors.length > 1}
						<button type="button" class="remove" onclick={() => removeColor(i)} aria-label="remove">
							−
						</button>
					{/if}
				</div>
			{/each}
		</div>

		<label>
			<span>font family</span>
			<input
				list="font-families"
				bind:value={fontFamily}
				placeholder="type to search"
				spellcheck="false"
			/>
			<datalist id="font-families">
				{#each fonts as family (family)}
					<option value={family}></option>
				{/each}
			</datalist>
		</label>

		<label>
			<span>type scale</span>
			<select bind:value={typeRatio}>
				<option value={1.2}>1.200 (minor third)</option>
				<option value={1.333}>1.333 (perfect fourth)</option>
			</select>
		</label>
	</section>

	<section class="actions">
		<button class="primary" onclick={generate} disabled={foundationsBusy || !allValid}>
			{foundationsBusy ? 'generating…' : 'generate foundations'}
		</button>
		<button onclick={insertGuide} disabled={styleGuideBusy}>
			{styleGuideBusy ? 'inserting…' : 'insert style guide'}
		</button>
	</section>

	{#if toast}
		<div class="toast">{toast}</div>
	{/if}
</main>

<style>
	main {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	header h1 {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
	}
	header p {
		margin: 2px 0 0;
		font-size: 11px;
	}
	.muted {
		color: var(--muted);
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.colors {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.colors-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 11px;
		color: var(--muted);
	}
	.colors-head .add {
		padding: 4px 8px;
		font-size: 11px;
	}
	.slot {
		display: flex;
		gap: 6px;
		align-items: flex-end;
	}
	.slot-picker {
		flex: 1;
	}
	.remove {
		flex: none;
		padding: 0 10px;
		height: 28px;
		font-size: 14px;
		line-height: 1;
		align-self: flex-end;
		margin-bottom: 0;
	}
	.actions {
		display: flex;
		gap: 8px;
	}
	.actions button {
		flex: 1;
	}
	.toast {
		position: fixed;
		bottom: 12px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--surface);
		border: 1px solid var(--border);
		padding: 6px 12px;
		border-radius: var(--radius);
		font-size: 11px;
	}
</style>
