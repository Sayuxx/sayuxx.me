import { converter, formatHex, clampChroma } from 'culori';
import type { Oklch } from 'culori';
import { STEPS, type ColorScale, type Step } from './types';

const toOklch = converter('oklch');

const L_CURVE: Record<Step, number> = {
	50: 0.98,
	100: 0.95,
	200: 0.89,
	300: 0.8,
	400: 0.68,
	500: 0.56,
	600: 0.46,
	700: 0.38,
	800: 0.3,
	900: 0.22,
	950: 0.15
};

const C_FACTOR: Record<Step, number> = {
	50: 0.2,
	100: 0.4,
	200: 0.7,
	300: 0.9,
	400: 1.0,
	500: 1.0,
	600: 0.95,
	700: 0.85,
	800: 0.7,
	900: 0.55,
	950: 0.45
};

export interface ScaleOptions {
	hue?: number;
	chroma?: number;
}

export function toOklchOrThrow(hex: string): Oklch {
	const c = toOklch(hex) as Oklch | undefined;
	if (!c) throw new Error(`invalid color: ${hex}`);
	return c;
}

export function buildScale(hue: number, chroma: number): ColorScale {
	const result = {} as ColorScale;
	for (const step of STEPS) {
		const oklch: Oklch = {
			mode: 'oklch',
			l: L_CURVE[step],
			c: chroma * C_FACTOR[step],
			h: hue
		};
		const clamped = clampChroma(oklch, 'oklch');
		result[step] = formatHex(clamped)!;
	}
	return result;
}

export function generateScale(baseHex: string): ColorScale {
	const base = toOklchOrThrow(baseHex);
	const hue = base.h ?? 0;
	const chroma = base.c ?? 0;
	return buildScale(hue, chroma);
}
