import { DateProxy } from './date-proxy';

import { DateTimeObject, InitDataFormat, LocaleSet } from './interfaces';
import { DatetimeSetParamKeys, DateTimeUnit, DefaultLocale, FormatToken, ZeroDaySetter } from './constants';
import { clone, loadLocaleFile, padDigit } from './util';

// load default locale
import { locale } from './locale/en';


// internal global storage
const globalConfig : {
	locale? : string,
	localeTimer? : number
} = {
	locale : undefined,
	localeTimer : undefined
};

const localeSetCached : {
	[key : string] : LocaleSet;
} = {
	[DefaultLocale] : locale
};


export class DateTime extends DateProxy {

	private ownLocale ! : string;
	private setLocaleTimer : undefined | number;

	// private dateFormat : string;


	constructor (initData? : InitDataFormat, formatForString? : string) {
		super(initData);

		if (initData !== null
			&& !(initData instanceof Date)
			&& !(initData instanceof DateTime)
			&& typeof initData === 'object') {
			// with DateTimeSetParam
			const initDataKeys : string[] = Object.keys(initData);

			if (initDataKeys.every(key => {
				return DatetimeSetParamKeys.includes(key as keyof DateTimeObject);
			})) {
				// others 0
				const setParam : DateTimeObject = Object.assign(clone(ZeroDaySetter), initData);

				this.set(setParam);
			}
		}


		let localeFromAnotherDateTime : undefined | string;

		if (initData instanceof DateTime) {
			localeFromAnotherDateTime = initData.locale();
		}

		if (!!globalConfig.localeTimer) {
			// wait global set
			setTimeout(() => {
				this.setDefaultLocale(localeFromAnotherDateTime);
			});
		}
		else {
			this.setDefaultLocale(localeFromAnotherDateTime);
		}
	}

	private setDefaultLocale (localeFromAnotherDateTime ? : string) : void {
		const defaultLocale : string = localeFromAnotherDateTime
			|| this.ownLocale
			|| globalConfig.locale
			|| DefaultLocale;

		// set default locale
		this.ownLocale = defaultLocale;

		// load locale
		this.locale(defaultLocale);
	}

	// TODO
	toString () : string {
		// return this.format(this.dateFormat || ISO8601Format.DateTimeUTC);
		return '';
	}

	// global locale setter
	static locale (locale? : string) : undefined | string {
		let returnValue : undefined | string;

		// get
		if (locale === undefined) {
			returnValue = globalConfig.locale;
		}
		else {
			const previousLocale : undefined | string = globalConfig.locale;

			if (previousLocale !== locale) {
				if (!!globalConfig.localeTimer) {
					clearTimeout(globalConfig.localeTimer);

					globalConfig.localeTimer = undefined;
				}

				// loaded already
				if (!!localeSetCached[locale]) {
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
						} catch (e) {
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

	locale (locale ? : string) : string {
		let returnValue : string; // not undefined

		// get
		if (locale === undefined) {
			returnValue = this.ownLocale;
		}
		else {
			const previousLocale : string = this.ownLocale;

			if (previousLocale !== locale) {
				if (!!this.setLocaleTimer) {
					clearTimeout(this.setLocaleTimer);

					this.setLocaleTimer = undefined;
				}

				// loaded already
				if (!!localeSetCached[locale]) {
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
						} catch (e) {
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

	// allow null, no limit number range
	set (param : DateTimeObject) : DateTime {
		param.year !== undefined && this._date.setFullYear(param.year);
		param.month !== undefined && this._date.setMonth(param.month - 1); // param.month : 1 ~ 12
		param.date !== undefined && this._date.setDate(param.date);

		param.hours !== undefined && this._date.setHours(param.hours);
		param.minutes !== undefined && this._date.setMinutes(param.minutes);
		param.seconds !== undefined && this._date.setSeconds(param.seconds);
		param.ms !== undefined && this._date.setMilliseconds(param.ms);

		return this;
	}

	add (param : DateTimeObject) : DateTime {
		const setParam : DateTimeObject = {};

		Object.entries(param).forEach(([_key, value]) => {
			const key : keyof DateTimeObject = _key as keyof DateTimeObject;

			if (value !== undefined) {
				setParam[key] = this[key] + value;
			}
		});

		return this.set(setParam);
	}

	format (format : string) : string {
		let result : string = format;

		// find tokens
		const regExp : RegExp = /YYYY|YY|Q|M{1,4}|Www|W{1,2}|[Dd]{1,4}|[aA]|[Hh]{1,2}|m{1,2}|s{1,2}|S{1,3}/;

		const matchArr : {
			token : FormatToken,
			startIndex : number
		}[] = [];

		let formatFrag : string = format;
		let omitLength : number = 0;

		let execResult : RegExpExecArray | null = regExp.exec(formatFrag);

		if (!!execResult) {
			do {
				const strFound : string = execResult[0];

				matchArr.push({
					token : strFound as FormatToken,
					startIndex : omitLength + execResult.index
				});

				formatFrag = formatFrag.substr(execResult.index + strFound.length);
				omitLength += execResult.index + strFound.length;

				execResult = regExp.exec(formatFrag);
			}
			while (!!execResult);

			// convert tokens to real value
			const maxIndex : number = matchArr.length - 1;

			for (let i = maxIndex; i >= 0; i--) {
				result = result.substr(0, matchArr[i].startIndex)
					+ this.convertTokenToValue(matchArr[i].token)
					+ result.substr(matchArr[i].startIndex + matchArr[i].token.length);
			}
		}

		return result;
	}

	private convertTokenToValue (token : FormatToken) : string {
		let returnValue : string = '';

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

	toLocaleDateTimeString () : string {
		return this.format(localeSetCached[this.locale()].LocaleDateTimeFormat);
	}

	toLocaleDateString () : string {
		return this.format(localeSetCached[this.locale()].LocaleDateFormat);
	}

	toLocaleTimeString () : string {
		return this.format(localeSetCached[this.locale()].LocaleTimeFormat);
	}

	diff (date : InitDataFormat, unit : DateTimeUnit = DateTimeUnit.Ms) : number {
		let dateWith : DateTime;

		if (date instanceof DateTime) {
			dateWith = date;
		}
		else {
			dateWith = new DateTime(date);
		}

		let diffValue : number;

		switch (unit) {
			case DateTimeUnit.Year:
				diffValue = this.year - dateWith.year;
				break;

			case DateTimeUnit.Quarter: {
				const yearModifier : number = (this.year - dateWith.year) * 4;

				diffValue = yearModifier + this.quarter - dateWith.quarter;
				break;
			}

			case DateTimeUnit.Month: {
				const yearModifier : number = (this.year - dateWith.year) * 12;

				diffValue = yearModifier + this.month - dateWith.month;
				break;
			}

			case DateTimeUnit.Week: {
				const sign : number = Math.sign(+this - +dateWith);

				let smallerDate : DateTime;
				let biggerDate : DateTime;

				if (sign < 0) {
					smallerDate = this;
					biggerDate = dateWith;
				}
				else {
					smallerDate = dateWith;
					biggerDate = this;
				}

				const numberOfDays : number = Math.floor((+biggerDate - +smallerDate) / (24 * 60 * 60 * 1000));

				// add 1 for day starting from 0
				const diffWeeks : number = Math.ceil(sign * (smallerDate.day + 1 + numberOfDays) / 7);

				// can be -0
				diffValue = diffWeeks === -0
					? 0
					: diffWeeks;
				break;
			}

			case DateTimeUnit.Date: {
				const diffInMs : number = +this - +dateWith;
				const diffInDays : number = diffInMs / 1000 / 60 / 60 / 24;

				diffValue = Math.floor(diffInDays);
				break;
			}

			case DateTimeUnit.Hours: {
				const diffInMs : number = +this - +dateWith;
				const diffInHours : number = diffInMs / 1000 / 60 / 60;

				diffValue = Math.floor(diffInHours);
				break;
			}

			case DateTimeUnit.Minutes: {
				const diffInMs : number = +this - +dateWith;
				const diffInMinutes : number = diffInMs / 1000 / 60;

				diffValue = Math.floor(diffInMinutes);
				break;
			}

			case DateTimeUnit.Seconds: {
				const diffInMs : number = +this - +dateWith;
				const diffInSeconds : number = diffInMs / 1000;

				diffValue = Math.floor(diffInSeconds);
				break;
			}

			case DateTimeUnit.Ms:
				diffValue = +this - +dateWith;
				break;
		}

		return diffValue;
	}

	isBefore (date : InitDataFormat, unit : DateTimeUnit = DateTimeUnit.Ms) : boolean {
		return this.diff(date, unit) < 0;
	}

	isBeforeOrEqual (date : InitDataFormat, unit : DateTimeUnit = DateTimeUnit.Ms) : boolean {
		return this.diff(date, unit) <= 0;
	}

	isAfter (date : InitDataFormat, unit : DateTimeUnit = DateTimeUnit.Ms) : boolean {
		return this.diff(date, unit) > 0;
	}

	isAfterOrEqual (date : InitDataFormat, unit : DateTimeUnit = DateTimeUnit.Ms) : boolean {
		return this.diff(date, unit) >= 0;
	}

	isBetween (date1 : InitDataFormat, date2 : InitDataFormat, unit : DateTimeUnit = DateTimeUnit.Ms) : boolean {
		let smallerDate : DateTime;
		let biggerDate : DateTime;

		const dateTime1 : DateTime = new DateTime(date1);
		const dateTime2 : DateTime = new DateTime(date2);

		if (+dateTime1 <= +dateTime2) {
			smallerDate = dateTime1;
			biggerDate = dateTime2;
		}
		else {
			smallerDate = dateTime2;
			biggerDate = dateTime1;
		}

		return this.diff(smallerDate, unit) > 0
			&& this.diff(biggerDate, unit) < 0;
	}

	isBetweenOrEqual (date1 : InitDataFormat, date2 : InitDataFormat, unit : DateTimeUnit = DateTimeUnit.Ms) : boolean {
		let smallerDate : DateTime;
		let biggerDate : DateTime;

		const dateTime1 : DateTime = new DateTime(date1);
		const dateTime2 : DateTime = new DateTime(date2);

		if (+dateTime1 <= +dateTime2) {
			smallerDate = dateTime1;
			biggerDate = dateTime2;
		}
		else {
			smallerDate = dateTime2;
			biggerDate = dateTime1;
		}

		return this.diff(smallerDate, unit) >= 0
			&& this.diff(biggerDate, unit) <= 0;
	}

	// TODO:
	// relativeTo(datetime : DateTime, unit : DateTimeUnit)

	// TODO:
	// at(countryCode: string, city : string) : DateTime;

}
