import { DateTimeParam, DurationParam, InitDataFormat, LocaleSet } from './interfaces';
import { DateTime } from './date-time';
import { DateTimeParamKeys, DateTimeUnit, DurationParamKeys, DurationUnit } from './constants';

export const newArray = <T> (length : number, callback? : (i? : number, arr? : T[]) => T) : (undefined | T)[] => {
	const arr : any[] = new Array(length).fill(undefined);

	return !!callback && callback instanceof Function ?
		arr.map((nothing, _i : number) : T => callback(_i, arr)) :
		arr as undefined[];
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

// month is real number : 1 ~ 12
export const getLastDateOfMonth = (year : number, month : number) : number => {
	const lastDayOfThisMonth : Date = new Date(year, month, 0);

	return lastDayOfThisMonth.getDate();
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
		return DateTimeParamKeys.includes(key as keyof DateTimeParam);
	});
};

export const isDurationParam = (param : any) : param is DurationParam => {
	return Object.keys(param).every(key => {
		return DurationParamKeys.includes(key as keyof DurationParam);
	});
};

export const durationUnitToDateTimeUnit = (unit : keyof DurationParam) : keyof DateTimeParam => {
	let dateTimeKey ! : keyof DateTimeParam;

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

	return dateTimeKey as keyof DateTimeParam;
};
