import { describe, it, expect } from 'vitest';
import { colorRoleName } from './types';
import { toOklchOrThrow } from './generate';
import { hexToRgb } from '../figma/color';

describe('colorRoleName', () => {
	it('maps zero-based index to color-N', () => {
		expect(colorRoleName(0)).toBe('color-1');
		expect(colorRoleName(1)).toBe('color-2');
		expect(colorRoleName(9)).toBe('color-10');
	});
});

describe('toOklchOrThrow', () => {
	it('parses valid hex', () => {
		const c = toOklchOrThrow('#3b82f6');
		expect(c.mode).toBe('oklch');
		expect(typeof c.l).toBe('number');
	});

	it('throws on invalid input', () => {
		expect(() => toOklchOrThrow('not-a-color')).toThrow();
	});
});

describe('hexToRgb', () => {
	it('handles a 6-char hex', () => {
		const rgb = hexToRgb('#ff8000');
		expect(rgb.r).toBeCloseTo(1);
		expect(rgb.g).toBeCloseTo(0.502, 2);
		expect(rgb.b).toBe(0);
	});

	it('strips leading #', () => {
		expect(() => hexToRgb('ffffff')).not.toThrow();
	});

	it('throws on length != 6', () => {
		expect(() => hexToRgb('#abc')).toThrow();
	});
});
