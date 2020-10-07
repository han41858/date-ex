import { DateTimeSetParam } from './interfaces';

export const DatetimeSetParamKeys : (keyof DateTimeSetParam)[] = [
	'year', 'month', 'date',
	'hours', 'minutes', 'seconds', 'ms'
];

export enum ISO8601Format {
	Date = 'YYYY-MM-DD',
	DateTimeUTC = 'YYYY-MM-DDTHH:mm:ssZ',
	Week = 'YYYY-Www',
	WeekWithWeekday = 'YYYY-Www-d',
	Time = 'hh:mm:ss.sss'
}
