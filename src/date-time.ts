import { DateProxy } from './date-proxy';

import { Calendar, DateTimeParam, DurationParam, InitDataFormat, LocaleSet, TokenMatchResult } from './interfaces';
import {
	DateTimeParamKeys,
	DateTimeUnit,
	DaysToMs,
	DefaultLocale,
	DurationParamKeys,
	DurationUnit,
	FormatToken
} from './constants';
import {
	durationUnitToDateTimeUnit,
	findFormatTokens,
	isDateTimeParam,
	isDurationParam,
	loadLocaleFile,
	newArray,
	padDigit,
	sortDate
} from './util';

// load default locale
import { locale } from './locale/en';
import { Duration } from './duration';


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


	constructor (initData? : InitDataFormat, formatString? : string) {
		super(initData, formatString);

		if (initData !== null
			&& !(initData instanceof Date)
			&& !(initData instanceof DateTime)
			&& typeof initData === 'object') {
			// with DateTimeSetParam
			if (isDateTimeParam(initData)) {
				// from zero date time
				this._date = new Date(0);

				this.set(initData);
			}
		}
		// TODO: init by string format
		/*
		else if (typeof initData === 'string' && formatString !== undefined) {
			// find tokens
			const matchArr : TokenMatchResult[] = findFormatTokens(formatString);

			if (matchArr?.length > 0) {
				const now : Date = new Date();
				const tokens : FormatToken[] = matchArr.map(obj => obj.token);

				const setParam : DateTimeParam = {};

				// prevent duplicated tokens in a unit
				const unitAndTokens : {
					unit : DateTimeUnit,
					tokens : FormatToken[]
				}[] = [{
					unit : DateTimeUnit.Year,
					tokens : [FormatToken.Year, FormatToken.YearShort]
				}, {
					unit : DateTimeUnit.Month,
					tokens : [FormatToken.Month, FormatToken.MonthPadded, FormatToken.MonthStringShort, FormatToken.MonthStringLong]
				}, {
					unit : DateTimeUnit.Date,
					tokens : [FormatToken.DayOfMonth, FormatToken.DayOfMonthPadded, FormatToken.DayOfYear, FormatToken.DayOfYearPadded]
				}, {
					unit : DateTimeUnit.Hours,
					tokens : [
						FormatToken.Hours24, FormatToken.Hours24Padded, FormatToken.Hours12, FormatToken.Hours12Padded,
						FormatToken.MeridiemCapital, FormatToken.MeridiemLower
					]
				}, {
					unit : DateTimeUnit.Minutes,
					tokens : [FormatToken.Minutes, FormatToken.MinutesPadded]
				}, {
					unit : DateTimeUnit.Seconds,
					tokens : [FormatToken.Seconds, FormatToken.SecondsPadded]
				}, {
					unit : DateTimeUnit.Ms,
					tokens : [FormatToken.MilliSeconds, FormatToken.MilliSecondsPadded2, FormatToken.MilliSecondsPadded3]
				}];

				unitAndTokens.forEach(def => {
					const tokensFiltered : FormatToken[] = def.tokens.filter(token => {
						return tokens.includes(token);
					});

					if (tokensFiltered.length >= 2) {
						throw new Error('duplicated tokens in one unit');
					}

					const token : FormatToken = tokensFiltered[0];

					const matchResult : TokenMatchResult | undefined = matchArr.find(one => {
						return one.token === token;
					});

					let value : number | undefined;

					function lengthGuard (token : FormatToken, valueStr : string) {
						if (valueStr.length !== token.length) {
							throw new Error('invalid format string with init data');
						}
					}

					if (!!matchResult) {
						let valueStr : string;

						switch (token) {
							case FormatToken.Year:
								valueStr = initData.substr(matchResult.startIndex, token.length);

								lengthGuard(token, valueStr);

								value = parseInt(valueStr);
								break;

							case FormatToken.YearShort:
								valueStr = initData.substr(matchResult.startIndex, token.length);

								lengthGuard(token, valueStr);

								value = Math.floor(now.getFullYear() / 100) * 100 + parseInt(valueStr);
								break;

							case FormatToken.Month:
								valueStr = initData.substr(matchResult.startIndex, 2);

								// try to parse
								if (isNaN(parseInt(valueStr))) {
									valueStr = initData.substr(matchResult.startIndex, 1);
								}

								value = parseInt(valueStr);
								break;

							case FormatToken.MonthPadded:
								valueStr = initData.substr(matchResult.startIndex, token.length);

								value = parseInt(valueStr);
								break;

							case FormatToken.DayOfMonth:
								valueStr = initData.substr(matchResult.startIndex, 2);

								// try to parse
								if (isNaN(parseInt(valueStr))) {
									valueStr = initData.substr(matchResult.startIndex, 1);
								}

								value = parseInt(valueStr);
								break;

							case FormatToken.DayOfMonthPadded:
								valueStr = initData.substr(matchResult.startIndex, token.length);

								value = parseInt(valueStr);
								break;
						}
					}

					// default value
					if (value === undefined || isNaN(value)) {
						switch (def.unit) {
							case DateTimeUnit.Year:
								value = now.getFullYear();
								break;

							case DateTimeUnit.Month:
							case DateTimeUnit.Date:
								value = 1;
								break;

							case DateTimeUnit.Hours:
							case DateTimeUnit.Minutes:
							case DateTimeUnit.Seconds:
							case DateTimeUnit.Ms:
								value = 0;
								break;
						}
					}

					if (value !== undefined) {
						setParam[def.unit as keyof DateTimeParam] = value;
					}
				});

				// from zero date time
				this._date = new Date(0);

				this.set(setParam);
			}
			else {
				throw new Error('invalid format string');
			}
		}
		*/


		let localeFromAnotherDateTime : undefined | string;

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

	private setDefaultLocale (localeFromAnotherDateTime ? : string) : DateTime {
		const defaultLocale : string = localeFromAnotherDateTime
			|| this.ownLocale
			|| globalConfig.locale
			|| DefaultLocale;

		// set default locale
		this.ownLocale = defaultLocale;

		// load locale
		this.locale(defaultLocale);

		return this;
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

	locale (locale ? : string) : string {
		let returnValue : string; // not undefined

		// get
		if (locale === undefined) {
			returnValue = this.ownLocale;
		}
		else {
			const previousLocale : string = this.ownLocale;

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

	// allow null, no limit number range
	set (param : DateTimeParam) : DateTime {
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
	add (param : DateTimeParam | Duration | DurationParam) : DateTime {
		const setParam : DateTimeParam = {};

		if (isDateTimeParam(param)) {
			DateTimeParamKeys.forEach((_key : DateTimeUnit) => {
				const key : keyof DateTimeParam = _key as keyof DateTimeParam;
				const value : number | undefined = param[key];

				if (value !== undefined) {
					setParam[key] = this[key] + value;
				}
			});

			this.set(setParam);
		}
		else if (param instanceof Duration) {
			DurationParamKeys.forEach(_key => {
				const key : keyof DurationParam = _key as keyof DurationParam;
				const datetimeUnit : keyof DateTimeParam = durationUnitToDateTimeUnit(_key) as keyof DateTimeParam;

				const value : number | undefined = param[key];

				if (value) {
					setParam[datetimeUnit] = this[datetimeUnit] + value;
				}
			});

			this.set(setParam);
		}
		else if (isDurationParam(param)) {
			Object.entries(param).forEach(([key, value]) => {
				const datetimeUnit : keyof DateTimeParam = durationUnitToDateTimeUnit(key as DurationUnit) as keyof DateTimeParam;

				if (value) {
					setParam[datetimeUnit] = this[datetimeUnit] + value;
				}
			});

			this.set(setParam);
		}

		return this;
	}

	get UTC () : DateTime {
		const utcAdded : DateTime = new DateTime(this);
		utcAdded.add({
			minutes : this.timezoneOffset
		});

		return utcAdded;
	}

	startOf (unit : DateTimeUnit | keyof DateTimeParam) : DateTime {
		let foundFlag = false;

		const setParam : DateTimeParam = DateTimeParamKeys.reduce((acc : DateTimeParam, _key : string) => {
			if (!foundFlag) {
				const key : keyof DateTimeParam = _key as keyof DateTimeParam;

				acc[key] = this[key];

				if (key === unit) {
					foundFlag = true;
				}
			}

			return acc;
		}, {} as DateTimeParam);

		return new DateTime(setParam);
	}

	endOf (unit : DateTimeUnit | keyof DateTimeParam) : DateTime {
		const setParam : DateTimeParam = {
			ms : unit === DateTimeUnit.Ms ? 999 : -1
		};

		let foundFlag : boolean;

		DateTimeParamKeys.forEach(key => {
			if (!foundFlag && key !== DateTimeUnit.Ms) {
				const keyAsMember : keyof DateTimeParam = key as keyof DateTimeParam;

				if (unit === key) {
					setParam[keyAsMember] = this[keyAsMember] + 1;

					foundFlag = true;
				}
				else {
					setParam[keyAsMember] = this[keyAsMember];
				}
			}
		});

		return new DateTime(setParam);
	}

	format (format : string) : string {
		let result : string = format;

		const matchArr : TokenMatchResult[] = findFormatTokens(format);

		if (matchArr?.length > 0) {
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

	toLocaleDateTimeString () : string {
		return this.format(localeSetCached[this.locale()].LocaleDateTimeFormat);
	}

	toLocaleDateString () : string {
		return this.format(localeSetCached[this.locale()].LocaleDateFormat);
	}

	toLocaleTimeString () : string {
		return this.format(localeSetCached[this.locale()].LocaleTimeFormat);
	}

	diff (
		date : InitDataFormat,
		unit : ('year' | 'quarter' | 'month' | 'week' | 'date' | 'hours' | 'minutes' | 'seconds' | 'ms') = DateTimeUnit.Ms
	) : number {
		let dateWith : DateTime;

		if (date instanceof DateTime) {
			dateWith = date;
		}
		else {
			dateWith = new DateTime(date);
		}

		let diffValue ! : number;

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

				const numberOfDays : number = Math.floor((+biggerDate - +smallerDate) / DaysToMs);

				// add 1 for day starting from 0
				const diffWeeks : number = Math.ceil(sign * (smallerDate.day + 1 + numberOfDays) / 7);

				// can be -0
				diffValue = Object.is(diffWeeks, -0)
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

	isBefore (
		date : InitDataFormat,
		unit : DateTimeUnit | keyof DateTimeParam = DateTimeUnit.Ms
	) : boolean {
		return this.diff(date, unit) < 0;
	}

	isBeforeOrEqual (
		date : InitDataFormat,
		unit : DateTimeUnit | keyof DateTimeParam = DateTimeUnit.Ms
	) : boolean {
		return this.diff(date, unit) <= 0;
	}

	isAfter (
		date : InitDataFormat,
		unit : DateTimeUnit | keyof DateTimeParam = DateTimeUnit.Ms
	) : boolean {
		return this.diff(date, unit) > 0;
	}

	isAfterOrEqual (
		date : InitDataFormat,
		unit : DateTimeUnit | keyof DateTimeParam = DateTimeUnit.Ms
	) : boolean {
		return this.diff(date, unit) >= 0;
	}

	isBetween (
		date1 : InitDataFormat,
		date2 : InitDataFormat,
		unit : DateTimeUnit | keyof DateTimeParam = DateTimeUnit.Ms
	) : boolean {
		const [smallerDate, biggerDate] = sortDate(date1, date2);

		return this.diff(smallerDate, unit) > 0
			&& this.diff(biggerDate, unit) < 0;
	}

	isBetweenOrEqual (
		date1 : InitDataFormat,
		date2 : InitDataFormat,
		unit : DateTimeUnit | keyof DateTimeParam = DateTimeUnit.Ms
	) : boolean {
		const [smallerDate, biggerDate] = sortDate(date1, date2);

		return this.diff(smallerDate, unit) >= 0
			&& this.diff(biggerDate, unit) <= 0;
	}

	// TODO:
	// relativeTo(datetime : DateTime, unit : DateTimeUnit)

	// TODO:
	// at(countryCode: string, city : string) : DateTime;

	getCalendar () : Calendar {
		const dates : DateTime[] = newArray<DateTime>(this.daysInMonth, (i) : DateTime => {
			return new DateTime(this)
				.set({
					date : i + 1
				})
				.startOf(DateTimeUnit.Date);
		});

		return {
			year : this.year,
			month : this.month,

			dates
		};
	}

}
