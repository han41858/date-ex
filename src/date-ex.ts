import { DateProxy } from './date-proxy';

import { InitDataFormat } from './interfaces';


export class DateEx extends DateProxy {

	// private dateFormat : string;


	constructor(initData? : InitDataFormat) {
		super(initData);
	}


	// set(param : DateTimeSetParam) : DateEx {
	set() : DateEx {
		return this;
	}

	// format(format : string) : string {
	format() : string {
		return '';
	}


	toDate() : Date {
		return this._date;
	}

	valueOf() : number {
		return +this._date;
	}

	toString() : string {
		// return this.format(this.dateFormat || ISO8601Format.DateTimeUTC);
		return '';
	}

}
