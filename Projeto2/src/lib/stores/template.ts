import { writable } from 'svelte/store';
import type { ShiftTemplate } from '$lib/calc/template';

const TEMPLATE_KEY = 'projeto2_template';
const MONTH_KEY = 'projeto2_template_month';

function currentMonthISO(): string {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function defaultTemplate(): ShiftTemplate {
	return {
		range: { start: '09:00', end: '18:00' },
		breaks: [{ start: '12:00', end: '13:00' }],
		weekdays: [1, 2, 3, 4, 5],
		saturdayBonus: false
	};
}

function getInitialTemplate(): ShiftTemplate {
	if (typeof window === 'undefined') return defaultTemplate();
	try {
		const stored = localStorage.getItem(TEMPLATE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			if (parsed && parsed.range && Array.isArray(parsed.breaks) && Array.isArray(parsed.weekdays)) {
				return {
					range: parsed.range,
					breaks: parsed.breaks,
					weekdays: parsed.weekdays,
					saturdayBonus: parsed.saturdayBonus === true
				};
			}
		}
	} catch {}
	return defaultTemplate();
}

function getInitialMonth(): string {
	if (typeof window === 'undefined') return currentMonthISO();
	try {
		const stored = localStorage.getItem(MONTH_KEY);
		if (stored && /^\d{4}-\d{2}$/.test(stored)) return stored;
	} catch {}
	return currentMonthISO();
}

export const template = writable<ShiftTemplate>(getInitialTemplate());
export const templateMonth = writable<string>(getInitialMonth());

export function setTemplate(t: ShiftTemplate): void {
	template.set(t);
	try { localStorage.setItem(TEMPLATE_KEY, JSON.stringify(t)); } catch {}
}

export function setTemplateMonth(ym: string): void {
	templateMonth.set(ym);
	try { localStorage.setItem(MONTH_KEY, ym); } catch {}
}
