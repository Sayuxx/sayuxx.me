export type UiToCode =
	| { type: 'ping' }
	| { type: 'request-fonts' }
	| { type: 'generate-foundations'; payload: GenerateFoundationsPayload }
	| { type: 'insert-style-guide' };

export type CodeToUi =
	| { type: 'pong' }
	| { type: 'fonts'; families: string[] }
	| { type: 'foundations-ready' }
	| { type: 'style-guide-ready' }
	| { type: 'error'; message: string }
	| { type: 'restored'; colors: string[] | null; fontFamily: string | null };

export interface GenerateFoundationsPayload {
	colors: string[];
	typeRatio: 1.2 | 1.333;
	fontFamily: string;
}

export const VARIABLE_COLLECTIONS = {
	colors: 'figmakit/colors',
	spacing: 'figmakit/spacing'
} as const;
