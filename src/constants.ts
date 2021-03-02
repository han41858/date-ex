export enum DateTimeUnit {
	Year = 'year',
	Quarter = 'quarter',
	Month = 'month',
	Week = 'week',
	Date = 'date',

	Hours = 'hours',
	Minutes = 'minutes',
	Seconds = 'seconds',
	Ms = 'ms'
}

export const DateTimeParamKeys : DateTimeUnit[] = [
	DateTimeUnit.Year,
	DateTimeUnit.Month,
	DateTimeUnit.Date,

	DateTimeUnit.Hours,
	DateTimeUnit.Minutes,
	DateTimeUnit.Seconds,
	DateTimeUnit.Ms
];

export enum DurationUnit {
	Years = 'years',
	Quarters = 'quarters',
	Months = 'months',
	Weeks = 'weeks',
	Dates = 'dates',

	Hours = 'hours',
	Minutes = 'minutes',
	Seconds = 'seconds',
	Ms = 'ms'
}

export const DurationParamKeys : DurationUnit[] = [
	DurationUnit.Years,
	DurationUnit.Months,
	DurationUnit.Dates,

	DurationUnit.Hours,
	DurationUnit.Minutes,
	DurationUnit.Seconds,
	DurationUnit.Ms
];

export enum FormatToken {
	YearShort = 'YY', // 20
	Year = 'YYYY', // 2020

	Quarter = 'Q',

	Month = 'M', // 1
	MonthPadded = 'MM', // 01
	MonthStringShort = 'MMM', // Jan
	MonthStringLong = 'MMMM', // January

	Week = 'W',
	WeekPadded = 'WW',
	WeekPaddedWithPrefix = 'Www',

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

export const DefaultLocale = 'en';

export const Gregorian1Year : number = 146097 / 400; // 365.2425
export const Gregorian1Month : number = Gregorian1Year / 12; // 30.436875

export const DaysToMs = 24 * 60 * 60 * 1000;
