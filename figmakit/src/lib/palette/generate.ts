import { converter } from 'culori';
import type { Oklch } from 'culori';

const toOklch = converter('oklch');

export function toOklchOrThrow(hex: string): Oklch {
	const c = toOklch(hex) as Oklch | undefined;
	if (!c) throw new Error(`invalid color: ${hex}`);
	return c;
}
