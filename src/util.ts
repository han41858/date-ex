import { DateTimeParam, DurationParam, InitDataFormat, LocaleSet, TokenMatchResult } from './interfaces';
import { DateTime } from './date-time';
import { DateTimeParamKeys, DateTimeUnit, DurationParamKeys, DurationUnit, FormatToken } from './constants';

export const newArray = <T> (length : number, callback? : (i : number, arr : T[]) => T) : T[] => {
	const arr : any[] = new Array(length).fill(undefined);

	return (!!callback && typeof callback === 'function')
		? arr.map((nothing, _i : number) : T => callback(_i, arr))
		: arr;
};

export const padDigit = (str : string | number, length : number) : string => {
	return ('' + str).padStart(length, '0');
};

// sanitize removes undefined & null fields from object. default false
export const clone = <T> (obj : T, sanitize : boolean = false) => {
	let result ! : T;

	if (!!obj) {
		let type : string = typeof obj;

		if (type === 'object') {
			const objAsAny : any = obj;

			if (objAsAny.push !== undefined
				&& typeof objAsAny.push === 'function') {
				type = 'array';
			}
			else if (objAsAny.getFullYear !== undefined
				&& typeof objAsAny.getFullYear === 'function') {
				type = 'date';
			}
			else if (objAsAny.byteLength !== undefined) {
				type = 'buffer';
			}
		}

		switch (type) {
			case 'boolean':
			case 'number':
			case 'function':
			case 'string':
			case 'buffer':
				// ok with simple copy
				result = obj;
				break;

			case 'date':
				const objAsDate : Date = obj as any as Date;
				result = new Date(objAsDate) as any as T;
				break;

			case 'array':
				const objAsArray : any[] = obj as any as any[];
				result = objAsArray.map(one => {
					return clone(one);
				}) as any as T;
				break;

			case 'object':
				// sanitize default false
				const objAsObject : object = obj as any as object;
				result = {} as any as T;

				Object.entries(objAsObject).filter(([key, value]) => {
						return sanitize
							? value !== undefined && value !== null
							: true;
					})
					.forEach(([key, value]) => {
						// recursively call
						(result as any)[key] = clone(value, sanitize);
					});
				break;
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

	return dateTime.isValid() ? dateTime.format(format) : date as string;
};

export const isDateTimeParam = (param : any) : param is DateTimeParam => {
	return Object.keys(param).every(key => {
		return DateTimeParamKeys.includes(key as DateTimeUnit);
	});
};

export const isDurationParam = (param : any) : param is DurationParam => {
	return Object.keys(param).every(key => {
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
	const regExp : RegExp = /YYYY|YY|Q|M{1,4}|Www|W{1,2}|[Dd]{1,4}|[aA]|[Hh]{1,2}|m{1,2}|s{1,2}|S{1,3}/;

	const matchArr : TokenMatchResult[] = [];

	let formatFrag : string = formatString;
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
	}

	return matchArr;
};
