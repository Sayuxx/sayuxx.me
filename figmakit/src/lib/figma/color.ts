export function hexToRgb(hex: string): RGB {
	const h = hex.replace('#', '');
	if (h.length !== 6) throw new Error(`expected 6-char hex, got: ${hex}`);
	return {
		r: parseInt(h.slice(0, 2), 16) / 255,
		g: parseInt(h.slice(2, 4), 16) / 255,
		b: parseInt(h.slice(4, 6), 16) / 255
	};
}
