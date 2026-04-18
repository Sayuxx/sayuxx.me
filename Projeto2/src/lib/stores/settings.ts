import { writable } from 'svelte/store';

const WAGE_KEY = 'projeto2_hourly_wage';

function getInitialWage(): number {
	if (typeof window === 'undefined') return 0;
	try {
		const stored = localStorage.getItem(WAGE_KEY);
		if (stored !== null) {
			const n = Number(stored);
			if (Number.isFinite(n) && n >= 0) return n;
		}
	} catch {}
	return 0;
}

export const hourlyWageJPY = writable<number>(getInitialWage());

export function setHourlyWage(value: number): void {
	const safe = Number.isFinite(value) && value >= 0 ? value : 0;
	hourlyWageJPY.set(safe);
	try { localStorage.setItem(WAGE_KEY, String(safe)); } catch {}
}
