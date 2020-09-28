import { InitDataFormat } from './interfaces';
import { DateEx } from './date-ex';
import { iso8601DateTester, iso8601DateTimeTester, iso8601TimeTester, rfc3339Tester } from './util';


export class DateProxy {

	protected _date ! : Date;


	constructor(initDate? : InitDataFormat) {
		if (initDate === null || initDate === undefined) {
			this._date = new Date();
		}
		else {
			if (typeof initDate === 'string') {
				console.log(initDate, rfc3339Tester(initDate)
					|| iso8601DateTester(initDate)
					|| iso8601DateTimeTester(initDate)
					|| iso8601TimeTester(initDate),
					rfc3339Tester(initDate),
					iso8601DateTester(initDate),
					iso8601DateTimeTester(initDate),
					iso8601TimeTester(initDate),
					new Date(initDate));

				if (rfc3339Tester(initDate)
					|| iso8601DateTester(initDate)
					|| iso8601DateTimeTester(initDate)
					|| iso8601TimeTester(initDate)) {
					this._date = new Date(initDate);
				}

				if (!this._date || isNaN(this._date.getFullYear())) {
					throw new Error(`invalid init value : ${ initDate }`);
				}
			}
			else if (typeof initDate === 'number') {
				this._date = new Date(initDate);
			}
			else if (initDate instanceof Date) {
				this._date = new Date(initDate);
			}
			else if (initDate instanceof DateEx) {
				this._date = new Date(initDate.toDate());
			}
			else {
				this._date = new Date();
			}
		}
	}


	get year() : number {
		return this._date.getFullYear();
	}

	get month() : number {
		return this._date.getMonth() + 1;
	}

	get date() : number {
		return this._date.getDate();
	}

	get hours() : number {
		return this._date.getHours();
	}

	get minutes() : number {
		return this._date.getMinutes();
	}

	get seconds() : number {
		return this._date.getSeconds();
	}

	get ms() : number {
		return this._date.getMilliseconds();
	}

}
