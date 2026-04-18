import { writable } from 'svelte/store';

const MODE_KEY = 'projeto2_mode';

export type Mode = 'template' | 'daily';

function getInitialMode(): Mode {
	if (typeof window === 'undefined') return 'template';
	try {
		const stored = localStorage.getItem(MODE_KEY);
		if (stored === 'template' || stored === 'daily') return stored;
	} catch {}
	return 'template';
}

export const mode = writable<Mode>(getInitialMode());

export function setMode(m: Mode): void {
	mode.set(m);
	try { localStorage.setItem(MODE_KEY, m); } catch {}
}
