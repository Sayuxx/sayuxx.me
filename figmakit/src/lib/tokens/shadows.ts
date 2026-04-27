export interface ShadowLayer {
	offsetX: number;
	offsetY: number;
	blur: number;
	spread: number;
	colorRgba: { r: number; g: number; b: number; a: number };
}

export interface ShadowToken {
	name: 'sm' | 'md' | 'lg' | 'xl';
	layers: ShadowLayer[];
}

const black = (a: number) => ({ r: 0, g: 0, b: 0, a });

export const SHADOW_TOKENS: ShadowToken[] = [
	{
		name: 'sm',
		layers: [{ offsetX: 0, offsetY: 1, blur: 2, spread: 0, colorRgba: black(0.05) }]
	},
	{
		name: 'md',
		layers: [
			{ offsetX: 0, offsetY: 4, blur: 6, spread: -1, colorRgba: black(0.1) },
			{ offsetX: 0, offsetY: 2, blur: 4, spread: -2, colorRgba: black(0.05) }
		]
	},
	{
		name: 'lg',
		layers: [
			{ offsetX: 0, offsetY: 10, blur: 15, spread: -3, colorRgba: black(0.1) },
			{ offsetX: 0, offsetY: 4, blur: 6, spread: -4, colorRgba: black(0.05) }
		]
	},
	{
		name: 'xl',
		layers: [
			{ offsetX: 0, offsetY: 20, blur: 25, spread: -5, colorRgba: black(0.12) },
			{ offsetX: 0, offsetY: 10, blur: 10, spread: -5, colorRgba: black(0.06) }
		]
	}
];
