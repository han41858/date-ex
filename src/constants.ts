import { DateTimeSetParam } from './interfaces';

export const DatetimeSetParamKeys : (keyof DateTimeSetParam)[] = [
	'year', 'month', 'date',
	'hours', 'minutes', 'seconds', 'ms'
];

export const ZeroDaySetter : DateTimeSetParam = {
	year : 1900,
	month : 1,
	date : 1,

	hours : 0,
	minutes : 0,
	seconds : 0,
	ms : 0
};

export enum FormatToken {
	YearShort = 'YY', // 20
	Year = 'YYYY', // 2020

	Month = 'M', // 1
	MonthPadded = 'MM', // 01
	MonthStringShort = 'MMM', // Jan
	MonthStringLong = 'MMMM', // January

	Week = 'W',
	WeekPadded = 'WW',

	DayOfYear = 'DDD', // 1, 2, ... 365
	DayOfYearPadded = 'DDDD', // 001, 002, ... 365

	DayOfMonth = 'D',
	DayOfMonthPadded = 'DD',

	DayOfWeek = 'd', // 0
	DayOfWeekStringShort = 'dd', // Mo
	DayOfWeekStringMiddle = 'ddd', // Mon
	DayOfWeekStringLong = 'dddd', // Monday

	MeridiemLower = 'a', // am/pm
	MeridiemCapital = 'A', // AM/PM

	Hours24 = 'H',
	Hours24Padded = 'HH',

	Hours12 = 'h',
	Hours12Padded = 'hh',

	Minutes = 'm',
	MinutesPadded = 'mm',

	Seconds = 's',
	SecondsPadded = 'ss',

	MilliSeconds = 'S',
	MilliSecondsPadded2 = 'SS',
	MilliSecondsPadded3 = 'SSS',

	Timezone = 'Z', // -07:00 ~ +07:00
	TimezoneWithoutColon = 'ZZ' // -0700 ~ +0700
}

export enum ISO8601Format {
	Date = 'YYYY-MM-DD',
	DateTimeUTC = 'YYYY-MM-DDTHH:mm:ssZ',
	Week = 'YYYY-Www',
	WeekWithWeekday = 'YYYY-Www-d',
	Time = 'hh:mm:ss.sss'
}

export const DefaultLocale : string = 'en';
