import { DateProxy } from './date-proxy';

import {
	AnyObject,
	DateTimeParam,
	DateTimeParamEx,
	DurationParam,
	LocaleSet,
	MonthCalendar,
	TokenMatchResult,
	YearCalendar
} from './interfaces';
import { DateTimeParamKeys, DateTimeUnit, DaysToMs, DefaultLocale, DurationParamKeys, FormatToken } from './constants';
import {
	durationUnitToDateTimeKey,
	findTokens,
	isDateTimeParam,
	isDurationParam,
	loadLocaleFile,
	newArray,
	padDigit,
	parseDateString
} from './util';

// load default locale
import { localeSet } from './locale/en';
import { Duration } from './duration';


// internal global storage
const globalConfig: {
	locale?: string,
	localeTimer?: number
} = {
	locale: undefined,
	localeTimer: undefined
};

const localeSetCached: AnyObject<LocaleSet> = {
	[DefaultLocale]: localeSet
};


// internal functions
const sortDate = (...dates: DateTimeInitDataType[]): DateTime[] => {
	const dateArr: DateTime[] = dates.map((date: DateTimeInitDataType): DateTime => new DateTime(date));

	return dateArr.sort((a: DateTime, b: DateTime): number => {
		return +a - +b;
	});
};


export type DateTimeInitDataType = undefined | null | number | string | Date | DateTime | DateTimeParam;


export class DateTime extends DateProxy {

	private ownLocale !: string;
	private setLocaleTimer: undefined | number;


	constructor ();
	constructor (initData: DateTimeInitDataType);
	constructor (initData: string, formatString: string);
	constructor (initData?: DateTimeInitDataType, formatString?: string) {
		super(initData, formatString);

		if (initData !== null
			&& !(initData instanceof Date)
			&& !(initData instanceof DateTime)
			&& typeof initData === 'object') {
			// with DateTimeSetParam
			if (isDateTimeParam(initData)) {
				// from zero date time
				this._date = new Date(0);

				if (initData.hours === undefined) {
					initData.hours = 0; // for timezone
				}

				this.set(initData);
			}
		}
		// init by string format
		else if (typeof initData === 'string') {
			if (formatString === undefined) {
				this._date = new Date(initData);
			}
			else {
				// from zero date time
				this._date = new Date(0);

				const setParam: DateTimeParam = parseDateString(formatString, initData);

				if (setParam.hours === undefined) {
					setParam.hours = 0; // for timezone
				}

				this.set(setParam);
			}
		}
		else if (typeof initData === 'number') {
			this._date = new Date(0);

			this.set({
				ms: initData
			});
		}


		let localeFromAnotherDateTime: undefined | string;

		if (initData instanceof DateTime) {
			localeFromAnotherDateTime = initData.locale();
		}

		if (globalConfig.localeTimer) {
			// wait global set
			setTimeout(() => {
				this.setDefaultLocale(localeFromAnotherDateTime);
			});
		}
		else {
			this.setDefaultLocale(localeFromAnotherDateTime);
		}
	}

	private setDefaultLocale (localeFromAnotherDateTime?: string): DateTime {
		const defaultLocale: string = localeFromAnotherDateTime
			|| this.ownLocale
			|| globalConfig.locale
			|| DefaultLocale;

		// set default locale
		this.ownLocale = defaultLocale;

		// load locale
		this.locale(defaultLocale);

		return this;
	}

	toString (): string {
		return this.toISOString();
	}

	// global locale setter
	static locale (locale?: string): undefined | string {
		let returnValue: undefined | string;

		// get
		if (locale === undefined) {
			returnValue = globalConfig.locale;
		}
		else {
			const previousLocale: undefined | string = globalConfig.locale;

			if (previousLocale !== locale) {
				if (globalConfig.localeTimer) {
					clearTimeout(globalConfig.localeTimer);

					globalConfig.localeTimer = undefined;
				}

				// loaded already
				if (localeSetCached[locale]) {
					globalConfig.locale = locale;

					returnValue = globalConfig.locale;
				}
				// load
				else {
					// set temporarily
					returnValue = globalConfig.locale = locale;

					// load asynchronously
					globalConfig.localeTimer = setTimeout(async () => {
						try {
							localeSetCached[locale] = await loadLocaleFile(locale);
							globalConfig.locale = locale;
						}
						catch (e) {
							console.error(`invalid locale : '${ locale }', reverted previous locale : '${ previousLocale }'`);

							globalConfig.locale = previousLocale;
						}

						globalConfig.localeTimer = undefined;
					});
				}
			}
			else {
				returnValue = previousLocale;
			}
		}

		return returnValue;
	}

	static get isLocaleLoaded (): boolean {
		return globalConfig.localeTimer === undefined
			&& globalConfig.locale !== undefined;
	}

	locale (locale?: string): string {
		let returnValue: string; // not undefined

		// get
		if (locale === undefined) {
			returnValue = this.ownLocale;
		}
		else {
			const previousLocale: string = this.ownLocale;

			if (previousLocale !== locale) {
				if (this.setLocaleTimer) {
					clearTimeout(this.setLocaleTimer);

					this.setLocaleTimer = undefined;
				}

				// loaded already
				if (localeSetCached[locale]) {
					returnValue = this.ownLocale = locale;
				}
				// load
				else {
					// set temporarily
					returnValue = this.ownLocale = locale;

					// load asynchronously
					this.setLocaleTimer = setTimeout(async () => {
						try {
							localeSetCached[locale] = await loadLocaleFile(locale);
						}
						catch (e) {
							console.error(`invalid locale : '${ locale }', reverted previous locale : '${ previousLocale }'`);

							this.ownLocale = previousLocale;
						}

						this.setLocaleTimer = undefined;
					});
				}
			}
			else {
				// skip
				returnValue = locale;
			}
		}

		return returnValue;
	}

	get isLocaleLoaded (): boolean {
		return this.setLocaleTimer === undefined
			&& this.ownLocale !== undefined;
	}

	// allow null, no limit number range
	set (param: DateTimeParam): DateTime {
		this._date.setFullYear(
			param.year !== undefined ? param.year : this.year,
			param.month !== undefined ? param.month - 1 : this.month - 1,
			param.date !== undefined ? param.date : this.date
		);

		this._date.setHours(
			param.hours !== undefined ? param.hours : this.hours,
			param.minutes !== undefined ? param.minutes : this.minutes,
			param.seconds !== undefined ? param.seconds : this.seconds,
			param.ms !== undefined ? param.ms : this.ms
		);

		return this;
	}

	// DateTime + DateTime is not possible
	add (param: DateTimeParam | Duration | DurationParam): DateTime {
		const setParam: DateTimeParam = {};

		if (isDateTimeParam(param)) {
			DateTimeParamKeys.forEach((key: keyof DateTimeParam) => {
				const value: number | undefined = param[key];

				if (value !== undefined) {
					setParam[key] = this[key] + value;
				}
			});
		}
		else if (param instanceof Duration) {
			DurationParamKeys.forEach((_key: keyof DurationParam): void => {
				const key: keyof DurationParam = _key as keyof DurationParam;
				const datetimeUnit: keyof DateTimeParam = durationUnitToDateTimeKey(_key) as keyof DateTimeParam;

				const value: number | undefined = param[key];

				if (value) {
					setParam[datetimeUnit] = this[datetimeUnit] + value;
				}
			});
		}
		else if (isDurationParam(param)) {
			Object.entries(param).forEach(([key, value]): void => {
				const datetimeUnit: keyof DateTimeParam = durationUnitToDateTimeKey(key as keyof DurationParam) as keyof DateTimeParam;

				if (value) {
					setParam[datetimeUnit] = this[datetimeUnit] + value;
				}
			});
		}

		if (Object.keys(setParam).length > 0) {
			this.set(setParam);
		}

		return this;
	}

	get UTC (): DateTime {
		const utcAdded: DateTime = new DateTime(this);

		utcAdded.add({
			minutes: this.timezoneOffset
		});

		return utcAdded;
	}

	startOf (unit: keyof DateTimeParamEx): DateTime {
		let result: DateTime | undefined;

		if (DateTimeParamKeys.includes(unit as keyof DateTimeParam)) {
			let foundFlag = false;

			const setParam: DateTimeParam = DateTimeParamKeys.reduce((acc: DateTimeParam, _key: string) => {
				if (!foundFlag) {
					const key: keyof DateTimeParam = _key as keyof DateTimeParam;

					acc[key] = this[key];

					if (key === unit) {
						foundFlag = true;
					}
				}

				return acc;
			}, {} as DateTimeParam);

			if (setParam.hours === undefined) {
				setParam.hours = 0; // for timezone
			}

			result = new DateTime(setParam);
		}
		else {
			switch (unit) {
				case DateTimeUnit.Quarter:
					result = new DateTime({
						year: this.year,
						month: (this.quarter - 1) * 4 + 1,
						date: 1,

						hours: 0 // for timezone
					});
					break;

				case DateTimeUnit.Week:
					result = new DateTime(this)
						.set({
							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						})
						.add({
							date: -this.day
						});
					break;
			}
		}

		if (!result) {
			throw new Error('not created');
		}

		return result;
	}

	endOf (unit: keyof DateTimeParamEx): DateTime {
		let result: DateTime | undefined;

		if (DateTimeParamKeys.includes(unit as keyof DateTimeParam)) {
			const setParam: DateTimeParam = {
				ms: unit === DateTimeUnit.Ms ? 999 : -1
			};

			let foundFlag: boolean;

			DateTimeParamKeys.forEach((key: keyof DateTimeParam): void => {
				if (!foundFlag && key !== DateTimeUnit.Ms) {
					if (unit === key) {
						setParam[key] = this[key] + 1;

						foundFlag = true;
					}
					else {
						setParam[key] = this[key];
					}
				}
			});

			if (setParam.hours === undefined) {
				setParam.hours = 0; // for timezone
			}

			result = new DateTime(setParam);
		}
		else {
			switch (unit) {
				case DateTimeUnit.Quarter:
					result = new DateTime({
						year: this.year,
						month: this.quarter * 4,
						date: 1,

						hours: 0, // for timezone
						ms: -1
					});
					break;

				case DateTimeUnit.Week:
					result = new DateTime(this)
						.set({
							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						})
						.add({
							date: 7 - this.day,
							ms: -1
						});
					break;
			}
		}

		if (!result) {
			throw new Error('not created');
		}

		return result;
	}

	format (format: string): string {
		let result: string = format;

		const matchArr: TokenMatchResult[] = findTokens(format);

		if (matchArr?.length > 0) {
			// convert tokens to real value
			const maxIndex: number = matchArr.length - 1;

			for (let i = maxIndex; i >= 0; i--) {
				result = result.substring(0, matchArr[i].startIndex)
					+ this.convertTokenToValue(matchArr[i].token)
					+ result.substring(matchArr[i].startIndex + matchArr[i].token.length);
			}
		}

		return result;
	}

	private convertTokenToValue (token: FormatToken): string {
		let returnValue = '';

		switch (token) {
			case FormatToken.Year:
				returnValue = '' + this.year;
				break;

			case FormatToken.YearShort:
				returnValue = padDigit(this.year % 100, 2);
				break;


			case FormatToken.Quarter:
				returnValue = '' + (Math.floor((this.month - 1) / 3) + 1);
				break;


			case FormatToken.Month:
				returnValue = '' + this.month;
				break;

			case FormatToken.MonthPadded:
				returnValue = padDigit(this.month, 2);
				break;

			case FormatToken.MonthStringShort:
				returnValue = localeSetCached[this.locale()]?.MonthShort[this.month - 1];
				break;

			case FormatToken.MonthStringLong:
				returnValue = localeSetCached[this.locale()]?.MonthLong[this.month - 1];
				break;


			case FormatToken.Week:
				returnValue = '' + this.weekOfYear;
				break;

			case FormatToken.WeekPadded:
				returnValue = padDigit(this.weekOfYear, 2);
				break;

			case FormatToken.WeekPaddedWithPrefix:
				returnValue = 'W' + padDigit(this.weekOfYear, 2);
				break;


			case FormatToken.DayOfYearPadded:
				returnValue = padDigit('' + this.dayOfYear, 3);
				break;

			case FormatToken.DayOfYear:
				returnValue = '' + this.dayOfYear;
				break;


			case FormatToken.DayOfMonthPadded:
				returnValue = padDigit('' + this.date, 2);
				break;

			case FormatToken.DayOfMonth:
				returnValue = '' + this.date;
				break;


			case FormatToken.DayOfWeekStringLong:
				returnValue = localeSetCached[this.locale()]?.DayOfWeekLong[this.day];
				break;

			case FormatToken.DayOfWeekStringMiddle:
				returnValue = localeSetCached[this.locale()]?.DayOfWeekMiddle[this.day];
				break;

			case FormatToken.DayOfWeekStringShort:
				returnValue = localeSetCached[this.locale()]?.DayOfWeekShort[this.day];
				break;

			case FormatToken.DayOfWeek:
				returnValue = '' + this.day;
				break;


			case FormatToken.MeridiemLower:
				returnValue = localeSetCached[this.locale()]?.Meridiem[this.isAm ? 0 : 1]?.toLowerCase();
				break;

			case FormatToken.MeridiemCapital:
				returnValue = localeSetCached[this.locale()]?.Meridiem[this.isAm ? 0 : 1]?.toUpperCase();
				break;


			case FormatToken.Hours24Padded:
				returnValue = padDigit(this.hours, 2);
				break;

			case FormatToken.Hours24:
				returnValue = '' + this.hours;
				break;


			case FormatToken.Hours12Padded:
				returnValue = padDigit(this.hours12, 2);
				break;

			case FormatToken.Hours12:
				returnValue = '' + (this.hours12);
				break;


			case FormatToken.MinutesPadded:
				returnValue = padDigit(this.minutes, 2);
				break;

			case FormatToken.Minutes:
				returnValue = '' + this.minutes;
				break;


			case FormatToken.SecondsPadded:
				returnValue = padDigit(this.seconds, 2);
				break;

			case FormatToken.Seconds:
				returnValue = '' + this.seconds;
				break;


			case FormatToken.MilliSecondsPadded3:
				returnValue = padDigit(this.ms, 3);
				break;

			case FormatToken.MilliSecondsPadded2:
				returnValue = padDigit(
					this.ms < 100
						? this.ms
						: Math.floor(this.ms / 10), 2
				);
				break;

			case FormatToken.MilliSeconds:
				returnValue = '' + this.ms;
				break;
		}

		return returnValue;
	}

	toLocaleDateTimeString (): string {
		return this.format(localeSetCached[this.locale()].LocaleDateTimeFormat);
	}

	toLocaleDateString (): string {
		return this.format(localeSetCached[this.locale()].LocaleDateFormat);
	}

	toLocaleTimeString (): string {
		return this.format(localeSetCached[this.locale()].LocaleTimeFormat);
	}

	diff (
		date: DateTimeInitDataType,
		unit: keyof DateTimeParamEx = DateTimeUnit.Ms
	): number {
		let dateWith: DateTime;

		if (date instanceof DateTime) {
			dateWith = date;
		}
		else {
			dateWith = new DateTime(date);
		}

		let diffValue !: number;

		switch (unit) {
			case DateTimeUnit.Year:
				diffValue = this.year - dateWith.year;
				break;

			case DateTimeUnit.Quarter: {
				const yearModifier: number = (this.year - dateWith.year) * 4;

				diffValue = yearModifier + this.quarter - dateWith.quarter;
				break;
			}

			case DateTimeUnit.Month: {
				const yearModifier: number = (this.year - dateWith.year) * 12;

				diffValue = yearModifier + this.month - dateWith.month;
				break;
			}

			case DateTimeUnit.Week: {
				const sign: number = Math.sign(+this - +dateWith);

				let smallerDate: DateTime;
				let biggerDate: DateTime;

				if (sign < 0) {
					smallerDate = this;
					biggerDate = dateWith;
				}
				else {
					smallerDate = dateWith;
					biggerDate = this;
				}

				const numberOfDays: number = Math.floor((+biggerDate - +smallerDate) / DaysToMs);

				// add 1 for day starting from 0
				const diffWeeks: number = Math.ceil(sign * (smallerDate.day + 1 + numberOfDays) / 7);

				// can be -0
				diffValue = Object.is(diffWeeks, -0)
					? 0
					: diffWeeks;
				break;
			}

			case DateTimeUnit.Date: {
				const diffInMs: number = +this - +dateWith;
				const diffInDays: number = diffInMs / 1000 / 60 / 60 / 24;

				diffValue = Math.floor(diffInDays);
				break;
			}

			case DateTimeUnit.Hours: {
				const diffInMs: number = +this - +dateWith;
				const diffInHours: number = diffInMs / 1000 / 60 / 60;

				diffValue = Math.floor(diffInHours);
				break;
			}

			case DateTimeUnit.Minutes: {
				const diffInMs: number = +this - +dateWith;
				const diffInMinutes: number = diffInMs / 1000 / 60;

				diffValue = Math.floor(diffInMinutes);
				break;
			}

			case DateTimeUnit.Seconds: {
				const diffInMs: number = +this - +dateWith;
				const diffInSeconds: number = diffInMs / 1000;

				diffValue = Math.floor(diffInSeconds);
				break;
			}

			case DateTimeUnit.Ms:
				diffValue = +this - +dateWith;
				break;
		}

		return diffValue;
	}

	isEqual (
		date: DateTimeInitDataType,
		unit: keyof DateTimeParamEx = DateTimeUnit.Ms
	): boolean {
		return this.diff(date, unit) === 0;
	}

	isBefore (
		date: DateTimeInitDataType,
		unit: keyof DateTimeParamEx = DateTimeUnit.Ms
	): boolean {
		return this.diff(date, unit) < 0;
	}

	isBeforeOrEqual (
		date: DateTimeInitDataType,
		unit: keyof DateTimeParamEx = DateTimeUnit.Ms
	): boolean {
		return this.diff(date, unit) <= 0;
	}

	isAfter (
		date: DateTimeInitDataType,
		unit: keyof DateTimeParamEx = DateTimeUnit.Ms
	): boolean {
		return this.diff(date, unit) > 0;
	}

	isAfterOrEqual (
		date: DateTimeInitDataType,
		unit: keyof DateTimeParamEx = DateTimeUnit.Ms
	): boolean {
		return this.diff(date, unit) >= 0;
	}

	isBetween (
		date1: DateTimeInitDataType,
		date2: DateTimeInitDataType,
		unit: keyof DateTimeParamEx = DateTimeUnit.Ms
	): boolean {
		const [smallerDate, biggerDate] = sortDate(date1, date2);

		return this.diff(smallerDate, unit) > 0
			&& this.diff(biggerDate, unit) < 0;
	}

	isBetweenOrEqual (
		date1: DateTimeInitDataType,
		date2: DateTimeInitDataType,
		unit: keyof DateTimeParamEx = DateTimeUnit.Ms
	): boolean {
		const [smallerDate, biggerDate] = sortDate(date1, date2);

		return this.diff(smallerDate, unit) >= 0
			&& this.diff(biggerDate, unit) <= 0;
	}

	// TODO:
	// at(countryCode: string, city : string) : DateTime;

	getYearCalendar (): YearCalendar {
		const dates: DateTime[] = newArray<DateTime>(
			this.daysInYear,
			(i): DateTime => {
				return new DateTime(this)
					.set({
						month: 1,
						date: i + 1
					})
					.startOf(DateTimeUnit.Date);
			}
		);

		return {
			year: this.year,

			dates
		};
	}

	getMonthCalendar (): MonthCalendar {
		const dates: DateTime[] = newArray<DateTime>(
			this.lastDate,
			(i): DateTime => {
				return new DateTime(this)
					.set({
						date: i + 1
					})
					.startOf(DateTimeUnit.Date);
			}
		);

		return {
			year: this.year,
			month: this.month,

			dates
		};
	}

}
