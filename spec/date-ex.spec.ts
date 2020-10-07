import { expect } from 'chai';

import { DateEx } from '../src/date-ex';
import { DatetimeSetParamKeys, FormatDesignator } from '../src/constants';
import { newArray, padDigit } from '../src/util';


const MilliSecondsCloseTo : number = 10;

describe('DateEx', () => {
	describe('constructor()', () => {
		it('empty initializer', () => {
			const now : Date = new Date();
			const newDate : DateEx = new DateEx();

			expect(newDate).to.be.ok;

			expect(+now).to.be.closeTo(+newDate, MilliSecondsCloseTo);

			expect(newDate.year).to.be.eql(now.getFullYear());
			expect(newDate.month).to.be.eql(now.getMonth() + 1);
			expect(newDate.date).to.be.eql(now.getDate());

			expect(newDate.hours).to.be.eql(now.getHours());
			expect(newDate.minutes).to.be.eql(now.getMinutes());
			expect(newDate.seconds).to.be.eql(now.getSeconds());
			expect(newDate.ms).to.be.closeTo(now.getMilliseconds(), MilliSecondsCloseTo);
		});

		// describe('by string', () => {
		// 	describe('by date string', () => {
		// 		describe('ok', () => {
		// 			it('YYYY-MM-DD', () => {
		// 				const now : Date = new Date();
		//
		// 				const dateStr : string = [
		// 					now.getFullYear(),
		// 					padDigit(now.getMonth() + 1, 2),
		// 					padDigit(now.getDate(), 2)
		// 				].join('-');
		//
		// 				const newDate : Date = new Date(dateStr);
		// 				const timezoneOffsetInHours : number = now.getTimezoneOffset() / 60;
		//
		// 				const newDateEx : DateEx = new DateEx(dateStr);
		//
		// 				expect(newDateEx).to.be.ok;
		//
		// 				expect(+newDateEx).to.be.eql(+newDate);
		//
		// 				expect(newDateEx.year).to.be.eql(newDate.getFullYear());
		// 				expect(newDateEx.month).to.be.eql(newDate.getMonth() + 1);
		// 				expect(newDateEx.date).to.be.eql(newDate.getDate());
		//
		// 				expect(newDateEx.hours).to.be.eql(-timezoneOffsetInHours);
		// 				expect(newDateEx.minutes).to.be.eql(0);
		// 				expect(newDateEx.seconds).to.be.eql(0);
		// 				expect(newDateEx.ms).to.be.eql(0);
		// 			});
		//
		// 			it('YYYY-MM', () => {
		// 				const now : Date = new Date();
		//
		// 				const dateStr : string = [
		// 					now.getFullYear(),
		// 					padDigit(now.getMonth() + 1, 2)
		// 				].join('-');
		//
		// 				const newDate : Date = new Date(dateStr);
		// 				const timezoneOffsetInHours : number = now.getTimezoneOffset() / 60;
		//
		// 				const newDateEx : DateEx = new DateEx(dateStr);
		//
		// 				expect(newDateEx).to.be.ok;
		//
		// 				expect(+newDateEx).to.be.eql(+newDate);
		//
		// 				expect(newDateEx.year).to.be.eql(newDate.getFullYear());
		// 				expect(newDateEx.month).to.be.eql(newDate.getMonth() + 1);
		// 				expect(newDateEx.date).to.be.eql(1);
		//
		// 				expect(newDateEx.hours).to.be.eql(-timezoneOffsetInHours);
		// 				expect(newDateEx.minutes).to.be.eql(0);
		// 				expect(newDateEx.seconds).to.be.eql(0);
		// 				expect(newDateEx.ms).to.be.eql(0);
		// 			});
		// 		});
		//
		// 		describe('failed', () => {
		// 			// YYYYMM assumes hhmmss
		//
		// 			it('YYYYMMDD', () => {
		// 				const now : Date = new Date();
		//
		// 				const dateStr : string = [
		// 					now.getFullYear(),
		// 					padDigit(now.getMonth() + 1, 2),
		// 					padDigit(now.getDate(), 2)
		// 				].join('');
		//
		//
		// 				expect(() => new DateEx(dateStr)).throws();
		// 			});
		// 		});
		//
		// 		// TODO:
		// 		// --MM-DD
		// 		// --MMDD[1]
		// 	});
		//
		// 	xdescribe('by time string', () => {
		// 		describe('no timezone', () => {
		// 			// TODO:
		// 			// hh:mm:ss.sss
		// 			// Thhmmss.sss
		// 			// hh:mm:ss
		// 			// Thhmmss
		// 			// hh:mm
		// 			// Thhmm
		// 			// Thh
		// 		});
		//
		// 		describe('with timezone', () => {
		// 			// TODO:
		// 			// <time>Z
		// 			// <time>±hh:mm
		// 			// <time>±hhmm
		// 			// <time>±hh
		//
		// 			it('YYYY-MM-DDTHH:mm:ssZ', () => {
		// 				const now : Date = new Date();
		//
		// 				const newDate : Date = new Date(now);
		//
		// 				const dateStr : string = [
		// 					newDate.getFullYear(),
		// 					padDigit(newDate.getMonth() + 1, 2),
		// 					padDigit(newDate.getDate(), 2)
		// 				].join('-');
		//
		// 				const timeStr : string = [
		// 					padDigit(newDate.getHours(), 2),
		// 					padDigit(newDate.getMinutes(), 2),
		// 					padDigit(newDate.getSeconds(), 2)
		// 				].join(':');
		//
		// 				const newDateEx : DateEx = new DateEx(`${ dateStr }T${ timeStr }Z`);
		//
		// 				expect(newDateEx).to.be.ok;
		//
		// 				expect(newDateEx.year).to.be.eql(newDate.getFullYear());
		// 				expect(newDateEx.month).to.be.eql(newDate.getMonth() + 1);
		// 				expect(newDateEx.date).to.be.eql(newDate.getDate());
		//
		// 				expect(newDateEx.hours).to.be.eql(newDate.getHours());
		// 				expect(newDateEx.minutes).to.be.eql(newDate.getMinutes());
		// 				expect(newDateEx.seconds).to.be.eql(newDate.getSeconds());
		// 				expect(newDateEx.ms).to.be.eql(newDate.getMilliseconds());
		// 			});
		//
		// 			it('YYYY-MM-DDTHH:mm:ss.SSSZ', () => {
		// 				const now : Date = new Date();
		//
		// 				const newDate : Date = new Date(now);
		//
		// 				const dateStr : string = [
		// 					newDate.getFullYear(),
		// 					padDigit(newDate.getMonth() + 1, 2),
		// 					padDigit(newDate.getDate(), 2)
		// 				].join('-');
		//
		// 				const timeStr : string = [
		// 					padDigit(newDate.getHours(), 2),
		// 					padDigit(newDate.getMinutes(), 2),
		// 					padDigit(newDate.getSeconds(), 2)
		// 				].join(':') + `.${ padDigit(newDate.getMilliseconds(), 3) }`;
		//
		// 				const newDateEx : DateEx = new DateEx(`${ dateStr }T${ timeStr }Z`);
		//
		// 				expect(newDateEx).to.be.ok;
		//
		// 				expect(newDateEx.year).to.be.eql(newDate.getFullYear());
		// 				expect(newDateEx.month).to.be.eql(newDate.getMonth() + 1);
		// 				expect(newDateEx.date).to.be.eql(newDate.getDate());
		//
		// 				expect(newDateEx.hours).to.be.eql(newDate.getHours());
		// 				expect(newDateEx.minutes).to.be.eql(newDate.getMinutes());
		// 				expect(newDateEx.seconds).to.be.eql(newDate.getSeconds());
		// 				expect(newDateEx.ms).to.be.eql(newDate.getMilliseconds());
		// 			});
		// 		});
		// 	});
		// });

		describe('with Date', () => {
			it('ok', () => {
				const now : Date = new Date();

				const newDate : Date = new Date(now);
				const newDateEx : DateEx = new DateEx(now);

				expect(newDateEx).to.be.ok;

				expect(+newDate).to.be.eql(+newDateEx);

				expect(newDateEx.year).to.be.eql(newDate.getFullYear());
				expect(newDateEx.month).to.be.eql(newDate.getMonth() + 1);
				expect(newDateEx.date).to.be.eql(newDate.getDate());

				expect(newDateEx.hours).to.be.eql(newDate.getHours());
				expect(newDateEx.minutes).to.be.eql(newDate.getMinutes());
				expect(newDateEx.seconds).to.be.eql(newDate.getSeconds());
				expect(newDateEx.ms).to.be.eql(newDate.getMilliseconds());
			});
		});

		describe('with DateEx', () => {
			it('ok', () => {
				const now : Date = new Date();

				const newDateEx1 : DateEx = new DateEx(now);
				const newDateEx2 : DateEx = new DateEx(newDateEx1);

				expect(newDateEx2).to.be.ok;

				expect(+newDateEx1).to.be.eql(+newDateEx2);

				expect(newDateEx2.year).to.be.eql(newDateEx1.year);
				expect(newDateEx2.month).to.be.eql(newDateEx1.month);
				expect(newDateEx2.date).to.be.eql(newDateEx1.date);

				expect(newDateEx2.hours).to.be.eql(newDateEx1.hours);
				expect(newDateEx2.minutes).to.be.eql(newDateEx1.minutes);
				expect(newDateEx2.seconds).to.be.eql(newDateEx1.seconds);
				expect(newDateEx2.ms).to.be.eql(newDateEx1.ms);
			});
		});

		describe('with set param', () => {
			DatetimeSetParamKeys.forEach(key => {
				it(key, () => {
					const date : DateEx = new DateEx({
						[key] : key === 'year'
							? 1903
							: 3
					});

					DatetimeSetParamKeys.forEach(checkKey => {
						if (checkKey === key) {
							expect(date[checkKey]).to.be.eql(
								checkKey === 'year'
									? 1903
									: 3
							);
						}
						else {
							expect(date[checkKey]).to.be.eql(
								checkKey === 'year'
									? 1900
									: ((checkKey === 'month' || checkKey === 'date')
										? 1
										: 0
									)
							);
						}
					});
				});
			});

			it('all', () => {
				const now : Date = new Date();

				const newDate : DateEx = new DateEx({
					year : now.getFullYear(),
					month : now.getMonth() + 1,
					date : now.getDate(),

					hours : now.getHours(),
					minutes : now.getMinutes(),
					seconds : now.getSeconds(),
					ms : now.getMilliseconds()
				});

				expect(+newDate).to.be.eql(+now);

				expect(newDate.year).to.be.eql(now.getFullYear());
				expect(newDate.month).to.be.eql(now.getMonth() + 1);
				expect(newDate.date).to.be.eql(now.getDate());

				expect(newDate.hours).to.be.eql(now.getHours());
				expect(newDate.minutes).to.be.eql(now.getMinutes());
				expect(newDate.seconds).to.be.eql(now.getSeconds());
				expect(newDate.ms).to.be.eql(now.getMilliseconds());
			});
		});
	});

	describe('toDate()', () => {
		it('is Date', () => {
			expect(new DateEx().toDate()).to.be.instanceOf(Date);
		});
	});

	describe('set()', () => {
		let refDate : DateEx;

		before(() => {
			refDate = new DateEx(0); // zero base
		});

		DatetimeSetParamKeys.forEach(key => {
			it(key, () => {
				const now : Date = new Date();

				const newDate : DateEx = new DateEx(refDate);

				let changingValue : number;

				switch (key) {
					case 'year':
						changingValue = now.getFullYear();
						break;

					case 'month':
						changingValue = now.getMonth() + 1;
						break;

					case 'date':
						changingValue = now.getDate();
						break;

					case 'hours':
						changingValue = now.getHours();
						break;

					case 'minutes':
						changingValue = now.getMinutes();
						break;

					case 'seconds':
						changingValue = now.getSeconds();
						break;

					case 'ms':
						changingValue = now.getMilliseconds();
						break;


				}

				// set
				newDate.set({
					[key] : changingValue
				});

				// check
				DatetimeSetParamKeys.forEach(checkKey => {
					if (checkKey === key) {
						expect(newDate[checkKey]).to.be.eql(changingValue);
					}
					else {
						expect(newDate[checkKey]).to.be.eql(refDate[checkKey]);
					}
				});
			});
		});
	});

	describe('add()', () => {
		let refDate : DateEx;

		before(() => {
			refDate = new DateEx(0); // zero base
		});

		DatetimeSetParamKeys.forEach(key => {
			it(key, () => {
				const newDate : DateEx = new DateEx(refDate);

				// add
				newDate.add({
					[key] : 1
				});

				// check
				DatetimeSetParamKeys.forEach(checkKey => {
					if (checkKey === key) {
						expect(newDate[checkKey]).to.be.eql(refDate[checkKey] + 1);
					}
					else {
						expect(newDate[checkKey]).to.be.eql(refDate[checkKey]);
					}
				});
			});
		});
	});

	describe('format()', () => {
		describe('year', () => {
			describe(FormatDesignator.Year, () => {
				const years : number[] = newArray(20, i => {
					return 2000 + i; // 2000 ~ 2019
				});

				years.forEach(year => {
					it('' + year, () => {
						const date : DateEx = new DateEx({
							year
						});

						const result : string = date.format(FormatDesignator.Year);

						expect(result).to.be.lengthOf(4);
						expect(result).to.be.eql('' + year);
					});
				});
			});

			describe(FormatDesignator.YearShort, () => {
				const years : number[] = newArray(20, i => {
					return 2000 + i; // 2000 ~ 2019
				});

				years.forEach(year => {
					it('' + year, () => {
						const date : DateEx = new DateEx({
							year
						});

						const result : string = date.format(FormatDesignator.YearShort);

						expect(result).to.be.lengthOf(2);
						expect(result).to.be.eql(('' + year).substr(2, 2));
					});
				});
			});
		});

		describe('month', () => {
			describe(FormatDesignator.Month, () => {
				const months : number[] = newArray(12, i => {
					return i + 1; // 1 ~ 12
				});

				months.forEach(month => {
					it('' + month, () => {
						const date : DateEx = new DateEx({
							month
						});

						const result : string = date.format(FormatDesignator.Month);

						expect(result).to.be.lengthOf(month < 10 ? 1 : 2);
						expect(result).to.be.eql('' + month);
					});
				});
			});

			describe(FormatDesignator.MonthPadded, () => {
				const months : number[] = newArray(12, i => {
					return i + 1; // 1 ~ 12
				});

				months.forEach(month => {
					it('' + month, () => {
						const date : DateEx = new DateEx({
							month
						});

						const result : string = date.format(FormatDesignator.MonthPadded);

						expect(result).to.be.lengthOf(2);
						expect(result).to.be.eql(padDigit(month, 2));
					});
				});
			});

			// TODO: FormatDesignator.MonthStringShort
			// TODO: FormatDesignator.MonthStringLong
		});
	});
});
