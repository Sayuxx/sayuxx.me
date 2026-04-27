import type { TypeName } from '../tokens/typography';
import { buildTypeScale } from '../tokens/typography';
import { RADIUS_TOKENS, SPACE_STEPS, type RadiusName, type SpaceStep } from '../tokens/spacing';
import { SHADOW_TOKENS } from '../tokens/shadows';
import { loadFamilyRegular } from '../figma/styles';
import { hexToRgb } from '../figma/color';
import { ICONS } from './icons';

export interface StyleGuideContext {
	colorByName: Map<string, Variable>;
	spaceByStep: Map<SpaceStep, Variable>;
	radiusByName: Map<RadiusName, Variable>;
	textStyles: Map<TypeName, TextStyle>;
	effectStyles: Map<string, EffectStyle>;
	typeRatio: 1.2 | 1.333;
	fontFamily: string;
	font: FontName;
}

const STYLE_GUIDE_NAME = 'figmakit/style-guide';

const CHROME = {
	bg: hexToRgb('#ffffff'),
	surface: hexToRgb('#ffffff'),
	border: hexToRgb('#e5e5e5'),
	text: hexToRgb('#1a1a1a'),
	textMuted: hexToRgb('#666666')
} as const;

function solid(rgb: RGB): SolidPaint[] {
	return [{ type: 'SOLID', color: rgb }];
}

function fillFromVar(v: Variable | undefined): SolidPaint[] {
	if (!v) return [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
	const paint: SolidPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
	const bound = figma.variables.setBoundVariableForPaint(paint, 'color', v);
	return [bound];
}

function vstack(name: string, opts: Partial<FrameNode> = {}): FrameNode {
	const f = figma.createFrame();
	f.name = name;
	f.layoutMode = 'VERTICAL';
	f.primaryAxisSizingMode = 'AUTO';
	f.counterAxisSizingMode = 'AUTO';
	f.fills = [];
	Object.assign(f, opts);
	return f;
}

function hstack(name: string, opts: Partial<FrameNode> = {}): FrameNode {
	const f = figma.createFrame();
	f.name = name;
	f.layoutMode = 'HORIZONTAL';
	f.primaryAxisSizingMode = 'AUTO';
	f.counterAxisSizingMode = 'AUTO';
	f.fills = [];
	Object.assign(f, opts);
	return f;
}

function text(content: string, size: number, ctx: StyleGuideContext): TextNode {
	const t = figma.createText();
	t.fontName = ctx.font;
	t.characters = content;
	t.fontSize = size;
	t.fills = solid(CHROME.text);
	return t;
}

function mutedText(content: string, size: number, ctx: StyleGuideContext): TextNode {
	const t = text(content, size, ctx);
	t.fills = solid(CHROME.textMuted);
	return t;
}

function sectionTitle(content: string, ctx: StyleGuideContext): TextNode {
	return text(content, 24, ctx);
}

function readVariableHex(v: Variable): string {
	const modeId = Object.keys(v.valuesByMode)[0];
	const value = v.valuesByMode[modeId];
	if (!value || typeof value !== 'object' || !('r' in value)) return '';
	const r = Math.round((value as RGB).r * 255);
	const g = Math.round((value as RGB).g * 255);
	const b = Math.round((value as RGB).b * 255);
	const hex = ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
	return `#${hex}`;
}

function buildPaletteSection(ctx: StyleGuideContext): FrameNode {
	const section = vstack('palette', { itemSpacing: 16 });
	section.appendChild(sectionTitle('Colors', ctx));
	const list = vstack('color-list', { itemSpacing: 12 });
	for (const [name, variable] of ctx.colorByName) {
		const row = hstack(`color-${name}`, { itemSpacing: 16, counterAxisAlignItems: 'CENTER' });
		const swatch = figma.createFrame();
		swatch.name = `swatch-${name}`;
		swatch.fills = fillFromVar(variable);
		swatch.cornerRadius = 8;
		swatch.resize(64, 64);
		const labels = vstack(`labels-${name}`, { itemSpacing: 2 });
		labels.appendChild(text(name, 14, ctx));
		labels.appendChild(mutedText(readVariableHex(variable), 11, ctx));
		row.appendChild(swatch);
		row.appendChild(labels);
		list.appendChild(row);
	}
	section.appendChild(list);
	return section;
}

function buildTypographySection(ctx: StyleGuideContext): FrameNode {
	const section = vstack('typography', { itemSpacing: 20 });
	section.appendChild(sectionTitle('Typography', ctx));
	const list = vstack('type-list', { itemSpacing: 12 });
	const sizes = buildTypeScale(ctx.typeRatio);
	for (const step of sizes) {
		const row = hstack(`type-${step.name}`, { itemSpacing: 16, counterAxisAlignItems: 'CENTER' });
		const label = mutedText(`${step.name} · ${step.fontSize}px`, 11, ctx);
		label.resize(120, label.height);
		label.layoutSizingHorizontal = 'FIXED';
		const sample = text('The quick brown fox jumps over the lazy dog', step.fontSize, ctx);
		const textStyle = ctx.textStyles.get(step.name as TypeName);
		if (textStyle) sample.setTextStyleIdAsync(textStyle.id);
		row.appendChild(label);
		row.appendChild(sample);
		list.appendChild(row);
	}
	section.appendChild(list);
	return section;
}

const SPACING_VISUAL_FACTOR = 6;

function firstColorVar(ctx: StyleGuideContext): Variable | undefined {
	const first = ctx.colorByName.values().next();
	return first.done ? undefined : first.value;
}

function buildSpacingSection(ctx: StyleGuideContext): FrameNode {
	const section = vstack('spacing', { itemSpacing: 16 });
	section.appendChild(sectionTitle('Spacing', ctx));
	const list = vstack('space-list', { itemSpacing: 4 });
	const accent = firstColorVar(ctx);
	for (const step of SPACE_STEPS) {
		const variable = ctx.spaceByStep.get(step as SpaceStep);
		if (!variable) continue;
		const row = hstack(`space-${step}`, { itemSpacing: 12, counterAxisAlignItems: 'CENTER' });
		const label = mutedText(String(step), 12, ctx);
		label.resize(36, label.height);
		label.layoutSizingHorizontal = 'FIXED';
		const bar = figma.createFrame();
		bar.name = `bar-${step}`;
		bar.fills = fillFromVar(accent);
		bar.resize(Math.max(8, step * SPACING_VISUAL_FACTOR), 24);
		row.appendChild(label);
		row.appendChild(bar);
		list.appendChild(row);
	}
	section.appendChild(list);
	return section;
}

function buildRadiusSection(ctx: StyleGuideContext): FrameNode {
	const section = vstack('radius', { itemSpacing: 16 });
	section.appendChild(sectionTitle('Radius', ctx));
	const row = hstack('radius-row', { itemSpacing: 16, counterAxisAlignItems: 'CENTER' });
	const accent = firstColorVar(ctx);
	for (const [name, value] of Object.entries(RADIUS_TOKENS) as [RadiusName, number][]) {
		const variable = ctx.radiusByName.get(name);
		const cell = vstack(`radius-${name}`, { itemSpacing: 8, counterAxisAlignItems: 'CENTER' });
		const block = figma.createFrame();
		block.name = `block-${name}`;
		block.fills = fillFromVar(accent);
		block.resize(64, 64);
		const r = name === 'full' ? 32 : value;
		block.cornerRadius = r;
		if (variable && name !== 'full') block.setBoundVariable('topLeftRadius', variable);
		cell.appendChild(block);
		cell.appendChild(mutedText(name, 11, ctx));
		row.appendChild(cell);
	}
	section.appendChild(row);
	return section;
}

function buildShadowsSection(ctx: StyleGuideContext): FrameNode {
	const section = vstack('shadows', { itemSpacing: 16 });
	section.appendChild(sectionTitle('Shadows', ctx));
	const row = hstack('shadow-row', { itemSpacing: 24 });
	for (const token of SHADOW_TOKENS) {
		const cell = vstack(`shadow-${token.name}`, { itemSpacing: 8, counterAxisAlignItems: 'CENTER' });
		const card = figma.createFrame();
		card.name = `card-${token.name}`;
		card.fills = solid(CHROME.surface);
		card.strokes = solid(CHROME.border);
		card.strokeWeight = 1;
		card.cornerRadius = 8;
		card.resize(96, 64);
		const style = ctx.effectStyles.get(token.name);
		if (style) card.setEffectStyleIdAsync(style.id);
		cell.appendChild(card);
		cell.appendChild(mutedText(token.name, 11, ctx));
		row.appendChild(cell);
	}
	section.appendChild(row);
	return section;
}

function buildIconsSection(ctx: StyleGuideContext): FrameNode {
	const section = vstack('icons', { itemSpacing: 16 });
	section.appendChild(sectionTitle('Icons', ctx));
	const grid = hstack('icons-grid', { itemSpacing: 16 });
	for (const icon of ICONS) {
		const cell = vstack(`icon-${icon.name}`, { itemSpacing: 6, counterAxisAlignItems: 'CENTER' });
		const node = figma.createNodeFromSvg(icon.svg);
		node.name = icon.name;
		recolorChildren(node, CHROME.text);
		cell.appendChild(node);
		cell.appendChild(mutedText(icon.name, 10, ctx));
		grid.appendChild(cell);
	}
	section.appendChild(grid);
	return section;
}

function recolorChildren(node: SceneNode, rgb: RGB): void {
	if ('strokes' in node && Array.isArray(node.strokes) && node.strokes.length > 0) {
		node.strokes = solid(rgb);
	}
	if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
		node.fills = solid(rgb);
	}
	if ('children' in node) {
		for (const child of node.children) recolorChildren(child, rgb);
	}
}

async function removeExistingStyleGuide(): Promise<void> {
	const page = figma.currentPage;
	for (const child of page.children) {
		if (child.name === STYLE_GUIDE_NAME) child.remove();
	}
}

export async function buildStyleGuide(ctx: StyleGuideContext): Promise<FrameNode> {
	await loadFamilyRegular(ctx.fontFamily);
	await removeExistingStyleGuide();

	const root = vstack(STYLE_GUIDE_NAME, {
		paddingLeft: 64,
		paddingRight: 64,
		paddingTop: 64,
		paddingBottom: 64,
		itemSpacing: 48,
		fills: solid(CHROME.bg)
	});
	root.layoutMode = 'VERTICAL';
	root.primaryAxisSizingMode = 'AUTO';
	root.counterAxisSizingMode = 'AUTO';

	const header = vstack('header', { itemSpacing: 6 });
	header.appendChild(text('Design Foundations', 32, ctx));
	header.appendChild(
		mutedText('Generated by figmakit · variables · text styles · effect styles', 12, ctx)
	);
	root.appendChild(header);

	root.appendChild(buildPaletteSection(ctx));
	root.appendChild(buildTypographySection(ctx));
	root.appendChild(buildSpacingSection(ctx));
	root.appendChild(buildRadiusSection(ctx));
	root.appendChild(buildShadowsSection(ctx));
	root.appendChild(buildIconsSection(ctx));

	figma.currentPage.appendChild(root);
	root.x = figma.viewport.center.x - root.width / 2;
	root.y = figma.viewport.center.y - root.height / 2;
	figma.viewport.scrollAndZoomIntoView([root]);
	return root;
}
