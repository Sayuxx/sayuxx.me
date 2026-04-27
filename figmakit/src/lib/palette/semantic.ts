import { buildScale } from './generate';
import type { ColorScale, SemanticName } from './types';

const SEMANTIC_HUES: Record<SemanticName, number> = {
	error: 25,
	warn: 80,
	success: 145,
	info: 240
};

const SEMANTIC_CHROMA = 0.16;

export function generateSemantic(): Record<SemanticName, ColorScale> {
	return {
		error: buildScale(SEMANTIC_HUES.error, SEMANTIC_CHROMA),
		warn: buildScale(SEMANTIC_HUES.warn, SEMANTIC_CHROMA),
		success: buildScale(SEMANTIC_HUES.success, SEMANTIC_CHROMA),
		info: buildScale(SEMANTIC_HUES.info, SEMANTIC_CHROMA)
	};
}
