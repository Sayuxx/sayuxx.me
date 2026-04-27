import { colorRoleName } from '../palette/types';
import { RADIUS_TOKENS, SPACE_STEPS, type RadiusName, type SpaceStep } from '../tokens/spacing';
import { VARIABLE_COLLECTIONS } from '../messaging';
import { hexToRgb } from './color';

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

function defaultMode(collection: VariableCollection): string {
	const [first, ...rest] = collection.modes;
	collection.renameMode(first.modeId, 'default');
	for (const extra of rest) collection.removeMode(extra.modeId);
	return first.modeId;
}

export async function applyBrandVariables(colors: string[]): Promise<{
	collection: VariableCollection;
	colorByName: Map<string, Variable>;
}> {
	const collection = await resetCollection(VARIABLE_COLLECTIONS.colors);
	const modeId = defaultMode(collection);
	const colorByName = new Map<string, Variable>();
	colors.forEach((hex, i) => {
		const name = colorRoleName(i);
		const v = figma.variables.createVariable(name, collection, 'COLOR');
		v.setValueForMode(modeId, hexToRgb(hex));
		colorByName.set(name, v);
	});
	return { collection, colorByName };
}

export async function applySpacingVariables(): Promise<{
	collection: VariableCollection;
	spaceByStep: Map<SpaceStep, Variable>;
	radiusByName: Map<RadiusName, Variable>;
}> {
	const collection = await resetCollection(VARIABLE_COLLECTIONS.spacing);
	const modeId = defaultMode(collection);

	const spaceByStep = new Map<SpaceStep, Variable>();
	for (const step of SPACE_STEPS) {
		const v = figma.variables.createVariable(`space/${step}`, collection, 'FLOAT');
		v.setValueForMode(modeId, step);
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
