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
