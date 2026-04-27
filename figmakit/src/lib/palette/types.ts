export type Step = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export const STEPS: Step[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export type ColorScale = Record<Step, string>;

export type SemanticName = 'success' | 'warn' | 'error' | 'info';

export interface PaletteSet {
	primary: ColorScale;
	accent: ColorScale | null;
	neutral: ColorScale;
	semantic: Record<SemanticName, ColorScale> | null;
}
