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

export interface LocaleSet {
	MonthShort : [string, string, string, string, string, string, string, string, string, string, string, string];
	MonthLong : [string, string, string, string, string, string, string, string, string, string, string, string];

	// sunday ~ saturday : 0 ~ 6
	DayOfWeekShort : [string, string, string, string, string, string, string];
	DayOfWeekMiddle : [string, string, string, string, string, string, string];
	DayOfWeekLong : [string, string, string, string, string, string, string];

	// in lower case
	Meridiem : [string, string];
}
