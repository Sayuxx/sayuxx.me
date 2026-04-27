import type { TypeName } from '../tokens/typography';
import { TYPE_NAMES, buildTypeScale } from '../tokens/typography';
import { RADIUS_TOKENS, SPACE_STEPS, type RadiusName, type SpaceStep } from '../tokens/spacing';
import { SHADOW_TOKENS } from '../tokens/shadows';
import { STEPS } from '../palette/types';
import type { SemanticAliasName } from '../figma/variables';
import { ICONS } from './icons';

const FONT: FontName = { family: 'Inter', style: 'Regular' };

export interface StyleGuideContext {
	colorByName: Map<string, Variable>;
	semanticAliases: Map<SemanticAliasName, Variable>;
	spaceByStep: Map<SpaceStep, Variable>;
	radiusByName: Map<RadiusName, Variable>;
	textStyles: Map<TypeName, TextStyle>;
	effectStyles: Map<string, EffectStyle>;
	typeRatio: 1.2 | 1.333;
	hasAccent: boolean;
	hasSemantic: boolean;
}

const STYLE_GUIDE_NAME = 'figmakit/style-guide';

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
	t.fontName = FONT;
	t.characters = content;
	t.fontSize = size;
	t.fills = fillFromVar(ctx.semanticAliases.get('text'));
	return t;
}

function mutedText(content: string, size: number, ctx: StyleGuideContext): TextNode {
	const t = text(content, size, ctx);
	t.fills = fillFromVar(ctx.semanticAliases.get('text-muted'));
	return t;
}

function sectionTitle(content: string, ctx: StyleGuideContext): TextNode {
	const t = text(content, 24, ctx);
	t.fontName = { family: 'Inter', style: 'Regular' };
	return t;
}

function swatch(varName: string, ctx: StyleGuideContext): FrameNode {
	const v = ctx.colorByName.get(varName);
	const cell = vstack(varName, {
		layoutMode: 'VERTICAL',
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 8,
		paddingBottom: 8,
		itemSpacing: 4,
		fills: fillFromVar(v)
	});
	cell.resize(64, 64);
	cell.primaryAxisSizingMode = 'FIXED';
	cell.counterAxisSizingMode = 'FIXED';
	cell.primaryAxisAlignItems = 'MAX';
	const label = figma.createText();
	label.fontName = FONT;
	label.fontSize = 10;
	const step = varName.split('/')[1];
	label.characters = step;
	const onLight = isLightStep(step);
	label.fills = onLight
		? [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.6 }]
		: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.7 }];
	cell.appendChild(label);
	return cell;
}

function isLightStep(step: string): boolean {
	const n = parseInt(step, 10);
	return !isNaN(n) && n <= 400;
}

function scaleRow(label: string, prefix: string, ctx: StyleGuideContext): FrameNode {
	const row = vstack(`${prefix}-row`, { itemSpacing: 8 });
	row.appendChild(mutedText(label, 12, ctx));
	const swatches = hstack(`${prefix}-swatches`, { itemSpacing: 4 });
	for (const step of STEPS) {
		swatches.appendChild(swatch(`${prefix}/${step}`, ctx));
	}
	row.appendChild(swatches);
	return row;
}

async function buildPaletteSection(ctx: StyleGuideContext): Promise<FrameNode> {
	const section = vstack('palette', { itemSpacing: 20 });
	section.appendChild(sectionTitle('Palette', ctx));
	section.appendChild(scaleRow('primary', 'primary', ctx));
	if (ctx.hasAccent) section.appendChild(scaleRow('accent', 'accent', ctx));
	section.appendChild(scaleRow('neutral', 'neutral', ctx));
	if (ctx.hasSemantic) {
		section.appendChild(scaleRow('success', 'success', ctx));
		section.appendChild(scaleRow('warn', 'warn', ctx));
		section.appendChild(scaleRow('error', 'error', ctx));
		section.appendChild(scaleRow('info', 'info', ctx));
	}
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

function buildSpacingSection(ctx: StyleGuideContext): FrameNode {
	const section = vstack('spacing', { itemSpacing: 16 });
	section.appendChild(sectionTitle('Spacing', ctx));
	const list = vstack('space-list', { itemSpacing: 6 });
	for (const step of SPACE_STEPS) {
		const variable = ctx.spaceByStep.get(step as SpaceStep);
		if (!variable) continue;
		const row = hstack(`space-${step}`, { itemSpacing: 12, counterAxisAlignItems: 'CENTER' });
		const label = mutedText(`space-${step}`, 11, ctx);
		label.resize(80, label.height);
		label.layoutSizingHorizontal = 'FIXED';
		const bar = figma.createFrame();
		bar.name = `bar-${step}`;
		bar.fills = fillFromVar(ctx.semanticAliases.get('accent'));
		bar.resize(Math.max(2, step * 4 + 1), 16);
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
	for (const [name, value] of Object.entries(RADIUS_TOKENS) as [RadiusName, number][]) {
		const variable = ctx.radiusByName.get(name);
		const cell = vstack(`radius-${name}`, { itemSpacing: 8, counterAxisAlignItems: 'CENTER' });
		const block = figma.createFrame();
		block.name = `block-${name}`;
		block.fills = fillFromVar(ctx.semanticAliases.get('accent'));
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
		card.fills = fillFromVar(ctx.semanticAliases.get('surface'));
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
	const textVar = ctx.semanticAliases.get('text');
	for (const icon of ICONS) {
		const cell = vstack(`icon-${icon.name}`, { itemSpacing: 6, counterAxisAlignItems: 'CENTER' });
		const node = figma.createNodeFromSvg(icon.svg);
		node.name = icon.name;
		recolorChildren(node, textVar);
		cell.appendChild(node);
		cell.appendChild(mutedText(icon.name, 10, ctx));
		grid.appendChild(cell);
	}
	section.appendChild(grid);
	return section;
}

function recolorChildren(node: SceneNode, variable: Variable | undefined): void {
	if (!variable) return;
	if ('strokes' in node && Array.isArray(node.strokes) && node.strokes.length > 0) {
		const fresh: SolidPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
		node.strokes = [figma.variables.setBoundVariableForPaint(fresh, 'color', variable)];
	}
	if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
		const fresh: SolidPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
		node.fills = [figma.variables.setBoundVariableForPaint(fresh, 'color', variable)];
	}
	if ('children' in node) {
		for (const child of node.children) recolorChildren(child, variable);
	}
}

async function removeExistingStyleGuide(): Promise<void> {
	const page = figma.currentPage;
	for (const child of page.children) {
		if (child.name === STYLE_GUIDE_NAME) child.remove();
	}
}

export async function buildStyleGuide(ctx: StyleGuideContext): Promise<FrameNode> {
	await figma.loadFontAsync(FONT);
	await removeExistingStyleGuide();

	const root = vstack(STYLE_GUIDE_NAME, {
		paddingLeft: 64,
		paddingRight: 64,
		paddingTop: 64,
		paddingBottom: 64,
		itemSpacing: 48,
		fills: fillFromVar(ctx.semanticAliases.get('bg'))
	});
	root.layoutMode = 'VERTICAL';
	root.primaryAxisSizingMode = 'AUTO';
	root.counterAxisSizingMode = 'AUTO';

	const header = vstack('header', { itemSpacing: 6 });
	const title = text('Design Foundations', 32, ctx);
	const subtitle = mutedText('Generated by figmakit · variables · text styles · effect styles', 12, ctx);
	header.appendChild(title);
	header.appendChild(subtitle);
	root.appendChild(header);

	root.appendChild(await buildPaletteSection(ctx));
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
