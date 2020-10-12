import { DateProxy } from './date-proxy';

import { DateTimeSetParam, InitDataFormat, LocaleSet } from './interfaces';
import { DatetimeSetParamKeys, DefaultLocale, FormatDesignator, ZeroDaySetter } from './constants';
import { clone, padDigit } from './util';

// load default locale
import locale from './locale/en';


// internal global storage
const globalConfig : {
	locale? : string,
} = {
	locale : undefined
};

const localeSet : {
	[key : string] : LocaleSet;
} = {
	[DefaultLocale] : locale
};


export class DateEx extends DateProxy {

	private ownLocale ! : string;

	// private dateFormat : string;


	constructor (initData? : InitDataFormat, formatForString? : string) {
		super(initData);

		let localeFromAnotherDateEx : undefined | string = undefined;

		if (initData !== null
			&& !(initData instanceof Date)
			&& !(initData instanceof DateEx)
			&& typeof initData === 'object') {
			// with DateTimeSetParam
			const initDataKeys : string[] = Object.keys(initData);

			if (initDataKeys.every(key => {
				return DatetimeSetParamKeys.includes(key as keyof DateTimeSetParam);
			})) {
				// others 0
				const setParam : DateTimeSetParam = Object.assign(clone(ZeroDaySetter), initData);

				this.set(setParam);
			}
		}

		if (initData instanceof DateEx) {
			localeFromAnotherDateEx = initData.locale();
		}

		// set default locale
		const defaultLocale : string = localeFromAnotherDateEx || globalConfig.locale || DefaultLocale;

		this.locale(defaultLocale);
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

	// global locale
	static locale (locale : string) : void {
		globalConfig.locale = locale;
	}

	locale (locale? : string) : string {
		if (!!locale) {
			// TODO: check validation
			this.ownLocale = locale;
		}

		return this.ownLocale;
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

	format (format : string) : string {
		return format
			.replace(new RegExp(FormatDesignator.Year), '' + this.year)
			.replace(new RegExp(FormatDesignator.YearShort), ('' + this.year).substr(2, 2))

			.replace(new RegExp(FormatDesignator.MonthPadded), padDigit(this.month, 2))
			.replace(new RegExp(FormatDesignator.Month), ('' + this.month))

			.replace(new RegExp(FormatDesignator.WeekPadded), padDigit(this.weekOfYear, 2))
			.replace(new RegExp(FormatDesignator.Week), ('' + this.weekOfYear))

			.replace(new RegExp(FormatDesignator.DayOfYearPadded), padDigit('' + this.dayOfYear, 3))
			.replace(new RegExp(FormatDesignator.DayOfYear), ('' + this.dayOfYear))
			.replace(new RegExp(FormatDesignator.DayOfMonthPadded), padDigit('' + this.date, 2))
			.replace(new RegExp(FormatDesignator.DayOfMonth), ('' + this.date))

			.replace(new RegExp(FormatDesignator.DayOfWeek), ('' + this.day))

			.replace(new RegExp(FormatDesignator.Hours24Padded), padDigit(this.hours, 2))
			.replace(new RegExp(FormatDesignator.Hours24), '' + this.hours)
			.replace(new RegExp(FormatDesignator.Hours12Padded), padDigit(this.hours12, 2))
			.replace(new RegExp(FormatDesignator.Hours12), '' + (this.hours12))

			.replace(new RegExp(FormatDesignator.MinutesPadded), padDigit(this.minutes, 2))
			.replace(new RegExp(FormatDesignator.Minutes), '' + this.minutes)

			.replace(new RegExp(FormatDesignator.SecondsPadded), padDigit(this.seconds, 2))
			.replace(new RegExp(FormatDesignator.Seconds), '' + this.seconds)

			.replace(new RegExp(FormatDesignator.MilliSecondsPadded3), padDigit(this.ms, 3))
			.replace(new RegExp(FormatDesignator.MilliSecondsPadded2), padDigit(this.ms < 100 ? this.ms : Math.floor(this.ms / 10), 2))
			.replace(new RegExp(FormatDesignator.MilliSeconds), '' + this.ms);

		// after minutes designator 'm'
		// .replace(new RegExp(FormatDesignator.AmPmLower), this.locale.Meridiem[this.isAm ? 0 : 1].toLowerCase())
		// .replace(new RegExp(FormatDesignator.AmPmCapital), this.locale.Meridiem[this.isAm ? 0 : 1].toUpperCase());
	}

	// TODO: diff()

	// TODO: isBefore()
	// TODO: isAfter()
	// TODO: isBetween()

}
