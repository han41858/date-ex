import { AnyObject, DateTimeParam, DurationParam, LocaleSet, TokenMatchResult } from './interfaces';
import { DateTime, DateTimeInitDataType } from './date-time';
import {
	DateTimeParamKeys,
	DateTimeUnit,
	DefaultValue,
	DurationParamKeys,
	DurationUnit,
	FormatToken
} from './constants';


export const newArray = <T> (length: number, callback?: (i: number, arr: T[]) => T): T[] => {
	const arr: T[] = new Array(length).fill(undefined);

	return (!!callback && typeof callback === 'function')
		? arr.map((nothing, _i: number): T => callback(_i, arr))
		: arr;
};

export const padDigit = (str: string | number, length: number): string => {
	return ('' + str).padStart(length, '0');
};


enum CloneDataType {
	Boolean = 'boolean',
	Number = 'number',
	Function = 'function',
	String = 'string',
	Buffer = 'buffer',
	Object = 'object',
	Array = 'array',
	Date = 'date',
	RegExp = 'regexp'
}

// sanitize removes undefined & null fields from object. default false
export const clone = <T> (obj: T, sanitize?: boolean): T => {
	let result !: T;

	if (obj) {
		let type: CloneDataType = typeof obj as CloneDataType;

		if (type === CloneDataType.Object) {
			const objAsObject: AnyObject<unknown> = obj as unknown as AnyObject<unknown>;

			if (Array.isArray(objAsObject)) {
				type = CloneDataType.Array;
			}
			else if (objAsObject instanceof Date) {
				type = CloneDataType.Date;
			}
			else if (objAsObject instanceof RegExp) {
				type = CloneDataType.RegExp;
			}
			else if (objAsObject.byteLength
				&& typeof objAsObject.byteLength === 'function') {
				type = CloneDataType.Buffer;
			}
		}

		switch (type) {
			case CloneDataType.Date: {
				const objAsDate: Date = obj as unknown as Date;
				result = new Date(objAsDate) as unknown as T;
				break;
			}

			case  CloneDataType.Array: {
				const objAsArray: unknown[] = obj as unknown as unknown[];
				result = objAsArray.map((one: unknown): unknown => {
					return clone(one);
				}) as unknown as T;
				break;
			}

			case CloneDataType.Object: {
				// sanitize default false
				result = {} as unknown as T;

				const entries: [string, unknown][] = Object.entries(obj)
					.filter(([, value]) => {
						return sanitize
							? value !== undefined && value !== null
							: true;
					});


				for (const [key, value] of entries) {
					// recursively call
					(result as unknown as AnyObject<unknown>)[key] = clone(value, sanitize);
				}
				break;
			}

			default:
				// simple copy
				result = obj;
		}
	}
	else {
		result = obj; // do not copy null & undefined
	}

	return result;
};

export const loadLocaleFile = async (locale: string): Promise<LocaleSet> => {
	const localeSetObj: { localeSet: LocaleSet } = await import(`./locale/${ locale }`);
	return localeSetObj.localeSet;
};

export const wait = (ms?: number): Promise<void> => {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms || 0);
	});
};

export const dateFormat = (date: DateTimeInitDataType, format: string): string => {
	let dateTime: DateTime;

	if (date instanceof DateTime) {
		dateTime = date;
	}
	else {
		dateTime = new DateTime(date);
	}

	return dateTime.valid
		? dateTime.format(format)
		: date as string;
};

export const isDateTimeParam = (param: unknown): param is DateTimeParam => {
	return typeof param === 'object'
		&& Object.keys(param as AnyObject<unknown>).every((key: string): boolean => {
			return DateTimeParamKeys.includes(key as keyof DateTimeParam);
		});
};

export const isDurationParam = (param: unknown): param is DurationParam => {
	return typeof param === 'object'
		&& Object.keys(param as AnyObject<unknown>).every((key: string): boolean => {
			return DurationParamKeys.includes(key as keyof DurationParam);
		});
};

export const durationUnitToDateTimeKey = (unit: keyof DurationParam): keyof DateTimeParam => {
	let dateTimeKey !: keyof DateTimeParam;

	switch (unit) {
		case DurationUnit.Years:
			dateTimeKey = DateTimeUnit.Year;
			break;

		case DurationUnit.Months:
			dateTimeKey = DateTimeUnit.Month;
			break;

		case DurationUnit.Dates:
			dateTimeKey = DateTimeUnit.Date;
			break;

		case DurationUnit.Hours:
			dateTimeKey = DateTimeUnit.Hours;
			break;

		case DurationUnit.Minutes:
			dateTimeKey = DateTimeUnit.Minutes;
			break;

		case DurationUnit.Seconds:
			dateTimeKey = DateTimeUnit.Seconds;
			break;

		case DurationUnit.Ms:
			dateTimeKey = DateTimeUnit.Ms;
			break;
	}

	return dateTimeKey;
};

export const datetimeUnitToDurationUnit = (unit: DateTimeUnit): DurationUnit => {
	let key!: DurationUnit;

	switch (unit) {
		case DateTimeUnit.Year:
			key = DurationUnit.Years;
			break;

		case DateTimeUnit.Month:
			key = DurationUnit.Months;
			break;

		case DateTimeUnit.Date:
			key = DurationUnit.Dates;
			break;

		case DateTimeUnit.Hours:
			key = DurationUnit.Hours;
			break;

		case DateTimeUnit.Minutes:
			key = DurationUnit.Minutes;
			break;

		case DateTimeUnit.Seconds:
			key = DurationUnit.Seconds;
			break;

		case DateTimeUnit.Ms:
			key = DurationUnit.Ms;
			break;
	}

	return key;
};

export const parseDateString = (formatString: string, valueString: string): DateTimeParam => {
	const dateParam: DateTimeParam = {};

	const matchArr: TokenMatchResult[] = findTokens(formatString, valueString);

	if (matchArr.length > 0) {
		// prevent duplicated tokens in a unit
		interface UnitAndTokens {
			unit: DateTimeUnit | string;
			tokens: FormatToken[];
		}

		const unitAndTokens: UnitAndTokens[] = [{
			unit: DateTimeUnit.Year,
			tokens: [FormatToken.Year, FormatToken.YearShort]
		}, {
			unit: DateTimeUnit.Month,
			tokens: [FormatToken.Month, FormatToken.MonthPadded, FormatToken.MonthStringShort, FormatToken.MonthStringLong]
		}, {
			unit: DateTimeUnit.Date,
			tokens: [FormatToken.DayOfMonth, FormatToken.DayOfMonthPadded, FormatToken.DayOfYear, FormatToken.DayOfYearPadded]
		}, {
			unit: 'meridiem',
			tokens: [FormatToken.MeridiemLower, FormatToken.MeridiemCapital]
		}, {
			unit: DateTimeUnit.Hours,
			tokens: [FormatToken.Hours24, FormatToken.Hours24Padded, FormatToken.Hours12, FormatToken.Hours12Padded]
		}, {
			unit: DateTimeUnit.Minutes,
			tokens: [FormatToken.Minutes, FormatToken.MinutesPadded]
		}, {
			unit: DateTimeUnit.Seconds,
			tokens: [FormatToken.Seconds, FormatToken.SecondsPadded]
		}, {
			unit: DateTimeUnit.Ms,
			tokens: [FormatToken.MilliSeconds, FormatToken.MilliSecondsPadded2, FormatToken.MilliSecondsPadded3]
		}];

		const tokens: FormatToken[] = matchArr.map((one: TokenMatchResult): FormatToken => one.token);

		unitAndTokens.forEach((def: UnitAndTokens): void => {
			const tokensFiltered: FormatToken[] = def.tokens.filter((token: FormatToken): boolean => {
				return tokens.includes(token);
			});

			if (tokensFiltered.length >= 2) {
				throw new Error('duplicated tokens in one unit');
			}

			let value: number | undefined;

			if (tokensFiltered.length === 1) {
				const token: FormatToken = tokensFiltered[0];

				const resultFound: TokenMatchResult | undefined = matchArr.find((one: TokenMatchResult): boolean => {
					return token === one.token;
				});

				value = resultFound?.value;
			}

			// default value
			if ((value === undefined || isNaN(value))
				&& dateParam[def.unit as keyof DateTimeParam] === undefined) {
				value = DefaultValue[def.unit as keyof DateTimeParam];
			}

			if (value !== undefined) {
				dateParam[def.unit as keyof DateTimeParam] = value;
			}
		});
	}
	else {
		throw new Error('invalid format string');
	}

	return dateParam;
};

export const findTokens = (formatString: string, valueString?: string): TokenMatchResult[] => {
	// find tokens
	const regExp = /YYYY|YY|Q|M{1,4}|Www|W{1,2}|[Dd]{1,4}|[aA]|[Hh]{1,2}|m{1,2}|s{1,2}|S{1,3}/;

	const matchArr: TokenMatchResult[] = [];

	let execResult: RegExpExecArray | null = regExp.exec(formatString);

	if (!execResult) {
		throw new Error('invalid value string with format string');
	}

	if (valueString !== undefined) {
		let fullFormatStr: string = '';
		let formatStrRemains: string = formatString;
		let valueStrRemains: string | undefined = valueString;
		let omitLength = 0;

		do {
			const token: FormatToken = execResult[0] as FormatToken;
			const regExpStr: string = formatTokenToRegExpStr(token);
			const regExpPartial: RegExp = new RegExp(regExpStr);

			fullFormatStr += valueStrRemains.substr(0, execResult.index);
			// skip don't care string
			valueStrRemains = valueStrRemains.substr(execResult.index);

			// not null
			const fragResult: RegExpExecArray = regExpPartial.exec(valueStrRemains) as RegExpExecArray;
			const valueStr: string = fragResult[0];
			const value: number = parseValueStr(token, valueStr);

			matchArr.push({
				startIndex: omitLength + execResult.index,
				token,
				value
			});

			fullFormatStr += regExpStr;
			formatStrRemains = formatStrRemains.substr(execResult.index + token.length);
			valueStrRemains = valueStrRemains.substr(fragResult.index + valueStr.length);
			omitLength += execResult.index + token.length;

			execResult = regExp.exec(formatStrRemains);

			if (!execResult) {
				fullFormatStr += valueStrRemains;
			}
		}
		while (execResult);


		// check fields with all tokens
		const fullRegExp: RegExp = new RegExp(fullFormatStr);

		if (!fullRegExp.test(valueString)) {
			throw new Error('invalid value string with format string');
		}
	}
	else {
		// only format string
		let formatStrRemains: string = formatString;
		let omitLength = 0;

		do {
			const token: FormatToken = execResult[0] as FormatToken;

			matchArr.push({
				startIndex: omitLength + execResult.index,
				token
			});

			formatStrRemains = formatStrRemains.substr(execResult.index + token.length);
			omitLength += execResult.index + token.length;

			execResult = regExp.exec(formatStrRemains);
		}
		while (execResult);
	}

	return matchArr;
};

const formatTokenToRegExpStr = (token: FormatToken): string => {
	let regExpStr: string;

	// order by min, max length
	switch (token) {
		// length : 1
		case FormatToken.DayOfWeek:
			regExpStr = '\\d{1}';
			break;

		// length : 1 ~ 2
		case FormatToken.YearShort:
		case FormatToken.Month:
		case FormatToken.DayOfMonth:
		case FormatToken.Week:
		case FormatToken.Hours24:
		case FormatToken.Hours12:
		case FormatToken.Minutes:
		case FormatToken.Seconds:
			regExpStr = '\\d{1,2}';
			break;

		// length : 1 ~ 3
		case FormatToken.DayOfYear:
		case FormatToken.MilliSeconds:
			regExpStr = '\\d{1,3}';
			break;

		// length : 2
		case FormatToken.MonthPadded:
		case FormatToken.WeekPadded:
		case FormatToken.DayOfMonthPadded:
		case FormatToken.Hours24Padded:
		case FormatToken.Hours12Padded:
		case FormatToken.MinutesPadded:
		case FormatToken.SecondsPadded:
		case FormatToken.MilliSecondsPadded2:
			regExpStr = '\\d{2}';
			break;

		case FormatToken.DayOfYearPadded:
		case FormatToken.MilliSecondsPadded3:
			regExpStr = '\\d{3}';
			break;

		// length : 3 ~ 6
		case FormatToken.Year:
			regExpStr = '\\d{3,6}';
			break;

		// special case
		case FormatToken.WeekPaddedWithPrefix:
			regExpStr = 'W\\d{2}';
			break;

		// TODO: MonthStringShort, MonthStringLong
		// TODO: DayOfWeekStringShort, DayOfWeekStringMiddle, DayOfWeekStringLong
		// TODO: MeridiemLower, MeridiemCapital - multi language
		// TODO: timezone

		default:
			regExpStr = 'TODO';
	}

	return regExpStr;
};

const parseValueStr = (token: FormatToken, valueStr: string): number => {
	let value: number;

	switch (token) {
		// string
		case FormatToken.MonthStringShort:
		case FormatToken.MonthStringLong:
			// value = valueStr; // TODO: parse to real month number
			value = 0;
			break;

		// special case
		case FormatToken.YearShort:
			value = 1900 + parseInt(valueStr);
			break;

		// number
		default:
			value = parseInt(valueStr);
	}

	return value;
};


type SafeAddDataType = number | undefined | null;

export const safeAdd = (a: SafeAddDataType, b: SafeAddDataType): number => {
	return (a || 0) + (b || 0);
};
