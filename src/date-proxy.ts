import { DateTimeParam, InitDataType } from './interfaces';
import { DateTime } from './date-time';
import { DaysToMs } from './constants';


export class DateProxy {

	protected _date !: Date;


	constructor (initData?: InitDataType, formatString?: string) {
		if (initData === null || initData === undefined) {
			this._date = new Date();
		}
		else {
			if (initData instanceof DateTime) {
				this._date = new Date(initData.toDate());
			}
			else if (initData instanceof Date) {
				this._date = new Date(initData);
			}
			else if (typeof initData === 'string') {
				if (!formatString) {
					this._date = new Date(initData);
				}
				// else in DateTime
			}
			else if (typeof initData === 'number') {
				this._date = new Date(initData);
			}
			else {
				this._date = new Date();
			}
		}
	}

	get valid (): boolean {
		return !!this._date
			&& this._date.getFullYear !== undefined
			&& typeof this._date.getFullYear === 'function'
			&& !isNaN(this._date.getFullYear());
	}

	get timezoneOffset (): number {
		return this._date.getTimezoneOffset();
	}

	// UTC-12:00 ~ UTC+14:00 -> -12 ~ 14
	get timezoneOffsetInHours (): number {
		return -this.timezoneOffset / 60;
	}

	get year (): number {
		return this._date.getFullYear();
	}

	set year (year: number) {
		this._date.setFullYear(year);
	}

	// 1 ~ 4
	get quarter (): number {
		return Math.floor((this.month - 1) / 3) + 1;
	}

	get month (): number {
		return this._date.getMonth() + 1;
	}

	set month (month: number) {
		this._date.setMonth(month - 1);
	}

	private isFirstDayOfMonth (): boolean {
		const nextDay: DateTime = new DateTime(this);

		nextDay.add({
			date: -1
		});

		return this.month !== nextDay.month;
	}

	private isLastDayOfMonth (): boolean {
		const nextDay: DateTime = new DateTime(this);

		nextDay.add({
			date: 1
		});

		return this.month !== nextDay.month;
	}

	get weekOfYear (): number {
		const firstDayOfYear: DateTime = new DateTime({
			year: this.year,
			month: 1,
			date: 1
		});

		const numberOfDays: number = Math.floor((+this._date - +firstDayOfYear) / DaysToMs);

		// add 1 for day starting from 0
		return Math.ceil((firstDayOfYear.day + 1 + numberOfDays) / 7);
	}

	get weekOfMonth (): number {
		const firstDayOfMonth: DateTime = new DateTime({
			year: this.year,
			month: this.month,
			date: 1
		});

		const numberOfDays: number = Math.floor((+this._date - +firstDayOfMonth) / DaysToMs);

		// add 1 for day starting from 0
		return Math.ceil((firstDayOfMonth.day + 1 + numberOfDays) / 7);
	}

	get weeksInYear (): number {
		const lastDayOfYear: DateTime = new DateTime({
			year: this.year + 1,
			month: 1,
			date: 0
		});

		return lastDayOfYear.weekOfYear;
	}

	get weeksInMonth (): number {
		const lastDayOfMonth: DateTime = new DateTime({
			year: this.year,
			month: this.month + 1,
			date: 0
		});

		return lastDayOfMonth.weekOfMonth;
	}

	get date (): number {
		return this._date.getDate();
	}

	set date (date: number) {
		this._date.setDate(date);
	}

	get lastDate (): number {
		const firstDayOfMonth: DateTime = new DateTime({
			year: this.year,
			month: this.month,
			date: 1
		});

		const firstDayOfNextMonth: DateTime = new DateTime({
			year: this.year,
			month: this.month + 1,
			date: 1
		});

		return Math.floor((+firstDayOfNextMonth - +firstDayOfMonth) / DaysToMs);
	}

	get dayOfYear (): number {
		const firstDayOfYear: DateTime = new DateTime({
			year: this.year,
			month: 1,
			date: 1
		});

		const numberOfDays: number = Math.floor((+this._date - +firstDayOfYear) / DaysToMs);

		return numberOfDays + 1;
	}

	get daysInYear (): number {
		const firstDayOfYear: DateTime = new DateTime({
			year: this.year,
			month: 1,
			date: 1
		});

		const firstDayOfNextYear: DateTime = new DateTime({
			year: this.year + 1,
			month: 1,
			date: 1
		});

		return Math.floor((+firstDayOfNextYear - +firstDayOfYear) / DaysToMs);
	}

	get day (): number {
		return this._date.getDay();
	}

	get isAm (): boolean {
		return this.hours < 12;
	}

	get hours (): number {
		return this._date.getHours();
	}

	set hours (hours: number) {
		this._date.setHours(hours);
	}

	// 0 ~ 23
	get hours24 (): number {
		return this.hours;
	}

	// 0 ~ 12
	get hours12 (): number {
		const hours: number = this.hours;

		return hours > 12 ? hours % 12 : hours;
	}

	get minutes (): number {
		return this._date.getMinutes();
	}

	set minutes (minutes: number) {
		this._date.setMinutes(minutes);
	}

	get seconds (): number {
		return this._date.getSeconds();
	}

	set seconds (seconds: number) {
		this._date.setSeconds(seconds);
	}

	get ms (): number {
		return this._date.getMilliseconds();
	}

	set ms (ms: number) {
		this._date.setMilliseconds(ms);
	}

	toDate (): Date {
		return this._date;
	}

	valueOf (): number {
		return +this._date;
	}

	toISOString (): string {
		return this._date.toISOString();
	}

	toUTCString (): string {
		return this._date.toUTCString();
	}

	toJson (): Required<DateTimeParam> {
		return {
			year: this.year,
			month: this.month,
			date: this.date,

			hours: this.hours,
			minutes: this.minutes,
			seconds: this.seconds,
			ms: this.ms
		};
	}

}
