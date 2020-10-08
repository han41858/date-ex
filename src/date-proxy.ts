import { InitDataFormat } from './interfaces';
import { DateEx } from './date-ex';
import { Meridiem } from './constants';


export class DateProxy {

	protected _date ! : Date;


	constructor (initDate? : InitDataFormat) {
		if (initDate === null || initDate === undefined) {
			this._date = new Date();
		}
		else {
			// if (typeof initDate === 'string') {
			// 	if (rfc3339Tester(initDate)
			// 		|| iso8601DateTester(initDate)
			// 		|| iso8601DateTimeTester(initDate)
			// 		|| iso8601TimeTester(initDate)) {
			// 		this._date = new Date(initDate);
			// 	}
			//
			// 	if (!this._date || isNaN(this._date.getFullYear())) {
			// 		throw new Error(`invalid init value : ${ initDate }`);
			// 	}
			// }

			if (typeof initDate === 'number') {
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

	get timezoneOffset () : number {
		return this._date.getTimezoneOffset();
	}

	get year () : number {
		return this._date.getFullYear();
	}

	get quarter () : number {
		return Math.floor((this.month - 1) % 3) + 1;
	}

	get month () : number {
		return this._date.getMonth() + 1;
	}

	get weekOfYear () : number {
		const firstDayOfYear : DateEx = new DateEx({
			year : this.year,
			month : 1,
			date : 1
		});

		const numberOfDays : number = Math.floor((+this._date - +firstDayOfYear) / (24 * 60 * 60 * 1000));

		// add 1 for day starting from 0
		return Math.ceil((firstDayOfYear.day + 1 + numberOfDays) / 7);
	}

	get weekOfMonth () : number {
		const firstDayOfMonth : DateEx = new DateEx({
			year : this.year,
			month : this.month,
			date : 1
		});

		const numberOfDays : number = Math.floor((+this._date - +firstDayOfMonth) / (24 * 60 * 60 * 1000));

		// add 1 for day starting from 0
		return Math.ceil((firstDayOfMonth.day + 1 + numberOfDays) / 7);
	}

	get date () : number {
		return this._date.getDate();
	}

	get dayOfYear () : number {
		const firstDayOfYear : DateEx = new DateEx({
			year : this.year,
			month : 1,
			date : 1
		});

		const numberOfDays : number = Math.floor((+this._date - +firstDayOfYear) / (24 * 60 * 60 * 1000));

		return numberOfDays + 1;
	}

	get day () : number {
		return this._date.getDay();
	}

	get meridiem () : Meridiem {
		return this.hours < 13
			? Meridiem.Am
			: Meridiem.Pm;
	}

	get hours () : number {
		return this._date.getHours();
	}

	get minutes () : number {
		return this._date.getMinutes();
	}

	get seconds () : number {
		return this._date.getSeconds();
	}

	get ms () : number {
		return this._date.getMilliseconds();
	}

}
