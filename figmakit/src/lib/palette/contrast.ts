import { converter } from 'culori';

const toRgb = converter('rgb');

function relativeLuminance(hex: string): number {
	const rgb = toRgb(hex);
	if (!rgb) return 0;
	const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
	return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function contrastRatio(a: string, b: string): number {
	const la = relativeLuminance(a);
	const lb = relativeLuminance(b);
	const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
	return (hi + 0.05) / (lo + 0.05);
}

export function meetsAa(ratio: number): boolean {
	return ratio >= 4.5;
}

export function meetsAaa(ratio: number): boolean {
	return ratio >= 7;
}
