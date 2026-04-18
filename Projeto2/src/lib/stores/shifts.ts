import { writable } from 'svelte/store';
import type { Shift } from '$lib/calc/types';

const SHIFTS_KEY = 'projeto2_shifts';

function migrateShift(raw: unknown): Shift | null {
	if (!raw || typeof raw !== 'object') return null;
	const r = raw as Record<string, unknown>;
	if (typeof r.id !== 'string' || typeof r.date !== 'string') return null;
	if (!r.range || typeof r.range !== 'object') return null;
	let dayType: Shift['dayType'] = 'regular';
	if (r.dayType === 'legalHoliday' || r.dayType === 'saturdayBonus' || r.dayType === 'regular') {
		dayType = r.dayType;
	} else if (r.isLegalHoliday === true) {
		dayType = 'legalHoliday';
	}
	return {
		id: r.id,
		date: r.date,
		range: r.range as Shift['range'],
		breaks: Array.isArray(r.breaks) ? (r.breaks as Shift['breaks']) : [],
		dayType
	};
}

function getInitialShifts(): Shift[] {
	if (typeof window === 'undefined') return [];
	try {
		const stored = localStorage.getItem(SHIFTS_KEY);
		if (!stored) return [];
		const parsed = JSON.parse(stored);
		if (Array.isArray(parsed)) {
			return parsed.map(migrateShift).filter((s): s is Shift => s !== null);
		}
	} catch {}
	return [];
}

function persist(items: Shift[]): void {
	try { localStorage.setItem(SHIFTS_KEY, JSON.stringify(items)); } catch {}
}

export const shifts = writable<Shift[]>(getInitialShifts());

let nextId = Date.now();

export function addShift(shift: Omit<Shift, 'id'>): void {
	shifts.update((items) => {
		const next = [...items, { ...shift, id: String(nextId++) }];
		persist(next);
		return next;
	});
}

export function removeShift(id: string): void {
	shifts.update((items) => {
		const next = items.filter((s) => s.id !== id);
		persist(next);
		return next;
	});
}

export function updateShift(id: string, updates: Partial<Omit<Shift, 'id'>>): void {
	shifts.update((items) => {
		const next = items.map((s) => (s.id === id ? { ...s, ...updates } : s));
		persist(next);
		return next;
	});
}

export function clearShifts(): void {
	shifts.set([]);
	persist([]);
}

export function replaceMonthShifts(yearMonth: string, generated: Omit<Shift, 'id'>[]): void {
	shifts.update((items) => {
		const preserved = items.filter((s) => !s.date.startsWith(yearMonth + '-'));
		const added: Shift[] = generated.map((g) => ({ ...g, id: String(nextId++) }));
		const next = [...preserved, ...added];
		persist(next);
		return next;
	});
}
