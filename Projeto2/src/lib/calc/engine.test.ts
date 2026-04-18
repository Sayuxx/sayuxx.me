import { describe, it, expect } from 'vitest';
import {
	computeShiftBuckets,
	computeMonth,
	bucketsToGrossJPY,
	mergeIntervals,
	subtractBreaks,
	nightMinutesIn,
	splitAtThreshold,
	rangeToMinutes,
	emptyBuckets
} from './engine';
import type { Shift } from './types';

function makeShift(overrides: Partial<Shift> = {}): Shift {
	return {
		id: '1',
		date: '2026-04-01',
		range: { start: '09:00', end: '18:00' },
		breaks: [],
		dayType: 'regular',
		...overrides
	};
}

describe('mergeIntervals', () => {
	it('merges overlapping intervals', () => {
		expect(mergeIntervals([[720, 780], [750, 810]])).toEqual([[720, 810]]);
	});

	it('keeps disjoint intervals', () => {
		expect(mergeIntervals([[100, 200], [300, 400]])).toEqual([[100, 200], [300, 400]]);
	});

	it('returns empty for empty input', () => {
		expect(mergeIntervals([])).toEqual([]);
	});

	it('drops zero-length intervals', () => {
		expect(mergeIntervals([[100, 100], [200, 300]])).toEqual([[200, 300]]);
	});
});

describe('subtractBreaks', () => {
	it('returns shift when no breaks', () => {
		expect(subtractBreaks([540, 1080], [])).toEqual([[540, 1080]]);
	});

	it('carves out a middle break', () => {
		expect(subtractBreaks([540, 1080], [[720, 780]])).toEqual([
			[540, 720],
			[780, 1080]
		]);
	});

	it('ignores break entirely outside shift', () => {
		expect(subtractBreaks([540, 1080], [[100, 200]])).toEqual([[540, 1080]]);
	});

	it('clips a break that extends beyond shift', () => {
		expect(subtractBreaks([540, 1080], [[500, 600]])).toEqual([[600, 1080]]);
	});

	it('merges overlapping breaks before subtracting', () => {
		expect(subtractBreaks([540, 1080], [[720, 780], [750, 810]])).toEqual([
			[540, 720],
			[810, 1080]
		]);
	});

	it('returns empty when break covers whole shift', () => {
		expect(subtractBreaks([720, 780], [[660, 840]])).toEqual([]);
	});
});

describe('nightMinutesIn', () => {
	it('returns 0 when interval is entirely in daytime', () => {
		expect(nightMinutesIn([540, 1080])).toBe(0);
	});

	it('computes overlap with single-day night window', () => {
		expect(nightMinutesIn([1260, 1380])).toBe(60);
	});

	it('handles interval crossing midnight (22:00 to 06:00)', () => {
		expect(nightMinutesIn([1320, 1800])).toBe(420);
	});

	it('handles interval spanning two night windows', () => {
		expect(nightMinutesIn([1320, 1320 + 2880])).toBe(840);
	});
});

describe('splitAtThreshold', () => {
	it('keeps all in before when under threshold', () => {
		const r = splitAtThreshold([[0, 100], [200, 300]], 500, 0);
		expect(r.before).toEqual([[0, 100], [200, 300]]);
		expect(r.after).toEqual([]);
	});

	it('puts all in after when accumulated already exceeds threshold', () => {
		const r = splitAtThreshold([[0, 100]], 50, 60);
		expect(r.before).toEqual([]);
		expect(r.after).toEqual([[0, 100]]);
	});

	it('splits an interval in the middle', () => {
		const r = splitAtThreshold([[0, 100]], 60, 0);
		expect(r.before).toEqual([[0, 60]]);
		expect(r.after).toEqual([[60, 100]]);
	});

	it('carries accumulated into split', () => {
		const r = splitAtThreshold([[0, 100]], 100, 50);
		expect(r.before).toEqual([[0, 50]]);
		expect(r.after).toEqual([[50, 100]]);
	});
});

describe('computeShiftBuckets — basic day work', () => {
	it('9-18 break 12-13 → 8h regular day', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '18:00' },
			breaks: [{ start: '12:00', end: '13:00' }]
		});
		const { buckets, otAddedMin } = computeShiftBuckets(shift, 0);
		expect(buckets).toEqual({ ...emptyBuckets(), regularDayMin: 480 });
		expect(otAddedMin).toBe(0);
	});

	it('9-20 break 12-13 → 8h regular + 2h overtime, all day', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '20:00' },
			breaks: [{ start: '12:00', end: '13:00' }]
		});
		const { buckets, otAddedMin } = computeShiftBuckets(shift, 0);
		expect(buckets.regularDayMin).toBe(480);
		expect(buckets.overtimeDayMin).toBe(120);
		expect(buckets.regularNightMin).toBe(0);
		expect(buckets.overtimeNightMin).toBe(0);
		expect(otAddedMin).toBe(120);
	});

	it('breaks before/after shift are ignored', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '18:00' },
			breaks: [
				{ start: '08:00', end: '09:00' },
				{ start: '18:30', end: '19:00' }
			]
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(buckets.regularDayMin).toBe(480);
		expect(buckets.overtimeDayMin).toBe(60);
	});

	it('overlapping breaks are merged before subtracting', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '18:00' },
			breaks: [
				{ start: '12:00', end: '13:00' },
				{ start: '12:30', end: '13:30' }
			]
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(buckets.regularDayMin).toBe(450);
		expect(buckets.overtimeDayMin).toBe(0);
	});

	it('shift fully covered by break → all zeros', () => {
		const shift = makeShift({
			range: { start: '12:00', end: '13:00' },
			breaks: [{ start: '11:00', end: '14:00' }]
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(buckets).toEqual(emptyBuckets());
	});
});

describe('computeShiftBuckets — night split', () => {
	it('13-23 break 18-19 → 8h regular day + 1h overtime night', () => {
		const shift = makeShift({
			range: { start: '13:00', end: '23:00' },
			breaks: [{ start: '18:00', end: '19:00' }]
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(buckets.regularDayMin).toBe(480);
		expect(buckets.regularNightMin).toBe(0);
		expect(buckets.overtimeDayMin).toBe(0);
		expect(buckets.overtimeNightMin).toBe(60);
	});

	it('22-06 no break → 7h regular night + 1h regular day', () => {
		const shift = makeShift({
			range: { start: '22:00', end: '06:00' },
			breaks: []
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(buckets.regularDayMin).toBe(60);
		expect(buckets.regularNightMin).toBe(420);
		expect(buckets.overtimeDayMin).toBe(0);
		expect(buckets.overtimeNightMin).toBe(0);
	});

	it('19-05 with break 23:00-23:30 → break reduces only night bucket', () => {
		const shift = makeShift({
			range: { start: '19:00', end: '05:00' },
			breaks: [{ start: '23:00', end: '23:30' }]
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(buckets.regularDayMin).toBe(180);
		expect(buckets.regularNightMin).toBe(300);
		expect(buckets.overtimeNightMin).toBe(90);
		expect(buckets.overtimeDayMin).toBe(0);
	});

	it('22-06 shift with break 02:00-03:00 normalizes break to day 2', () => {
		const shift = makeShift({
			range: { start: '22:00', end: '06:00' },
			breaks: [{ start: '02:00', end: '03:00' }]
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		const totalMinWorked =
			buckets.regularDayMin +
			buckets.regularNightMin +
			buckets.overtimeDayMin +
			buckets.overtimeNightMin;
		expect(totalMinWorked).toBe(420);
		expect(buckets.regularNightMin).toBe(360);
		expect(buckets.regularDayMin).toBe(60);
	});
});

describe('computeShiftBuckets — legal holiday', () => {
	it('9-18 break 12-13 on holiday → 8h holidayDay, no overtime split', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '18:00' },
			breaks: [{ start: '12:00', end: '13:00' }],
			dayType: 'legalHoliday'
		});
		const { buckets, otAddedMin } = computeShiftBuckets(shift, 0);
		expect(buckets.holidayDayMin).toBe(480);
		expect(buckets.holidayNightMin).toBe(0);
		expect(buckets.overtimeDayMin).toBe(0);
		expect(buckets.regularDayMin).toBe(0);
		expect(otAddedMin).toBe(0);
	});

	it('9-20 on holiday → 10h all holidayDay (holiday has no 8h split)', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '20:00' },
			dayType: 'legalHoliday'
		});
		const { buckets, otAddedMin } = computeShiftBuckets(shift, 0);
		expect(buckets.holidayDayMin).toBe(660);
		expect(buckets.overtimeDayMin).toBe(0);
		expect(otAddedMin).toBe(0);
	});

	it('19-23 on holiday → 3h holidayDay + 1h holidayNight', () => {
		const shift = makeShift({
			range: { start: '19:00', end: '23:00' },
			dayType: 'legalHoliday'
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(buckets.holidayDayMin).toBe(180);
		expect(buckets.holidayNightMin).toBe(60);
	});
});

describe('computeShiftBuckets — saturday bonus', () => {
	it('9-18 break 12-13 with saturday bonus → 8h saturdayDay, no overtime split', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '18:00' },
			breaks: [{ start: '12:00', end: '13:00' }],
			dayType: 'saturdayBonus'
		});
		const { buckets, otAddedMin } = computeShiftBuckets(shift, 0);
		expect(buckets.saturdayDayMin).toBe(480);
		expect(buckets.saturdayNightMin).toBe(0);
		expect(buckets.regularDayMin).toBe(0);
		expect(buckets.overtimeDayMin).toBe(0);
		expect(otAddedMin).toBe(0);
	});

	it('9-20 saturday → 11h all saturdayDay (no 8h split)', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '20:00' },
			dayType: 'saturdayBonus'
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(buckets.saturdayDayMin).toBe(660);
		expect(buckets.overtimeDayMin).toBe(0);
	});

	it('19-23 saturday → 3h saturdayDay + 1h saturdayNight', () => {
		const shift = makeShift({
			range: { start: '19:00', end: '23:00' },
			dayType: 'saturdayBonus'
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(buckets.saturdayDayMin).toBe(180);
		expect(buckets.saturdayNightMin).toBe(60);
	});

	it('saturday shift does not increment overtime accumulator', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '22:00' },
			dayType: 'saturdayBonus'
		});
		const { otAddedMin } = computeShiftBuckets(shift, 0);
		expect(otAddedMin).toBe(0);
	});
});

describe('computeShiftBuckets — monthly 60h overtime threshold', () => {
	it('OT within limit when accumulator below threshold', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '20:00' },
			breaks: [{ start: '12:00', end: '13:00' }]
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(buckets.overtimeDayMin).toBe(120);
		expect(buckets.overtimeHeavyDayMin).toBe(0);
	});

	it('splits OT across 60h threshold mid-shift', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '20:00' },
			breaks: [{ start: '12:00', end: '13:00' }]
		});
		const { buckets } = computeShiftBuckets(shift, 3540);
		expect(buckets.regularDayMin).toBe(480);
		expect(buckets.overtimeDayMin).toBe(60);
		expect(buckets.overtimeHeavyDayMin).toBe(60);
	});

	it('OT entirely heavy when accumulator already over threshold', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '20:00' },
			breaks: [{ start: '12:00', end: '13:00' }]
		});
		const { buckets } = computeShiftBuckets(shift, 3600);
		expect(buckets.overtimeDayMin).toBe(0);
		expect(buckets.overtimeHeavyDayMin).toBe(120);
	});

	it('splits heavy OT across day/night boundary', () => {
		const shift = makeShift({
			range: { start: '14:00', end: '23:30' },
			breaks: []
		});
		const { buckets } = computeShiftBuckets(shift, 3600);
		expect(buckets.regularDayMin).toBe(480);
		expect(buckets.regularNightMin).toBe(0);
		expect(buckets.overtimeHeavyDayMin).toBe(0);
		expect(buckets.overtimeHeavyNightMin).toBe(90);
	});
});

describe('computeMonth — accumulator behavior', () => {
	it('holiday shifts do not increment overtime accumulator', () => {
		const shifts: Shift[] = [
			makeShift({
				id: '1',
				date: '2026-04-01',
				range: { start: '09:00', end: '21:00' }
			}),
			makeShift({
				id: '2',
				date: '2026-04-02',
				range: { start: '09:00', end: '21:00' },
				dayType: 'legalHoliday'
			}),
			makeShift({
				id: '3',
				date: '2026-04-03',
				range: { start: '09:00', end: '21:00' }
			})
		];
		const result = computeMonth(shifts, 1200);
		expect(result.totalOvertimeMin).toBe(480);
		expect(result.totalBuckets.holidayDayMin).toBe(720);
		expect(result.totalBuckets.overtimeHeavyDayMin).toBe(0);
	});

	it('processes shifts in date order regardless of input order', () => {
		const shifts: Shift[] = [
			makeShift({ id: 'b', date: '2026-04-05', range: { start: '09:00', end: '19:00' } }),
			makeShift({ id: 'a', date: '2026-04-02', range: { start: '09:00', end: '19:00' } })
		];
		const result = computeMonth(shifts, 1200);
		expect(result.days[0].date).toBe('2026-04-02');
		expect(result.days[1].date).toBe('2026-04-05');
	});

	it('flags crossedOvertimeThreshold when monthly OT exceeds 60h', () => {
		const shifts: Shift[] = Array.from({ length: 16 }, (_, i) => ({
			id: String(i),
			date: `2026-04-${String(i + 1).padStart(2, '0')}`,
			range: { start: '09:00', end: '21:00' },
			breaks: [],
			dayType: 'regular'
		}));
		const result = computeMonth(shifts, 1200);
		expect(result.totalOvertimeMin).toBe(16 * 240);
		expect(result.crossedOvertimeThreshold).toBe(true);
		expect(result.totalBuckets.overtimeDayMin).toBe(3600);
		expect(result.totalBuckets.overtimeHeavyDayMin).toBe(16 * 240 - 3600);
	});
});

describe('bucketsToGrossJPY — monetary checks', () => {
	it('13-23 break 18-19 @ ¥1200/h → ¥11400', () => {
		const shift = makeShift({
			range: { start: '13:00', end: '23:00' },
			breaks: [{ start: '18:00', end: '19:00' }]
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(bucketsToGrossJPY(buckets, 1200)).toBeCloseTo(11400, 2);
	});

	it('saturday 9-18 break 12-13 @ ¥1200/h → ¥12000', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '18:00' },
			breaks: [{ start: '12:00', end: '13:00' }],
			dayType: 'saturdayBonus'
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(bucketsToGrossJPY(buckets, 1200)).toBeCloseTo(12000, 2);
	});

	it('saturday 19-23 @ ¥1200/h → ¥6300', () => {
		const shift = makeShift({
			range: { start: '19:00', end: '23:00' },
			dayType: 'saturdayBonus'
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(bucketsToGrossJPY(buckets, 1200)).toBeCloseTo(6300, 2);
	});

	it('9-18 break 12-13 holiday @ ¥1200/h → ¥12960', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '18:00' },
			breaks: [{ start: '12:00', end: '13:00' }],
			dayType: 'legalHoliday'
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(bucketsToGrossJPY(buckets, 1200)).toBeCloseTo(12960, 2);
	});

	it('9-20 break 12-13 with monthOt=3540 @ ¥1200/h → ¥12900', () => {
		const shift = makeShift({
			range: { start: '09:00', end: '20:00' },
			breaks: [{ start: '12:00', end: '13:00' }]
		});
		const { buckets } = computeShiftBuckets(shift, 3540);
		expect(bucketsToGrossJPY(buckets, 1200)).toBeCloseTo(12900, 2);
	});

	it('22-06 no break @ ¥1200/h → ¥11700', () => {
		const shift = makeShift({
			range: { start: '22:00', end: '06:00' }
		});
		const { buckets } = computeShiftBuckets(shift, 0);
		expect(bucketsToGrossJPY(buckets, 1200)).toBeCloseTo(11700, 2);
	});
});

describe('rangeToMinutes', () => {
	it('handles same-day range', () => {
		expect(rangeToMinutes({ start: '09:00', end: '18:00' })).toEqual([540, 1080]);
	});

	it('handles midnight-crossing range', () => {
		expect(rangeToMinutes({ start: '22:00', end: '06:00' })).toEqual([1320, 1800]);
	});
});
