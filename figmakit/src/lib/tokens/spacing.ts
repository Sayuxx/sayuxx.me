export const SPACE_STEPS = [0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24] as const;

export type SpaceStep = (typeof SPACE_STEPS)[number];

export const RADIUS_TOKENS = {
	sm: 4,
	md: 8,
	lg: 12,
	xl: 16,
	full: 9999
} as const;

export type RadiusName = keyof typeof RADIUS_TOKENS;

export function spaceValue(step: SpaceStep, base: 4 | 8): number {
	return step * base;
}
