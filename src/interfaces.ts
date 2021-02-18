import { DateTime } from './date-time';
import { FormatToken } from './constants';

export type InitDataFormat = number | string | Date | DateTime | DateTimeParam;

export interface DateTimeParam {
	year? : number;
	month? : number;
	date? : number;

	hours? : number;
	minutes? : number;
	seconds? : number;
	ms? : number
}

export type String2 = [string, string];
export type String7 = [string, string, string, string, string, string, string];
export type String12 = [string, string, string, string, string, string, string, string, string, string, string, string];

export interface LocaleSet {
	MonthShort : String12;
	MonthLong : String12;

	// sunday ~ saturday : 0 ~ 6
	DayOfWeekShort : String7;
	DayOfWeekMiddle : String7;
	DayOfWeekLong : String7;

	// in lower case
	Meridiem : String2;

	LocaleDateTimeFormat : string;
	LocaleDateFormat : string;
	LocaleTimeFormat : string;
}

export interface DurationParam {
	years? : number;
	months? : number;
	dates? : number;

	hours? : number;
	minutes? : number;
	seconds? : number;
	ms? : number;
}

export interface TokenMatchResult {
	token : FormatToken;
	startIndex : number;
}
