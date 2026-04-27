import type { TypeName } from '../tokens/typography';
import { TYPE_NAMES } from '../tokens/typography';
import { RADIUS_TOKENS, SPACE_STEPS, type RadiusName, type SpaceStep } from '../tokens/spacing';
import { SHADOW_TOKENS } from '../tokens/shadows';
import { VARIABLE_COLLECTIONS } from '../messaging';

export interface LookupResult {
	colorByName: Map<string, Variable>;
	spaceByStep: Map<SpaceStep, Variable>;
	radiusByName: Map<RadiusName, Variable>;
	textStyles: Map<TypeName, TextStyle>;
	effectStyles: Map<string, EffectStyle>;
}

export async function lookupExisting(): Promise<LookupResult> {
	const collections = await figma.variables.getLocalVariableCollectionsAsync();
	const colors = collections.find((c) => c.name === VARIABLE_COLLECTIONS.colors);
	const spacing = collections.find((c) => c.name === VARIABLE_COLLECTIONS.spacing);

	const colorByName = new Map<string, Variable>();
	const spaceByStep = new Map<SpaceStep, Variable>();
	const radiusByName = new Map<RadiusName, Variable>();

	if (colors) {
		const colorVars: Variable[] = [];
		for (const id of colors.variableIds) {
			const v = await figma.variables.getVariableByIdAsync(id);
			if (v) colorVars.push(v);
		}
		colorVars.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
		for (const v of colorVars) colorByName.set(v.name, v);
	}

	if (spacing) {
		for (const id of spacing.variableIds) {
			const v = await figma.variables.getVariableByIdAsync(id);
			if (!v) continue;
			const [kind, key] = v.name.split('/');
			if (kind === 'space') {
				const n = parseInt(key, 10);
				if ((SPACE_STEPS as readonly number[]).includes(n)) spaceByStep.set(n as SpaceStep, v);
			} else if (kind === 'radius') {
				if (key in RADIUS_TOKENS) radiusByName.set(key as RadiusName, v);
			}
		}
	}

	const textStyles = new Map<TypeName, TextStyle>();
	for (const style of await figma.getLocalTextStylesAsync()) {
		const match = /^text\/(.+)$/.exec(style.name);
		if (match && (TYPE_NAMES as readonly string[]).includes(match[1])) {
			textStyles.set(match[1] as TypeName, style);
		}
	}

	const effectStyles = new Map<string, EffectStyle>();
	for (const style of await figma.getLocalEffectStylesAsync()) {
		const match = /^shadow\/(.+)$/.exec(style.name);
		if (match && SHADOW_TOKENS.some((t) => t.name === match[1])) {
			effectStyles.set(match[1], style);
		}
	}

	return { colorByName, spaceByStep, radiusByName, textStyles, effectStyles };
}
