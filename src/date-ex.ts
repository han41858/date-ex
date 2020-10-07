import { DateProxy } from './date-proxy';

import { DateTimeSetParam, InitDataFormat } from './interfaces';


export class DateEx extends DateProxy {

	// private dateFormat : string;


	constructor (initData? : InitDataFormat) {
		super(initData);
	}


	// allow null, no limit number range
	set (param : DateTimeSetParam) : DateEx {
		param.year !== undefined && this._date.setFullYear(param.year);
		param.month !== undefined && this._date.setMonth(param.month - 1); // param.month : 1 ~ 12
		param.date !== undefined && this._date.setDate(param.date);

		param.hours !== undefined && this._date.setHours(param.hours);
		param.minutes !== undefined && this._date.setMinutes(param.minutes);
		param.seconds !== undefined && this._date.setSeconds(param.seconds);
		param.ms !== undefined && this._date.setMilliseconds(param.ms);

		return this;
	}

	// format(format : string) : string {
	format () : string {
		return '';
	}


	toDate () : Date {
		return this._date;
	}

	valueOf () : number {
		return +this._date;
	}

	toString () : string {
		// return this.format(this.dateFormat || ISO8601Format.DateTimeUTC);
		return '';
	}

}
