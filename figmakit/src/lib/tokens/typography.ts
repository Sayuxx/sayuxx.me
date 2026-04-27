export const TYPE_NAMES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] as const;
export type TypeName = (typeof TYPE_NAMES)[number];

const BASE_SIZE = 16;
const BASE_INDEX = 2;

export interface TypeStep {
	name: TypeName;
	fontSize: number;
	lineHeight: number;
}

function lineHeightFor(size: number): number {
	if (size <= 14) return Math.round(size * 1.6);
	if (size <= 20) return Math.round(size * 1.5);
	if (size <= 28) return Math.round(size * 1.35);
	if (size <= 40) return Math.round(size * 1.25);
	return Math.round(size * 1.15);
}

export function buildTypeScale(ratio: 1.2 | 1.333): TypeStep[] {
	return TYPE_NAMES.map((name, i) => {
		const fontSize = Math.round(BASE_SIZE * Math.pow(ratio, i - BASE_INDEX));
		return { name, fontSize, lineHeight: lineHeightFor(fontSize) };
	});
}
