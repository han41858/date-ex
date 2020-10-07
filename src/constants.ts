import { DateTimeSetParam } from './interfaces';

export const DatetimeSetParamKeys : (keyof DateTimeSetParam)[] = [
	'year', 'month', 'date',
	'hours', 'minutes', 'seconds', 'ms'
];

export enum Meridiem {
	Am = 'am',
	Pm = 'pm'
}

export enum FormatDesignator {
	YearShort = 'YY', // 20
	Year = 'YYYY', // 2020

	Month = 'M', // 1
	MonthPadded = 'MM', // 01
	MonthStringShort = 'MMM', // Jan
	MonthStringLong = 'MMMM', // January

	Week = 'W',
	WeekPadded = 'WW',

	DayOfYear = 'DDD',
	DayOfYearPadded = 'DDDD',

	DayOfMonth = 'D',
	DayOfMonthPadded = 'DD',

	DayOfWeek = 'd', // 0
	DayOfWeekStringShort = 'dd', // Mo
	DayOfWeekStringMiddle = 'ddd', // Mon
	DayOfWeekStringLong = 'dddd', // Monday

	AmPmLower = 'a', // am/pm
	AmPmCapital = 'A', // AM/PM

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
	MilliSecondsPadded3 = 'SSS'
}

export enum ISO8601Format {
	Date = 'YYYY-MM-DD',
	DateTimeUTC = 'YYYY-MM-DDTHH:mm:ssZ',
	Week = 'YYYY-Www',
	WeekWithWeekday = 'YYYY-Www-d',
	Time = 'hh:mm:ss.sss'
}
