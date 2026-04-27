export const SPACE_STEPS = [4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80] as const;

export type SpaceStep = (typeof SPACE_STEPS)[number];

export const RADIUS_TOKENS = {
	sm: 4,
	md: 8,
	lg: 12,
	xl: 16,
	full: 9999
} as const;

export type RadiusName = keyof typeof RADIUS_TOKENS;
