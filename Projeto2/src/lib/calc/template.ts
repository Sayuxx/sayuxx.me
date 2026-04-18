import type { Shift, TimeRange } from './types';

export interface ShiftTemplate {
	range: TimeRange;
	breaks: TimeRange[];
	weekdays: number[];
	saturdayBonus: boolean;
}

export function daysInMonth(year: number, month: number): number {
	return new Date(year, month, 0).getDate();
}

export function expandTemplate(
	template: ShiftTemplate,
	yearMonth: string
): Omit<Shift, 'id'>[] {
	const [yStr, mStr] = yearMonth.split('-');
	const year = Number(yStr);
	const month = Number(mStr);
	if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return [];
	if (template.weekdays.length === 0) return [];

	const weekdaySet = new Set(template.weekdays);
	const result: Omit<Shift, 'id'>[] = [];
	const total = daysInMonth(year, month);

	for (let d = 1; d <= total; d++) {
		const date = new Date(year, month - 1, d);
		const dow = date.getDay();
		if (weekdaySet.has(dow)) {
			const iso = `${yStr}-${mStr.padStart(2, '0')}-${String(d).padStart(2, '0')}`;
			result.push({
				date: iso,
				range: { start: template.range.start, end: template.range.end },
				breaks: template.breaks.map((b) => ({ start: b.start, end: b.end })),
				dayType: template.saturdayBonus && dow === 6 ? 'saturdayBonus' : 'regular'
			});
		}
	}

	return result;
}

export function shiftIsInMonth(shiftDate: string, yearMonth: string): boolean {
	return shiftDate.startsWith(yearMonth + '-');
}
