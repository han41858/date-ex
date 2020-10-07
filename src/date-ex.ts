import { DateProxy } from './date-proxy';

import { DateTimeSetParam, InitDataFormat } from './interfaces';
import { DatetimeSetParamKeys } from './constants';


export class DateEx extends DateProxy {

	// private dateFormat : string;


	constructor (initData? : InitDataFormat) {
		super(initData);

		if (initData !== null
			&& !(initData instanceof Date)
			&& !(initData instanceof DateEx)
			&& typeof initData === 'object') {
			// with DateTimeSetParam
			const initDataKeys : string[] = Object.keys(initData);

			if (initDataKeys.every(key => {
				return DatetimeSetParamKeys.includes(key as keyof DateTimeSetParam);
			})) {
				this.set(initData);
			}
		}
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

	add (param : DateTimeSetParam) : DateEx {
		const setParam : DateTimeSetParam = {};

		Object.entries(param).forEach(([_key, value]) => {
			const key : keyof DateTimeSetParam = _key as keyof DateTimeSetParam;

			if (value !== undefined) {
				setParam[key] = this[key] + value;
			}
		});

		return this.set(setParam);
	}

	// TODO: format(format : string) : string {
	format () : string {
		return '';
	}

	// TODO: from
	from (dateTimeStr : string, format : string) : DateEx {
		return this;
	}


	toDate () : Date {
		return this._date;
	}

	valueOf () : number {
		return +this._date;
	}

	// TODO
	toString () : string {
		// return this.format(this.dateFormat || ISO8601Format.DateTimeUTC);
		return '';
	}

}
