import type { CodeToUi, GenerateFoundationsPayload, UiToCode } from './lib/messaging';
import { buildPalette } from './lib/palette';
import { applyPaletteVariables, applySpacingVariables } from './lib/figma/variables';
import { applyTextStyles, applyEffectStyles, loadFamilyRegular } from './lib/figma/styles';
import { buildStyleGuide } from './lib/templates/styleGuide';
import { lookupExisting } from './lib/figma/lookup';

const STORAGE_KEY = 'figmakit:config';

let lastConfig: GenerateFoundationsPayload | null = null;

figma.showUI(__html__, { width: 360, height: 640, themeColors: true });

void (async () => {
	const stored = await figma.clientStorage.getAsync(STORAGE_KEY).catch(() => null);
	if (stored && typeof stored === 'object' && 'primaryHex' in stored) {
		lastConfig = stored as GenerateFoundationsPayload;
		post({
			type: 'restored',
			primaryHex: lastConfig.primaryHex,
			fontFamily: lastConfig.fontFamily ?? null
		});
	} else {
		post({ type: 'restored', primaryHex: null, fontFamily: null });
	}
})();

figma.ui.onmessage = async (msg: UiToCode) => {
	try {
		switch (msg.type) {
			case 'ping':
				post({ type: 'pong' });
				return;
			case 'request-fonts':
				await handleRequestFonts();
				return;
			case 'generate-foundations':
				await handleGenerate(msg.payload);
				return;
			case 'insert-style-guide':
				await handleInsertGuide();
				return;
		}
	} catch (err) {
		post({ type: 'error', message: err instanceof Error ? err.message : String(err) });
	}
};

async function handleRequestFonts(): Promise<void> {
	const all = await figma.listAvailableFontsAsync();
	const families = Array.from(new Set(all.map((f) => f.fontName.family))).sort((a, b) =>
		a.localeCompare(b)
	);
	post({ type: 'fonts', families });
}

async function handleGenerate(payload: GenerateFoundationsPayload): Promise<void> {
	const palette = buildPalette({
		primaryHex: payload.primaryHex,
		accentHex: payload.accentHex,
		includeSemantic: payload.includeSemantic
	});

	await applyPaletteVariables(palette);
	await applySpacingVariables();
	await applyTextStyles(payload.typeRatio, payload.fontFamily);
	await applyEffectStyles();

	lastConfig = payload;
	await figma.clientStorage.setAsync(STORAGE_KEY, payload);
	post({ type: 'foundations-ready' });
}

async function handleInsertGuide(): Promise<void> {
	if (!lastConfig) {
		post({ type: 'error', message: 'run "generate foundations" first' });
		return;
	}
	const found = await lookupExisting();
	if (found.colorByName.size === 0) {
		post({ type: 'error', message: 'foundations missing — generate them again' });
		return;
	}
	const font = await loadFamilyRegular(lastConfig.fontFamily);
	await buildStyleGuide({
		...found,
		typeRatio: lastConfig.typeRatio,
		hasAccent: lastConfig.accentHex !== null,
		hasSemantic: lastConfig.includeSemantic,
		fontFamily: lastConfig.fontFamily,
		font
	});
	post({ type: 'style-guide-ready' });
}

function post(msg: CodeToUi) {
	figma.ui.postMessage(msg);
}
