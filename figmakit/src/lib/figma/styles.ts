import { buildTypeScale } from '../tokens/typography';
import type { TypeName, TypeStep } from '../tokens/typography';
import { SHADOW_TOKENS, type ShadowLayer } from '../tokens/shadows';

async function removeStylesByPrefix(prefix: string, kind: 'text' | 'effect'): Promise<void> {
	const all =
		kind === 'text'
			? await figma.getLocalTextStylesAsync()
			: await figma.getLocalEffectStylesAsync();
	for (const style of all) {
		if (style.name.startsWith(prefix)) style.remove();
	}
}

export async function loadFamilyRegular(family: string): Promise<FontName> {
	const font: FontName = { family, style: 'Regular' };
	try {
		await figma.loadFontAsync(font);
		return font;
	} catch {
		throw new Error(`Font not available: ${family} Regular`);
	}
}

export async function applyTextStyles(
	ratio: 1.2 | 1.333,
	fontFamily: string
): Promise<Map<TypeName, TextStyle>> {
	const font = await loadFamilyRegular(fontFamily);
	await removeStylesByPrefix('text/', 'text');

	const result = new Map<TypeName, TextStyle>();
	const scale = buildTypeScale(ratio);
	for (const step of scale) {
		const style = figma.createTextStyle();
		style.name = `text/${step.name}`;
		style.fontName = font;
		style.fontSize = step.fontSize;
		style.lineHeight = { unit: 'PIXELS', value: step.lineHeight };
		result.set(step.name, style);
	}
	return result;
}

function shadowEffect(layer: ShadowLayer): DropShadowEffect {
	return {
		type: 'DROP_SHADOW',
		color: layer.colorRgba,
		offset: { x: layer.offsetX, y: layer.offsetY },
		radius: layer.blur,
		spread: layer.spread,
		visible: true,
		blendMode: 'NORMAL'
	};
}

export async function applyEffectStyles(): Promise<Map<string, EffectStyle>> {
	await removeStylesByPrefix('shadow/', 'effect');
	const result = new Map<string, EffectStyle>();
	for (const token of SHADOW_TOKENS) {
		const style = figma.createEffectStyle();
		style.name = `shadow/${token.name}`;
		style.effects = token.layers.map(shadowEffect);
		result.set(token.name, style);
	}
	return result;
}

export type { TypeStep };
