export const padDigit = (str : string | number, length : number) : string => {
	return ('' + str).padStart(length, '0');
};

// // RFC 3339 (https://www.ietf.org/rfc/rfc3339.txt) : YYYY-MM-DDThh:mm:ss[.SSSZ]
// export const rfc3339Tester = (value : string) : boolean => {
// 	return /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3])(:([0-5][0-9])){2}(\.\d+)?(Z|[-+]\d{2}:\d{2})?$/.test(value);
// };

// export const iso8601DateTester = (value : string) : boolean => {
// 	const years : string = '(\\d{4})';
// 	const months : string = '(0[1-9]|1[0-2])';
// 	const dates : string = '(0[1-9]|[1-2][0-9]|3[0-1])';
// 	const dateOfYear : string = '(00[1-9]|0[1-9][0-9]|[1-2]\\d{2}|3[0-5]\\d|36[0-5])'; // TODO: 366 for leap year
// 	const weeks : string = '(W(0[1-9]|[2-4][0-9]|5[0-3]))';
// 	const days : string = '[1-7]';
//
// 	return [
// 		new RegExp(`^[-+]?${ years }$`), // years : YYYY, +YYYY, -YYYY
// 		new RegExp(`^${ years }-${ months }(-${ dates })?$`), // calendar dates : YYYY-MM-DD, YYYY-MM
// 		new RegExp(`^${ years }${ months }${ dates }$`), // calendar dates : YYYYMMDD
// 		new RegExp(`^--${ months }-?${ dates }$`), // calendar dates : --MM-DD, --MMDD
// 		new RegExp(`^${ years }-${ weeks }(-${ days })?$`), // week dates : YYYY-Www, YYYY-Www-D
// 		new RegExp(`^${ years }${ weeks }(${ days })?$`), // week dates : YYYYWww, YYYYWwwD
// 		new RegExp(`^${ years }-?${ dateOfYear }$`) // ordinal dates : YYYY-DDD, YYYYDDD
// 	].some((regExp : RegExp) => {
// 		return regExp.test(value);
// 	});
// };

// export const iso8601TimeTester = (value : string) : boolean => {
// 	const hours : string = '([0-1]\\d|2[0-3])';
// 	const minutes : string = '([0-5]\\d)';
// 	const seconds : string = '([0-5]\\d|60)'; // 60 for leap second
// 	const ms : string = '(\\.[0-9]+)';
//
// 	return [
// 		new RegExp(`^(${ hours }|24)$`), // hh
// 		new RegExp(`^((${ hours }:${ minutes })|24:00)$`), // hh:mm
// 		new RegExp(`^((${ hours }:${ minutes }:${ seconds })|24:00:00)$`), // hh:mm:ss
// 		new RegExp(`^((${ hours }:${ minutes }:${ seconds }${ ms })|24:00:00\.0+)$`), // hh:mm:ss
//
// 		new RegExp(`^(${ hours }${ minutes }|2400)$`), // hhmm
// 		new RegExp(`^(${ hours }${ minutes }${ seconds }|240000)$`), // hhmmss
// 		new RegExp(`^(${ hours }${ minutes }${ seconds }${ ms }|240000\.0+)$`) // hhmmss.sss
// 	]
// 		.some((regExp : RegExp) => {
// 			return regExp.test(value);
// 		});
// };

// export const iso8601DateTimeTester = (value : string) : boolean => {
// 	let valid : boolean = false;
//
// 	if (/.+T.+/.test(value) // should have 1 'T'
// 		&& /(Z|[-+]\d{2}:?\d{2})$/.test(value) // should end with 'Z' or timezone
// 	) {
// 		let [date, time] = value.split('T');
//
// 		if (time.endsWith('Z')) {
// 			time = time.replace('Z', '');
// 		}
// 		else {
// 			const timezoneStartIndex : number = time.includes('+') ? time.indexOf('+') : time.indexOf('-');
//
// 			time = time.substr(0, timezoneStartIndex);
// 		}
//
// 		valid = iso8601DateTester(date) && iso8601TimeTester(time);
// 	}
//
// 	return valid;
// };
