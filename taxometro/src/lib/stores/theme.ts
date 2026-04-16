import { writable } from 'svelte/store';

const THEME_KEY = 'taxometro_theme';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
	if (typeof window === 'undefined') return 'light';
	try {
		const stored = localStorage.getItem(THEME_KEY);
		if (stored === 'dark' || stored === 'light') return stored;
	} catch {}
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const theme = writable<Theme>(getInitialTheme());

export function toggleTheme(): void {
	theme.update((t) => {
		const next = t === 'light' ? 'dark' : 'light';
		try { localStorage.setItem(THEME_KEY, next); } catch {}
		return next;
	});
}

export function applyTheme(t: Theme): void {
	if (typeof document === 'undefined') return;
	document.documentElement.classList.toggle('dark', t === 'dark');
}
