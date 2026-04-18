import { describe, it, expect } from 'vitest';
import { expandTemplate, daysInMonth, shiftIsInMonth } from './template';
import type { ShiftTemplate } from './template';

const baseTemplate: ShiftTemplate = {
	range: { start: '09:00', end: '18:00' },
	breaks: [{ start: '12:00', end: '13:00' }],
	weekdays: [1, 2, 3, 4, 5],
	saturdayBonus: false
};

describe('daysInMonth', () => {
	it('handles 30-day months', () => {
		expect(daysInMonth(2026, 4)).toBe(30);
	});

	it('handles 31-day months', () => {
		expect(daysInMonth(2026, 1)).toBe(31);
	});

	it('handles leap February', () => {
		expect(daysInMonth(2024, 2)).toBe(29);
	});

	it('handles non-leap February', () => {
		expect(daysInMonth(2026, 2)).toBe(28);
	});
});

describe('expandTemplate', () => {
	it('generates shifts only on matching weekdays', () => {
		const shifts = expandTemplate(baseTemplate, '2026-04');
		expect(shifts.length).toBe(22);
		for (const s of shifts) {
			const dow = new Date(s.date).getUTCDay();
			expect([1, 2, 3, 4, 5]).toContain(dow);
		}
	});

	it('copies template range and breaks into each generated shift', () => {
		const shifts = expandTemplate(baseTemplate, '2026-04');
		const first = shifts[0];
		expect(first.range).toEqual({ start: '09:00', end: '18:00' });
		expect(first.breaks).toEqual([{ start: '12:00', end: '13:00' }]);
		expect(first.dayType).toBe('regular');
	});

	it('flags saturdays as saturdayBonus when template opts in', () => {
		const shifts = expandTemplate(
			{ ...baseTemplate, weekdays: [0, 1, 2, 3, 4, 5, 6], saturdayBonus: true },
			'2026-04'
		);
		const saturdays = shifts.filter((s) => new Date(s.date + 'T00:00:00').getDay() === 6);
		expect(saturdays.length).toBeGreaterThan(0);
		for (const s of saturdays) {
			expect(s.dayType).toBe('saturdayBonus');
		}
		const nonSaturdays = shifts.filter((s) => new Date(s.date + 'T00:00:00').getDay() !== 6);
		for (const s of nonSaturdays) {
			expect(s.dayType).toBe('regular');
		}
	});

	it('keeps saturdays as regular when saturdayBonus is off', () => {
		const shifts = expandTemplate(
			{ ...baseTemplate, weekdays: [6], saturdayBonus: false },
			'2026-04'
		);
		for (const s of shifts) {
			expect(s.dayType).toBe('regular');
		}
	});

	it('returns no shifts when weekdays list is empty', () => {
		const shifts = expandTemplate({ ...baseTemplate, weekdays: [] }, '2026-04');
		expect(shifts).toEqual([]);
	});

	it('handles weekends-only template', () => {
		const shifts = expandTemplate({ ...baseTemplate, weekdays: [0, 6] }, '2026-04');
		expect(shifts.length).toBe(8);
	});

	it('returns empty for invalid month string', () => {
		expect(expandTemplate(baseTemplate, 'not-a-date')).toEqual([]);
		expect(expandTemplate(baseTemplate, '2026-13')).toEqual([]);
	});

	it('pads month and day in ISO output', () => {
		const shifts = expandTemplate(baseTemplate, '2026-04');
		expect(shifts[0].date).toMatch(/^2026-04-\d{2}$/);
	});
});

describe('shiftIsInMonth', () => {
	it('matches dates within the month', () => {
		expect(shiftIsInMonth('2026-04-15', '2026-04')).toBe(true);
	});

	it('rejects other months', () => {
		expect(shiftIsInMonth('2026-05-01', '2026-04')).toBe(false);
		expect(shiftIsInMonth('2026-03-30', '2026-04')).toBe(false);
	});
});
