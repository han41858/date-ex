import { DateEx } from './date-ex';

export type InitDataFormat = number | Date | DateEx | DateTimeSetParam;

export interface DateTimeSetParam {
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
