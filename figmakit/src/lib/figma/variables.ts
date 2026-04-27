import type { ColorScale, PaletteSet, SemanticName, Step } from '../palette/types';
import { STEPS } from '../palette/types';
import { RADIUS_TOKENS, SPACE_STEPS, spaceValue, type RadiusName, type SpaceStep } from '../tokens/spacing';
import { VARIABLE_COLLECTIONS } from '../messaging';
import { hexToRgb } from './color';

interface ColorModes {
	light: string;
	dark: string;
}

export interface AppliedVariables {
	colors: VariableCollection;
	spacing: VariableCollection;
	colorByName: Map<string, Variable>;
	spaceByStep: Map<SpaceStep, Variable>;
	radiusByName: Map<RadiusName, Variable>;
	semanticAliases: Map<SemanticAliasName, Variable>;
}

export type SemanticAliasName = 'bg' | 'surface' | 'border' | 'text' | 'text-muted' | 'accent';

interface SemanticAliasMap {
	[key: string]: { light: string; dark: string };
}

const SEMANTIC_ALIASES: SemanticAliasMap = {
	bg: { light: 'neutral/50', dark: 'neutral/950' },
	surface: { light: 'neutral/100', dark: 'neutral/900' },
	border: { light: 'neutral/200', dark: 'neutral/800' },
	text: { light: 'neutral/900', dark: 'neutral/50' },
	'text-muted': { light: 'neutral/600', dark: 'neutral/400' },
	accent: { light: 'primary/500', dark: 'primary/400' }
};

async function resetCollection(name: string): Promise<VariableCollection> {
	const all = await figma.variables.getLocalVariableCollectionsAsync();
	const existing = all.find((c) => c.name === name);
	if (existing) {
		for (const id of existing.variableIds) {
			const v = await figma.variables.getVariableByIdAsync(id);
			v?.remove();
		}
		existing.remove();
	}
	return figma.variables.createVariableCollection(name);
}

interface EnsureModesResult {
	modes: Record<string, string>;
	multiMode: boolean;
}

function ensureModes(collection: VariableCollection, names: string[]): EnsureModesResult {
	const result: Record<string, string> = {};
	const [first, ...rest] = collection.modes;
	collection.renameMode(first.modeId, names[0]);
	result[names[0]] = first.modeId;

	for (const extra of rest) {
		collection.removeMode(extra.modeId);
	}

	let multiMode = true;
	for (let i = 1; i < names.length; i++) {
		try {
			result[names[i]] = collection.addMode(names[i]);
		} catch {
			multiMode = false;
			figma.notify('Free plan: dark mode skipped — Pro required for multi-mode variables.', {
				timeout: 4000
			});
			break;
		}
	}
	return { modes: result, multiMode };
}

function createColorVariable(
	name: string,
	collection: VariableCollection,
	modes: Record<string, string>,
	values: ColorModes,
	multiMode: boolean
): Variable {
	const v = figma.variables.createVariable(name, collection, 'COLOR');
	v.setValueForMode(modes.light, hexToRgb(values.light));
	if (multiMode) v.setValueForMode(modes.dark, hexToRgb(values.dark));
	return v;
}

function setScaleVariables(
	prefix: string,
	scale: ColorScale,
	collection: VariableCollection,
	modes: Record<string, string>,
	multiMode: boolean,
	target: Map<string, Variable>
): void {
	for (const step of STEPS) {
		const name = `${prefix}/${step}`;
		const v = createColorVariable(
			name,
			collection,
			modes,
			{ light: scale[step], dark: scale[step] },
			multiMode
		);
		target.set(name, v);
	}
}

function setAliasVariable(
	name: string,
	light: Variable,
	dark: Variable,
	collection: VariableCollection,
	modes: Record<string, string>,
	multiMode: boolean
): Variable {
	const v = figma.variables.createVariable(name, collection, 'COLOR');
	v.setValueForMode(modes.light, figma.variables.createVariableAlias(light));
	if (multiMode) v.setValueForMode(modes.dark, figma.variables.createVariableAlias(dark));
	return v;
}

export async function applyPaletteVariables(palette: PaletteSet): Promise<{
	collection: VariableCollection;
	colorByName: Map<string, Variable>;
	semanticAliases: Map<SemanticAliasName, Variable>;
}> {
	const collection = await resetCollection(VARIABLE_COLLECTIONS.colors);
	const { modes, multiMode } = ensureModes(collection, ['light', 'dark']);
	const colorByName = new Map<string, Variable>();

	setScaleVariables('primary', palette.primary, collection, modes, multiMode, colorByName);
	if (palette.accent) {
		setScaleVariables('accent', palette.accent, collection, modes, multiMode, colorByName);
	}
	setScaleVariables('neutral', palette.neutral, collection, modes, multiMode, colorByName);

	if (palette.semantic) {
		(['success', 'warn', 'error', 'info'] as SemanticName[]).forEach((name) => {
			setScaleVariables(name, palette.semantic![name], collection, modes, multiMode, colorByName);
		});
	}

	const semanticAliases = new Map<SemanticAliasName, Variable>();
	for (const [aliasName, mapping] of Object.entries(SEMANTIC_ALIASES)) {
		const lightVar = colorByName.get(mapping.light);
		const darkVar = colorByName.get(mapping.dark);
		if (!lightVar || !darkVar) continue;
		const v = setAliasVariable(aliasName, lightVar, darkVar, collection, modes, multiMode);
		semanticAliases.set(aliasName as SemanticAliasName, v);
	}

	return { collection, colorByName, semanticAliases };
}

export async function applySpacingVariables(base: 4 | 8): Promise<{
	collection: VariableCollection;
	spaceByStep: Map<SpaceStep, Variable>;
	radiusByName: Map<RadiusName, Variable>;
}> {
	const collection = await resetCollection(VARIABLE_COLLECTIONS.spacing);
	const [defaultMode] = collection.modes;
	collection.renameMode(defaultMode.modeId, 'default');
	const modeId = defaultMode.modeId;

	const spaceByStep = new Map<SpaceStep, Variable>();
	for (const step of SPACE_STEPS) {
		const v = figma.variables.createVariable(`space/${step}`, collection, 'FLOAT');
		v.setValueForMode(modeId, spaceValue(step, base));
		spaceByStep.set(step, v);
	}

	const radiusByName = new Map<RadiusName, Variable>();
	for (const [name, value] of Object.entries(RADIUS_TOKENS) as [RadiusName, number][]) {
		const v = figma.variables.createVariable(`radius/${name}`, collection, 'FLOAT');
		v.setValueForMode(modeId, value);
		radiusByName.set(name, v);
	}

	return { collection, spaceByStep, radiusByName };
}
