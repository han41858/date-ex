import { DateTimeParam, DurationParam, InitDataFormat, LocaleSet, TokenMatchResult } from './interfaces';
import { DateTime } from './date-time';
import { DateTimeParamKeys, DateTimeUnit, DurationParamKeys, DurationUnit, FormatToken } from './constants';


interface AnyObject {
	[index : string] : unknown;
}


export const newArray = <T> (length : number, callback? : (i : number, arr : T[]) => T) : T[] => {
	const arr : T[] = new Array(length).fill(undefined);

	return (!!callback && typeof callback === 'function')
		? arr.map((nothing, _i : number) : T => callback(_i, arr))
		: arr;
};

export const padDigit = (str : string | number, length : number) : string => {
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
export const clone = <T> (obj : T, sanitize? : boolean) : T => {
	let result ! : T;

	if (obj) {
		let type : CloneDataType = typeof obj as CloneDataType;

		if (type === CloneDataType.Object) {
			const objAsObject : AnyObject = obj as unknown as AnyObject;

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
				const objAsDate : Date = obj as unknown as Date;
				result = new Date(objAsDate) as unknown as T;
				break;
			}

			case  CloneDataType.Array: {
				const objAsArray : unknown[] = obj as unknown as unknown[];
				result = objAsArray.map(one => {
					return clone(one);
				}) as unknown as T;
				break;
			}

			case CloneDataType.Object: {
				// sanitize default false
				result = {} as unknown as T;

				const entries : [string, unknown][] = Object.entries(obj)
					.filter(([, value]) => {
						return sanitize
							? value !== undefined && value !== null
							: true;
					});


				for (const [key, value] of entries) {
					// recursively call
					(result as unknown as AnyObject)[key] = clone(value, sanitize);
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

export const loadLocaleFile = async (locale : string) : Promise<LocaleSet> => {
	const localeSetObj : { locale : LocaleSet } = await import(`./locale/${ locale }.js`);
	return localeSetObj.locale;
};

export const wait = (ms ? : number) : Promise<void> => {
	return new Promise<void>(resolve => setTimeout(() => {
		resolve();
	}, ms || 0));
};

export const dateFormat = (date : InitDataFormat, format : string) : string => {
	let dateTime : DateTime;

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

export const isDateTimeParam = (param : unknown) : param is DateTimeParam => {
	return typeof param === 'object'
		&& Object.keys(param as AnyObject).every(key => {
			return DateTimeParamKeys.includes(key as DateTimeUnit);
		});
};

export const isDurationParam = (param : unknown) : param is DurationParam => {
	return typeof param === 'object'
		&& Object.keys(param as AnyObject).every(key => {
			return DurationParamKeys.includes(key as DurationUnit);
		});
};

export const durationUnitToDateTimeUnit = (unit : DurationUnit) : DateTimeUnit => {
	let dateTimeKey ! : DateTimeUnit;

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

export const datetimeUnitToDurationUnit = (unit : DateTimeUnit) : DurationUnit => {
	let key! : DurationUnit;

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

export const sortDate = (...dates : InitDataFormat[]) : DateTime[] => {
	const dateArr : DateTime[] = dates.map(date => new DateTime(date));

	return dateArr.sort((a, b) => {
		return +a - +b;
	});
};

export const findFormatTokens = (formatString : string) : TokenMatchResult[] => {
	const regExp = /YYYY|YY|Q|M{1,4}|Www|W{1,2}|[Dd]{1,4}|[aA]|[Hh]{1,2}|m{1,2}|s{1,2}|S{1,3}/;

	const matchArr : TokenMatchResult[] = [];

	let formatFrag : string = formatString;
	let omitLength = 0;

	let execResult : RegExpExecArray | null = regExp.exec(formatFrag);

	if (execResult) {
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
		while (execResult);
	}

	return matchArr;
};
