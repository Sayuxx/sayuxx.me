<script lang="ts">
	import type { CodeToUi, GenerateFoundationsPayload, UiToCode } from '../lib/messaging';
	import { buildPalette } from '../lib/palette';
	import ColorPicker from './ColorPicker.svelte';
	import ScalePreview from './ScalePreview.svelte';

	let primaryHex = $state('#3b82f6');
	let accentHex = $state<string | null>(null);
	let includeSemantic = $state(true);
	let spacingBase = $state<4 | 8>(4);
	let typeRatio = $state<1.2 | 1.333>(1.2);

	let foundationsBusy = $state(false);
	let styleGuideBusy = $state(false);
	let toast = $state<string | null>(null);

	let palette = $derived.by(() => {
		try {
			return buildPalette({ primaryHex, accentHex, includeSemantic });
		} catch {
			return null;
		}
	});

	function send(msg: UiToCode) {
		parent.postMessage({ pluginMessage: msg }, '*');
	}

	function generate() {
		const payload: GenerateFoundationsPayload = {
			primaryHex,
			accentHex,
			includeSemantic,
			spacingBase,
			typeRatio
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
			case 'restored':
				if (msg.primaryHex) primaryHex = msg.primaryHex;
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
</script>

<main>
	<header>
		<h1>figmakit</h1>
		<p class="muted">design foundations generator</p>
	</header>

	<section class="form">
		<ColorPicker label="primary" value={primaryHex} onchange={(v) => (primaryHex = v)} />

		<ColorPicker
			label="accent (optional)"
			value={accentHex ?? '#888888'}
			onchange={(v) => (accentHex = v)}
			clearable={accentHex !== null}
			onclear={() => (accentHex = null)}
		/>

		<label class="check">
			<input type="checkbox" bind:checked={includeSemantic} />
			<span>include semantic colors (success, warn, error, info)</span>
		</label>

		<div class="grid">
			<label>
				<span>spacing base</span>
				<select bind:value={spacingBase}>
					<option value={4}>4px</option>
					<option value={8}>8px</option>
				</select>
			</label>

			<label>
				<span>type scale</span>
				<select bind:value={typeRatio}>
					<option value={1.2}>1.200 (minor third)</option>
					<option value={1.333}>1.333 (perfect fourth)</option>
				</select>
			</label>
		</div>
	</section>

	{#if palette}
		<section class="preview">
			<ScalePreview label="primary" scale={palette.primary} />
			{#if palette.accent}
				<ScalePreview label="accent" scale={palette.accent} />
			{/if}
			<ScalePreview label="neutral" scale={palette.neutral} />
			{#if palette.semantic}
				<ScalePreview label="success" scale={palette.semantic.success} />
				<ScalePreview label="warn" scale={palette.semantic.warn} />
				<ScalePreview label="error" scale={palette.semantic.error} />
				<ScalePreview label="info" scale={palette.semantic.info} />
			{/if}
		</section>
	{:else}
		<p class="muted">invalid color</p>
	{/if}

	<section class="actions">
		<button class="primary" onclick={generate} disabled={foundationsBusy || !palette}>
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
		gap: 10px;
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.check {
		flex-direction: row;
		align-items: center;
		gap: 8px;
		color: var(--text);
		font-size: 12px;
	}
	.check input {
		margin: 0;
	}
	.preview {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-height: 240px;
		overflow-y: auto;
		padding-right: 4px;
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
