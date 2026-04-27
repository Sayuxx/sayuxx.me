import { generateScale } from './generate';
import { generateNeutrals } from './neutrals';
import { generateSemantic } from './semantic';
import type { PaletteSet } from './types';

export interface BuildPaletteOptions {
	primaryHex: string;
	accentHex: string | null;
	includeSemantic: boolean;
}

export function buildPalette({
	primaryHex,
	accentHex,
	includeSemantic
}: BuildPaletteOptions): PaletteSet {
	return {
		primary: generateScale(primaryHex),
		accent: accentHex ? generateScale(accentHex) : null,
		neutral: generateNeutrals(primaryHex),
		semantic: includeSemantic ? generateSemantic() : null
	};
}

export type { ColorScale, PaletteSet, SemanticName, Step } from './types';
export { STEPS } from './types';
