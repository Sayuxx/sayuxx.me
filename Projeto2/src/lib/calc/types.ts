export interface TimeRange {
	start: string;
	end: string;
}

export type DayType = 'regular' | 'legalHoliday' | 'saturdayBonus';

export interface Shift {
	id: string;
	date: string;
	range: TimeRange;
	breaks: TimeRange[];
	dayType: DayType;
}

export interface Buckets {
	regularDayMin: number;
	regularNightMin: number;
	overtimeDayMin: number;
	overtimeNightMin: number;
	overtimeHeavyDayMin: number;
	overtimeHeavyNightMin: number;
	holidayDayMin: number;
	holidayNightMin: number;
	saturdayDayMin: number;
	saturdayNightMin: number;
}

export interface DayResult {
	shiftId: string;
	date: string;
	buckets: Buckets;
	totalWorkedMin: number;
	grossJPY: number;
}

export interface MonthResult {
	days: DayResult[];
	totalBuckets: Buckets;
	totalWorkedMin: number;
	totalOvertimeMin: number;
	totalGrossJPY: number;
	crossedOvertimeThreshold: boolean;
}
