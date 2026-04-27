export type UiToCode =
	| { type: 'ping' }
	| { type: 'generate-foundations'; payload: GenerateFoundationsPayload }
	| { type: 'insert-style-guide' };

export type CodeToUi =
	| { type: 'pong' }
	| { type: 'foundations-ready' }
	| { type: 'style-guide-ready' }
	| { type: 'error'; message: string }
	| { type: 'restored'; primaryHex: string | null };

export interface GenerateFoundationsPayload {
	primaryHex: string;
	accentHex: string | null;
	includeSemantic: boolean;
	spacingBase: 4 | 8;
	typeRatio: 1.2 | 1.333;
}

export const VARIABLE_COLLECTIONS = {
	colors: 'figmakit/colors',
	spacing: 'figmakit/spacing'
} as const;
