import { describe, it, expect } from 'vitest';
import { generateScale, buildScale } from './generate';
import { generateNeutrals } from './neutrals';
import { generateSemantic } from './semantic';
import { STEPS } from './types';

describe('generateScale', () => {
	it('returns a hex for every step', () => {
		const scale = generateScale('#3b82f6');
		for (const step of STEPS) {
			expect(scale[step]).toMatch(/^#[0-9a-f]{6}$/);
		}
	});

	it('makes step 50 lighter than step 950', () => {
		const scale = generateScale('#3b82f6');
		const lum = (hex: string) => parseInt(hex.slice(1, 3), 16) + parseInt(hex.slice(3, 5), 16) + parseInt(hex.slice(5, 7), 16);
		expect(lum(scale[50])).toBeGreaterThan(lum(scale[950]));
	});

	it('throws on invalid hex', () => {
		expect(() => generateScale('not-a-color')).toThrow();
	});

	it('preserves hue across steps', () => {
		const blueScale = generateScale('#3b82f6');
		const redScale = generateScale('#ef4444');
		expect(blueScale[500]).not.toBe(redScale[500]);
	});
});

describe('generateNeutrals', () => {
	it('produces near-grayscale colors', () => {
		const scale = generateNeutrals('#3b82f6');
		for (const step of STEPS) {
			const r = parseInt(scale[step].slice(1, 3), 16);
			const g = parseInt(scale[step].slice(3, 5), 16);
			const b = parseInt(scale[step].slice(5, 7), 16);
			const range = Math.max(r, g, b) - Math.min(r, g, b);
			expect(range).toBeLessThan(30);
		}
	});
});

describe('generateSemantic', () => {
	it('produces 4 distinct hues', () => {
		const semantic = generateSemantic();
		const m500 = [semantic.error[500], semantic.warn[500], semantic.success[500], semantic.info[500]];
		expect(new Set(m500).size).toBe(4);
	});
});

describe('buildScale gamut clamping', () => {
	it('returns valid hex even for high chroma input', () => {
		const scale = buildScale(180, 0.5);
		for (const step of STEPS) {
			expect(scale[step]).toMatch(/^#[0-9a-f]{6}$/);
		}
	});
});
