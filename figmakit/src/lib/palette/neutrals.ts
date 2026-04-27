import { buildScale, toOklchOrThrow } from './generate';
import type { ColorScale } from './types';

const NEUTRAL_CHROMA = 0.008;

export function generateNeutrals(primaryHex: string): ColorScale {
	const base = toOklchOrThrow(primaryHex);
	const hue = base.h ?? 0;
	return buildScale(hue, NEUTRAL_CHROMA);
}
