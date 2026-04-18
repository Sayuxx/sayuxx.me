import type { Buckets, DayResult, MonthResult, Shift, TimeRange } from './types';

export const REGULAR_LIMIT_MIN = 8 * 60;
export const MONTHLY_OT_HEAVY_THRESHOLD_MIN = 60 * 60;

export const MULTIPLIERS = {
	regularDay: 1.0,
	regularNight: 1.25,
	overtimeDay: 1.25,
	overtimeNight: 1.5,
	overtimeHeavyDay: 1.5,
	overtimeHeavyNight: 1.75,
	holidayDay: 1.35,
	holidayNight: 1.6,
	saturdayDay: 1.25,
	saturdayNight: 1.5
};

const NIGHT_WINDOW_START_MIN = 22 * 60;
const NIGHT_WINDOW_END_MIN = 29 * 60;

type Interval = [number, number];

export function emptyBuckets(): Buckets {
	return {
		regularDayMin: 0,
		regularNightMin: 0,
		overtimeDayMin: 0,
		overtimeNightMin: 0,
		overtimeHeavyDayMin: 0,
		overtimeHeavyNightMin: 0,
		holidayDayMin: 0,
		holidayNightMin: 0,
		saturdayDayMin: 0,
		saturdayNightMin: 0
	};
}

function parseTimeToMin(hhmm: string): number {
	const [h, m] = hhmm.split(':').map(Number);
	return h * 60 + m;
}

export function rangeToMinutes(range: TimeRange): Interval {
	const start = parseTimeToMin(range.start);
	let end = parseTimeToMin(range.end);
	if (end <= start) end += 1440;
	return [start, end];
}

function normalizeBreak(shiftStart: number, shiftEnd: number, br: TimeRange): Interval {
	let start = parseTimeToMin(br.start);
	let end = parseTimeToMin(br.end);
	if (end <= start) end += 1440;

	const shiftCrossesMidnight = shiftEnd > 1440;
	if (shiftCrossesMidnight && start < shiftStart) {
		start += 1440;
		end += 1440;
	}
	return [start, end];
}

export function mergeIntervals(intervals: Interval[]): Interval[] {
	if (intervals.length === 0) return [];
	const sorted = intervals
		.filter(([s, e]) => s < e)
		.sort((a, b) => a[0] - b[0]);
	if (sorted.length === 0) return [];
	const merged: Interval[] = [[sorted[0][0], sorted[0][1]]];
	for (let i = 1; i < sorted.length; i++) {
		const last = merged[merged.length - 1];
		const cur = sorted[i];
		if (cur[0] <= last[1]) {
			last[1] = Math.max(last[1], cur[1]);
		} else {
			merged.push([cur[0], cur[1]]);
		}
	}
	return merged;
}

export function subtractBreaks(shift: Interval, breaks: Interval[]): Interval[] {
	const [s, e] = shift;
	const clipped: Interval[] = breaks
		.map(([bs, be]): Interval => [Math.max(bs, s), Math.min(be, e)])
		.filter(([bs, be]) => bs < be);
	const merged = mergeIntervals(clipped);
	const result: Interval[] = [];
	let cursor = s;
	for (const [bs, be] of merged) {
		if (cursor < bs) result.push([cursor, bs]);
		cursor = Math.max(cursor, be);
	}
	if (cursor < e) result.push([cursor, e]);
	return result;
}

export function nightMinutesIn(interval: Interval): number {
	const [a, b] = interval;
	let total = 0;
	const startDay = Math.floor(a / 1440);
	const endDay = Math.floor(b / 1440);
	for (let k = startDay - 1; k <= endDay + 1; k++) {
		const winStart = NIGHT_WINDOW_START_MIN + 1440 * k;
		const winEnd = NIGHT_WINDOW_END_MIN + 1440 * k;
		const overlapStart = Math.max(a, winStart);
		const overlapEnd = Math.min(b, winEnd);
		if (overlapEnd > overlapStart) total += overlapEnd - overlapStart;
	}
	return total;
}

export function splitAtThreshold(
	intervals: Interval[],
	threshold: number,
	alreadyAccumulated: number
): { before: Interval[]; after: Interval[] } {
	const before: Interval[] = [];
	const after: Interval[] = [];
	let acc = alreadyAccumulated;
	for (const [s, e] of intervals) {
		const dur = e - s;
		if (acc >= threshold) {
			after.push([s, e]);
			acc += dur;
		} else if (acc + dur <= threshold) {
			before.push([s, e]);
			acc += dur;
		} else {
			const splitPoint = s + (threshold - acc);
			before.push([s, splitPoint]);
			after.push([splitPoint, e]);
			acc += dur;
		}
	}
	return { before, after };
}

function distributeIntoDayNight(
	intervals: Interval[],
	dayField: keyof Buckets,
	nightField: keyof Buckets,
	buckets: Buckets
): void {
	for (const iv of intervals) {
		const night = nightMinutesIn(iv);
		const total = iv[1] - iv[0];
		buckets[dayField] += total - night;
		buckets[nightField] += night;
	}
}

export function computeShiftBuckets(
	shift: Shift,
	monthOtAccumulatedMin: number
): { buckets: Buckets; otAddedMin: number } {
	const buckets = emptyBuckets();
	const shiftInterval = rangeToMinutes(shift.range);
	const breakIntervals = shift.breaks.map((br) =>
		normalizeBreak(shiftInterval[0], shiftInterval[1], br)
	);
	const worked = subtractBreaks(shiftInterval, breakIntervals);

	if (shift.dayType === 'legalHoliday') {
		distributeIntoDayNight(worked, 'holidayDayMin', 'holidayNightMin', buckets);
		return { buckets, otAddedMin: 0 };
	}

	if (shift.dayType === 'saturdayBonus') {
		distributeIntoDayNight(worked, 'saturdayDayMin', 'saturdayNightMin', buckets);
		return { buckets, otAddedMin: 0 };
	}

	const { before: regular, after: overtime } = splitAtThreshold(worked, REGULAR_LIMIT_MIN, 0);
	distributeIntoDayNight(regular, 'regularDayMin', 'regularNightMin', buckets);

	const { before: otNormal, after: otHeavy } = splitAtThreshold(
		overtime,
		MONTHLY_OT_HEAVY_THRESHOLD_MIN,
		monthOtAccumulatedMin
	);
	distributeIntoDayNight(otNormal, 'overtimeDayMin', 'overtimeNightMin', buckets);
	distributeIntoDayNight(otHeavy, 'overtimeHeavyDayMin', 'overtimeHeavyNightMin', buckets);

	const otAddedMin = overtime.reduce((sum, [s, e]) => sum + (e - s), 0);
	return { buckets, otAddedMin };
}

export function bucketsToMinutes(buckets: Buckets): number {
	return (
		buckets.regularDayMin +
		buckets.regularNightMin +
		buckets.overtimeDayMin +
		buckets.overtimeNightMin +
		buckets.overtimeHeavyDayMin +
		buckets.overtimeHeavyNightMin +
		buckets.holidayDayMin +
		buckets.holidayNightMin +
		buckets.saturdayDayMin +
		buckets.saturdayNightMin
	);
}

export function bucketsToGrossJPY(buckets: Buckets, hourlyWageJPY: number): number {
	const perMin = hourlyWageJPY / 60;
	const weighted =
		buckets.regularDayMin * MULTIPLIERS.regularDay +
		buckets.regularNightMin * MULTIPLIERS.regularNight +
		buckets.overtimeDayMin * MULTIPLIERS.overtimeDay +
		buckets.overtimeNightMin * MULTIPLIERS.overtimeNight +
		buckets.overtimeHeavyDayMin * MULTIPLIERS.overtimeHeavyDay +
		buckets.overtimeHeavyNightMin * MULTIPLIERS.overtimeHeavyNight +
		buckets.holidayDayMin * MULTIPLIERS.holidayDay +
		buckets.holidayNightMin * MULTIPLIERS.holidayNight +
		buckets.saturdayDayMin * MULTIPLIERS.saturdayDay +
		buckets.saturdayNightMin * MULTIPLIERS.saturdayNight;
	return weighted * perMin;
}

export function computeDay(
	shift: Shift,
	hourlyWageJPY: number,
	monthOtAccumulatedMin: number
): { result: DayResult; otAddedMin: number } {
	const { buckets, otAddedMin } = computeShiftBuckets(shift, monthOtAccumulatedMin);
	const totalWorkedMin = bucketsToMinutes(buckets);
	const grossJPY = bucketsToGrossJPY(buckets, hourlyWageJPY);
	return {
		result: { shiftId: shift.id, date: shift.date, buckets, totalWorkedMin, grossJPY },
		otAddedMin
	};
}

export function computeMonth(shifts: Shift[], hourlyWageJPY: number): MonthResult {
	const sorted = [...shifts].sort((a, b) => {
		if (a.date !== b.date) return a.date.localeCompare(b.date);
		return a.range.start.localeCompare(b.range.start);
	});
	const days: DayResult[] = [];
	const totals = emptyBuckets();
	let monthOt = 0;
	let totalWorkedMin = 0;
	let totalGrossJPY = 0;

	for (const shift of sorted) {
		const { result, otAddedMin } = computeDay(shift, hourlyWageJPY, monthOt);
		days.push(result);
		monthOt += otAddedMin;
		totalWorkedMin += result.totalWorkedMin;
		totalGrossJPY += result.grossJPY;
		for (const key of Object.keys(totals) as (keyof Buckets)[]) {
			totals[key] += result.buckets[key];
		}
	}

	return {
		days,
		totalBuckets: totals,
		totalWorkedMin,
		totalOvertimeMin: monthOt,
		totalGrossJPY,
		crossedOvertimeThreshold: monthOt > MONTHLY_OT_HEAVY_THRESHOLD_MIN
	};
}
