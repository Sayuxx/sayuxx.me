export interface BrandColor {
	name: string;
	hex: string;
}

export const colorRoleName = (i: number): string => `color-${i + 1}`;
