import { DateTimeParam, InitDataFormat } from './interfaces';
import { DateTime } from './date-time';


export class DateProxy {

	protected _date ! : Date;


	constructor (initDate? : InitDataFormat) {
		if (initDate === null || initDate === undefined) {
			this._date = new Date();
		}
		else {
			if (initDate instanceof DateTime) {
				this._date = new Date(initDate.toDate());
			}
			else if (initDate instanceof Date) {
				this._date = new Date(initDate);
			}
			else if (typeof initDate === 'string') {
				this._date = new Date(initDate);
			}
			else if (typeof initDate === 'number') {
				this._date = new Date(initDate);
			}
			else {
				this._date = new Date();
			}
		}
	}

	isValid () : boolean {
		return !!this._date
			&& this._date.getFullYear !== undefined
			&& typeof this._date.getFullYear === 'function'
			&& !isNaN(this._date.getFullYear());
	}

	get timezoneOffset () : number {
		return this._date.getTimezoneOffset();
	}

	get year () : number {
		return this._date.getFullYear();
	}

	set year (year : number) {
		this._date.setFullYear(year);
	}

	private get yearUTC () : number {
		let year : number = this.year;

		if (this.isMonthChangingWithUTC() && this.month === 1) {
			year -= 1;
		}

		return year;
	}

	// 1 ~ 4
	get quarter () : number {
		return Math.floor((this.month - 1) / 3) + 1;
	}

	private get quarterUTC () : number {
		let quarter : number = this.quarter;

		if (this.isMonthChangingWithUTC() && (this.month % 3 === 1)) {
			if (quarter - 1 > 0) {
				quarter -= 1;
			}
			else {
				quarter = 4;
			}

		}

		return quarter;
	}

	get month () : number {
		return this._date.getMonth() + 1;
	}

	set month (month : number) {
		this._date.setMonth(month - 1);
	}

	private isFirstDayOfMonth () : boolean {
		const nextDay : DateTime = new DateTime(this);

		nextDay.add({
			date : -1
		});

		return this.month !== nextDay.month;
	}

	private isLastDayOfMonth () : boolean {
		const nextDay : DateTime = new DateTime(this);

		nextDay.add({
			date : 1
		});

		return this.month !== nextDay.month;
	}

	private isMonthChangingWithUTC () : boolean {
		return this.isDateChangingWithUTC() && this.isFirstDayOfMonth();
	}

	private get monthUTC () : number {
		let month : number = this.month;

		if (this.isMonthChangingWithUTC()) {
			month -= 1;

			if (month === 0) {
				month = 12;
			}
		}

		return month;
	}

	get weekOfYear () : number {
		const firstDayOfYear : DateTime = new DateTime({
			year : this.year,
			month : 1,
			date : 1
		});

		const numberOfDays : number = Math.floor((+this._date - +firstDayOfYear) / (24 * 60 * 60 * 1000));

		// add 1 for day starting from 0
		return Math.ceil((firstDayOfYear.day + 1 + numberOfDays) / 7);
	}

	get weekOfMonth () : number {
		const firstDayOfMonth : DateTime = new DateTime({
			year : this.year,
			month : this.month,
			date : 1
		});

		const numberOfDays : number = Math.floor((+this._date - +firstDayOfMonth) / (24 * 60 * 60 * 1000));

		// add 1 for day starting from 0
		return Math.ceil((firstDayOfMonth.day + 1 + numberOfDays) / 7);
	}

	get weeksInYear () : number {
		const lastDayOfYear : DateTime = new DateTime({
			year : this.year + 1,
			month : 1,
			date : 0
		});

		return lastDayOfYear.weekOfYear;
	}

	get weeksInMonth () : number {
		const lastDayOfMonth : DateTime = new DateTime({
			year : this.year,
			month : this.month + 1,
			date : 0
		});

		return lastDayOfMonth.weekOfMonth;
	}

	get date () : number {
		return this._date.getDate();
	}

	set date (date : number) {
		this._date.setDate(date);
	}

	private isDateChangingWithUTC () : boolean {
		const hours : number = this.hours24UTC;
		const timezoneOffsetInHours : number = this.timezoneOffset / 60;

		// TODO: < 0?
		return hours - timezoneOffsetInHours > 23;
	}

	private get dateUTC () : number {
		let date : number = this.date;

		if (this.isDateChangingWithUTC()) {
			if (date - 1 > 0) {
				date -= 1;
			}
			else {
				const previousDay : DateTime = new DateTime(this);

				previousDay.add({
					date : -1
				});

				date = previousDay.date;
			}
		}

		return date;
	}

	get dayOfYear () : number {
		const firstDayOfYear : DateTime = new DateTime({
			year : this.year,
			month : 1,
			date : 1
		});

		const numberOfDays : number = Math.floor((+this._date - +firstDayOfYear) / (24 * 60 * 60 * 1000));

		return numberOfDays + 1;
	}

	get daysInYear () : number {
		const firstDayOfYear : DateTime = new DateTime({
			year : this.year,
			month : 1,
			date : 1
		});

		const firstDayOfNextYear : DateTime = new DateTime({
			year : this.year + 1,
			month : 1,
			date : 1
		});

		return Math.floor((+firstDayOfNextYear - +firstDayOfYear) / (24 * 60 * 60 * 1000));
	}

	get daysInMonth () : number {
		const firstDayOfMonth : DateTime = new DateTime({
			year : this.year,
			month : this.month,
			date : 1
		});

		const firstDayOfNextMonth : DateTime = new DateTime({
			year : this.year,
			month : this.month + 1,
			date : 1
		});

		return Math.floor((+firstDayOfNextMonth - +firstDayOfMonth) / (24 * 60 * 60 * 1000));
	}

	get day () : number {
		return this._date.getDay();
	}

	private get dayUTC () : number {
		const day : number = this.day;

		return !this.isDateChangingWithUTC()
			? day
			: (
				day + 1 > 6
					? 0
					: day + 1
			);
	}

	get isAm () : boolean {
		return this.hours < 12;
	}

	get hours () : number {
		return this._date.getHours();
	}

	set hours (hours : number) {
		this._date.setHours(hours);
	}

	// 0 ~ 23
	get hours24 () : number {
		return this.hours;
	}

	// 0 ~ 12
	get hours12 () : number {
		const hours : number = this.hours;

		return hours > 12 ? hours % 12 : hours;
	}

	private get hours12UTC () : number {
		const hours : number = (this.hours24UTC + 1) % 12 - 1;
		return hours < 0
			? hours + 12
			: hours;
	}

	private get hours24UTC () : number {
		let hours : number = this.hours + this.timezoneOffset / 60;

		return hours < 0
			? hours + 24
			: hours;
	}

	get minutes () : number {
		return this._date.getMinutes();
	}

	set minutes (minutes : number) {
		this._date.setMinutes(minutes);
	}

	get seconds () : number {
		return this._date.getSeconds();
	}

	set seconds (seconds : number) {
		this._date.setSeconds(seconds);
	}

	get ms () : number {
		return this._date.getMilliseconds();
	}

	set ms (ms : number) {
		this._date.setMilliseconds(ms);
	}

	toDate () : Date {
		return this._date;
	}

	valueOf () : number {
		return +this._date;
	}

	toISOString () : string {
		return this._date.toISOString();
	}

	toUTCString () : string {
		return this._date.toUTCString();
	}

	toJson () : Required<DateTimeParam> {
		return {
			year : this.year,
			month : this.month,
			date : this.date,

			hours : this.hours,
			minutes : this.minutes,
			seconds : this.seconds,
			ms : this.ms
		};
	}

	get UTC () {
		return {
			year : this.yearUTC,
			quarter : this.quarterUTC,
			month : this.monthUTC,
			date : this.dateUTC,
			day : this.dayUTC,

			hours : this.hours24UTC,
			hours12 : this.hours12UTC,

			minutes : this.minutes,
			seconds : this.seconds,
			ms : this.ms
		};
	}

}
