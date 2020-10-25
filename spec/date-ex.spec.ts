import { expect } from 'chai';

import { DateEx } from '../src/date-ex';
import { DateTimeDimension, DatetimeSetParamKeys, DefaultLocale, FormatToken } from '../src/constants';
import { loadLocaleFile, newArray, padDigit, wait } from '../src/util';
import { InitDataFormat, LocaleSet } from '../src/interfaces';


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

		// test string initializer
		describe('by string', () => {
			describe('by date string', () => {
				describe('ok', () => {
					it('YYYY-MM-DD', () => {
						const now : Date = new Date();

						const dateStr : string = [
							now.getFullYear(),
							padDigit(now.getMonth() + 1, 2),
							padDigit(now.getDate(), 2)
						].join('-');

						const newDate : Date = new Date(dateStr);
						const timezoneOffsetInHours : number = now.getTimezoneOffset() / 60;

						const newDateEx : DateEx = new DateEx(dateStr);

						expect(newDateEx).to.be.ok;

						expect(+newDateEx).to.be.eql(+newDate);

						expect(newDateEx.year).to.be.eql(newDate.getFullYear());
						expect(newDateEx.month).to.be.eql(newDate.getMonth() + 1);
						expect(newDateEx.date).to.be.eql(newDate.getDate());

						expect(newDateEx.hours).to.be.eql(-timezoneOffsetInHours);
						expect(newDateEx.minutes).to.be.eql(0);
						expect(newDateEx.seconds).to.be.eql(0);
						expect(newDateEx.ms).to.be.eql(0);
					});

					it('YYYY-MM', () => {
						const now : Date = new Date();

						const dateStr : string = [
							now.getFullYear(),
							padDigit(now.getMonth() + 1, 2)
						].join('-');

						const newDate : Date = new Date(dateStr);
						const timezoneOffsetInHours : number = now.getTimezoneOffset() / 60;

						const newDateEx : DateEx = new DateEx(dateStr);

						expect(newDateEx).to.be.ok;

						expect(+newDateEx).to.be.eql(+newDate);

						expect(newDateEx.year).to.be.eql(newDate.getFullYear());
						expect(newDateEx.month).to.be.eql(newDate.getMonth() + 1);
						expect(newDateEx.date).to.be.eql(1);

						expect(newDateEx.hours).to.be.eql(-timezoneOffsetInHours);
						expect(newDateEx.minutes).to.be.eql(0);
						expect(newDateEx.seconds).to.be.eql(0);
						expect(newDateEx.ms).to.be.eql(0);
					});

					it('--MM-DD', () => {
						const now : Date = new Date();

						const dateStr : string = [
							'--',
							padDigit(now.getMonth(), 2), // not +1
							'-',
							padDigit(now.getDate(), 2)
						].join('');

						const newDate : Date = new Date(dateStr);

						const newDateEx : DateEx = new DateEx(dateStr);

						expect(newDateEx).to.be.ok;

						expect(+newDateEx).to.be.eql(+newDate);

						expect(newDateEx.year).to.be.eql(newDate.getFullYear());
						expect(newDateEx.month).to.be.eql(newDate.getMonth() + 1);
						expect(newDateEx.date).to.be.eql(newDate.getDate());

						expect(newDateEx.hours).to.be.eql(0);
						expect(newDateEx.minutes).to.be.eql(0);
						expect(newDateEx.seconds).to.be.eql(0);
						expect(newDateEx.ms).to.be.eql(0);
					});
				});

				describe('failed', () => {
					// YYYYMM assumes hhmmss

					it('YYYYMMDD', () => {
						const now : Date = new Date();

						const dateStr : string = [
							now.getFullYear(),
							padDigit(now.getMonth() + 1, 2),
							padDigit(now.getDate(), 2)
						].join('');

						expect(new DateEx(dateStr).isValid()).to.be.false;
					});
				});
			});

			describe('by time string', () => {
				describe('no timezone', () => {
					describe('failed', () => {
						it('hh:mm:ss.SSS', () => {
							const now : Date = new Date();

							const timeStr : string = [
								padDigit(now.getHours(), 2),
								':',
								padDigit(now.getMinutes(), 2),
								':',
								padDigit(now.getSeconds(), 2),
								'.',
								padDigit(now.getMilliseconds(), 3)
							].join('');

							const dateEx : DateEx = new DateEx(timeStr);

							expect(dateEx.isValid()).to.be.false;
						});

						it('Thh:mm:ss.SSS', () => {
							const now : Date = new Date();

							const timeStr : string = [
								'T',
								padDigit(now.getHours(), 2),
								':',
								padDigit(now.getMinutes(), 2),
								':',
								padDigit(now.getSeconds(), 2),
								'.',
								padDigit(now.getMilliseconds(), 3)
							].join('');

							const dateEx : DateEx = new DateEx(timeStr);

							expect(dateEx.isValid()).to.be.false;
						});

						it('hh:mm:ss', () => {
							const now : Date = new Date();

							const timeStr : string = [
								padDigit(now.getHours(), 2),
								':',
								padDigit(now.getMinutes(), 2),
								':',
								padDigit(now.getSeconds(), 2)
							].join('');

							const dateEx : DateEx = new DateEx(timeStr);

							expect(dateEx.isValid()).to.be.false;
						});

						// hhmmss : not error, but invalid parsed with Date

						it('Thhmmss', () => {
							const now : Date = new Date();

							const timeStr : string = [
								'T',
								padDigit(now.getHours(), 2),
								padDigit(now.getMinutes(), 2),
								padDigit(now.getSeconds(), 2)
							].join('');

							const dateEx : DateEx = new DateEx(timeStr);

							expect(dateEx.isValid()).to.be.false;
						});

						it('hh:mm', () => {
							const now : Date = new Date();

							const timeStr : string = [
								padDigit(now.getHours(), 2),
								':',
								padDigit(now.getMinutes(), 2)
							].join('');

							const dateEx : DateEx = new DateEx(timeStr);

							expect(dateEx.isValid()).to.be.false;
						});

						it('Thhmm', () => {
							const now : Date = new Date();

							const timeStr : string = [
								'T',
								padDigit(now.getHours(), 2),
								padDigit(now.getMinutes(), 2)
							].join('');

							const dateEx : DateEx = new DateEx(timeStr);

							expect(dateEx.isValid()).to.be.false;
						});

						it('Thh', () => {
							const now : Date = new Date();

							const timeStr : string = [
								'T',
								padDigit(now.getHours(), 2)
							].join('');

							const dateEx : DateEx = new DateEx(timeStr);

							expect(dateEx.isValid()).to.be.false;
						});
					});
				});
			});
		});

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
						[key] : key === DateTimeDimension.Year
							? 1903
							: 3
					});

					DatetimeSetParamKeys.forEach(checkKey => {
						if (checkKey === key) {
							expect(date[checkKey]).to.be.eql(
								checkKey === DateTimeDimension.Year
									? 1903
									: 3
							);
						}
						else {
							expect(date[checkKey]).to.be.eql(
								checkKey === DateTimeDimension.Year
									? 1900
									: ((checkKey === DateTimeDimension.Month || checkKey === DateTimeDimension.Date)
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

	describe('toJson()', () => {
		it('ok', () => {
			const initParam : InitDataFormat = {
				year : 2020, month : 8, date : 4,
				hours : 13, minutes : 3, seconds : 16, ms : 32
			};

			const result : any = new DateEx(initParam).toJson();

			expect(result).to.be.instanceOf(Object);

			DatetimeSetParamKeys.forEach(key => {
				expect(result[key]).to.be.a('number');
				expect(result[key]).to.be.eql(initParam[key]);
			});
		});
	});

	describe('locale', () => {
		const anotherLocale : string = 'ko-kr';

		beforeEach(async () => {
			// reset locale
			DateEx.locale(DefaultLocale);

			await wait();
		});

		describe('error', () => {
			// undefined is getter
			describe('invalid locale', () => {
				const invalidLocale : string = 'invalid-locale';

				it('with static setter', async () => {
					DateEx.locale(invalidLocale);

					// wait for load
					await wait();

					const date : DateEx = new DateEx();

					// not changed
					expect(date.locale()).to.be.eql(DefaultLocale);
				});

				it('with local setter', async () => {
					const date : DateEx = new DateEx();

					date.locale(invalidLocale);

					// wait for load
					await wait();

					// not changed
					expect(date.locale()).to.be.eql(DefaultLocale);
				});
			});

		});

		it('default locale', async () => {
			const date : DateEx = new DateEx();

			expect(date.locale()).to.be.eql(DefaultLocale);
		});

		it('start with another', async () => {
			DateEx.locale(anotherLocale);

			// wait for load
			await wait();

			const date1 : DateEx = new DateEx();
			const date2 : DateEx = new DateEx();

			expect(date1.locale()).to.be.eql(anotherLocale);
			expect(date2.locale()).to.be.eql(anotherLocale);
		});

		it('change to another', async () => {
			const date1 : DateEx = new DateEx();

			// set locally
			date1.locale(anotherLocale);

			// wait for load
			await wait();

			expect(date1.locale()).to.be.eql(anotherLocale);

			const date2 : DateEx = new DateEx();

			expect(date2.locale()).to.be.eql(DefaultLocale);

			// set globally
			DateEx.locale(anotherLocale);

			// wait for load
			await wait();

			const date3 : DateEx = new DateEx();

			expect(date1.locale()).to.be.eql(anotherLocale);
			expect(date2.locale()).to.be.eql(DefaultLocale);
			expect(date3.locale()).to.be.eql(anotherLocale);
		});

		it('called multiple - global', async () => {
			DateEx.locale(anotherLocale);
			DateEx.locale(DefaultLocale);
			DateEx.locale(anotherLocale);

			// wait for load
			await wait();

			const date : DateEx = new DateEx();
			expect(date.locale()).to.be.eql(anotherLocale);
		});

		it('called multiple - local', async () => {
			const date : DateEx = new DateEx();

			date.locale(anotherLocale);
			date.locale(DefaultLocale);
			date.locale(anotherLocale);

			// wait for load
			await wait();

			expect(date.locale()).to.be.eql(anotherLocale);
		});

		it('from DateEx', async () => {
			const date1 : DateEx = new DateEx();
			date1.locale(anotherLocale);

			// wait for load
			await wait();

			const date2 : DateEx = new DateEx(date1);

			expect(date2.locale()).to.be.eql(anotherLocale);
		});
	});

	describe('set()', () => {
		let refDate : DateEx;

		before(() => {
			refDate = new DateEx(0); // zero base
		});

		it('ok', () => {
			DatetimeSetParamKeys.forEach(key => {
				const now : Date = new Date();

				const newDate : DateEx = new DateEx(refDate);

				let changingValue : number;

				switch (key) {
					case DateTimeDimension.Year:
						changingValue = now.getFullYear();
						break;

					case DateTimeDimension.Month:
						changingValue = now.getMonth() + 1;
						break;

					case DateTimeDimension.Date:
						changingValue = now.getDate();
						break;

					case DateTimeDimension.Hours:
						changingValue = now.getHours();
						break;

					case DateTimeDimension.Minutes:
						changingValue = now.getMinutes();
						break;

					case DateTimeDimension.Seconds:
						changingValue = now.getSeconds();
						break;

					case DateTimeDimension.Ms:
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

		it('ok', () => {
			DatetimeSetParamKeys.forEach(key => {
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
			it(FormatToken.Year, () => {
				const years : number[] = newArray(20, i => {
					return 2000 + i; // 2000 ~ 2019
				});

				years.forEach(year => {
					const date : DateEx = new DateEx({
						year
					});

					const result : string = date.format(FormatToken.Year);

					expect(result).to.be.lengthOf(4);
					expect(result).to.be.eql('' + year);
				});
			});

			it(FormatToken.YearShort, () => {
				const years : number[] = newArray(20, i => {
					return 2000 + i; // 2000 ~ 2019
				});

				years.forEach(year => {
					const date : DateEx = new DateEx({
						year
					});

					const result : string = date.format(FormatToken.YearShort);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(('' + year).substr(2, 2));
				});
			});
		});

		describe('month', () => {
			let defaultLocaleSet : LocaleSet;

			before(async () => {
				defaultLocaleSet = await loadLocaleFile(DefaultLocale);
				DateEx.locale(DefaultLocale);

				await wait();
			});

			it(FormatToken.Month, () => {
				const months : number[] = newArray(12, i => {
					return i + 1; // 1 ~ 12
				});

				months.forEach(month => {
					const date : DateEx = new DateEx({
						month
					});

					const result : string = date.format(FormatToken.Month);

					expect(result).to.be.lengthOf(month < 10 ? 1 : 2);
					expect(result).to.be.eql('' + month);
				});
			});

			it(FormatToken.MonthPadded, () => {
				const months : number[] = newArray(12, i => {
					return i + 1; // 1 ~ 12
				});

				months.forEach(month => {
					const date : DateEx = new DateEx({
						month
					});

					const result : string = date.format(FormatToken.MonthPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(month, 2));
				});
			});

			it(FormatToken.MonthStringShort, () => {
				const months : number[] = newArray(12, i => {
					return i + 1; // 1 ~ 12
				});

				months.forEach((month, i) => {
					const date : DateEx = new DateEx({
						month
					});

					const result : string = date.format(FormatToken.MonthStringShort);

					expect(result).to.be.eql(defaultLocaleSet.MonthShort[i]);
				});
			});

			it(FormatToken.MonthStringLong, () => {
				const months : number[] = newArray(12, i => {
					return i + 1; // 1 ~ 12
				});

				months.forEach((month, i) => {
					const date : DateEx = new DateEx({
						month
					});

					const result : string = date.format(FormatToken.MonthStringLong);

					expect(result).to.be.eql(defaultLocaleSet.MonthLong[i]);
				});
			});
		});

		describe('week', () => {
			it(FormatToken.Week, () => {
				const dates : DateEx[] = newArray(43, i => {
					return new DateEx({ year : 2020, month : 1, date : i + 1 });
				});

				dates.forEach(date => {
					const result : string = date.format(FormatToken.Week);

					expect(result).to.be.lengthOf(date.weekOfYear < 10 ? 1 : 2);
					expect(result).to.be.eql('' + date.weekOfYear);
				});
			});

			it(FormatToken.WeekPadded, () => {
				const dates : DateEx[] = newArray(43, i => {
					return new DateEx({ year : 2020, month : 1, date : i + 1 });
				});

				dates.forEach(date => {
					const result : string = date.format(FormatToken.WeekPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(date.weekOfYear, 2));
				});
			});

			it(FormatToken.WeekPaddedWithPrefix, () => {
				const dates : DateEx[] = newArray(43, i => {
					return new DateEx({ year : 2020, month : 1, date : i + 1 });
				});

				dates.forEach(date => {
					const result : string = date.format(FormatToken.WeekPaddedWithPrefix);

					expect(result).to.be.lengthOf(3);
					expect(result).to.be.eql('W' + padDigit(date.weekOfYear, 2));
				});
			});
		});

		describe('date', () => {
			it(FormatToken.DayOfYear, () => {
				const dates : number[] = newArray(100, i => {
					return i + 1; // 1 ~ 100
				});

				dates.forEach(date => {
					const dateEx : DateEx = new DateEx({
						date
					});

					const result : string = dateEx.format(FormatToken.DayOfYear);

					expect(result).to.be.lengthOf(date < 10 ? 1 : (date < 100 ? 2 : 3));
					expect(result).to.be.eql('' + date);
				});
			});

			it(FormatToken.DayOfYearPadded, () => {
				const dates : number[] = newArray(100, i => {
					return i + 1; // 1 ~ 100
				});

				dates.forEach(date => {
					const dateEx : DateEx = new DateEx({
						date
					});

					const result : string = dateEx.format(FormatToken.DayOfYearPadded);

					expect(result).to.be.lengthOf(3);
					expect(result).to.be.eql(padDigit(date, 3));
				});
			});

			it(FormatToken.DayOfMonth, () => {
				const dates : number[] = newArray(31, i => {
					return i + 1; // 1 ~ 31
				});

				dates.forEach(date => {
					const dateEx : DateEx = new DateEx({
						date
					});

					const result : string = dateEx.format(FormatToken.DayOfMonth);

					expect(result).to.be.lengthOf(date < 10 ? 1 : 2);
					expect(result).to.be.eql('' + date);
				});
			});

			it(FormatToken.DayOfMonthPadded, () => {
				const dates : number[] = newArray(31, i => {
					return i + 1; // 1 ~ 31
				});

				dates.forEach(date => {
					const dateEx : DateEx = new DateEx({
						date
					});

					const result : string = dateEx.format(FormatToken.DayOfMonthPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(date, 2));
				});
			});
		});

		describe('day', () => {
			let defaultLocaleSet : LocaleSet;

			before(async () => {
				defaultLocaleSet = await loadLocaleFile(DefaultLocale);
				DateEx.locale(DefaultLocale);

				await wait();
			});

			it(FormatToken.DayOfWeek, () => {
				const dates : DateEx[] = newArray(7, i => {
					return new DateEx({ year : 2020, month : 1, date : i });
				});

				dates.forEach(date => {
					const result : string = date.format(FormatToken.DayOfWeek);

					expect(result).to.be.lengthOf(1);
					expect(result).to.be.eql('' + date.day);
				});
			});

			it(FormatToken.DayOfWeekStringShort, () => {
				const dates : DateEx[] = newArray(7, i => {
					return new DateEx({ year : 2020, month : 1, date : 5 + i }); // start with sunday (0)
				});

				dates.forEach((date, i) => {
					const result : string = date.format(FormatToken.DayOfWeekStringShort);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(defaultLocaleSet.DayOfWeekShort[i]);
				});
			});

			it(FormatToken.DayOfWeekStringMiddle, () => {
				const dates : DateEx[] = newArray(7, i => {
					return new DateEx({ year : 2020, month : 1, date : 5 + i }); // start with sunday (0)
				});

				dates.forEach((date, i) => {
					const result : string = date.format(FormatToken.DayOfWeekStringMiddle);

					expect(result).to.be.lengthOf(3);
					expect(result).to.be.eql(defaultLocaleSet.DayOfWeekMiddle[i]);
				});
			});

			it(FormatToken.DayOfWeekStringLong, () => {
				const dates : DateEx[] = newArray(7, i => {
					return new DateEx({ year : 2020, month : 1, date : 5 + i }); // start with sunday (0)
				});

				dates.forEach((date, i) => {
					const result : string = date.format(FormatToken.DayOfWeekStringLong);

					expect(result).to.be.eql(defaultLocaleSet.DayOfWeekLong[i]);
				});
			});
		});

		describe('meridiem', () => {
			let defaultLocaleSet : LocaleSet;

			before(async () => {
				defaultLocaleSet = await loadLocaleFile(DefaultLocale);
				DateEx.locale(DefaultLocale);

				await wait();
			});

			it(FormatToken.MeridiemLower, () => {
				const hoursArr : number[] = newArray(24, i => i); // 0 ~ 23

				hoursArr.forEach(hours => {
					const date : DateEx = new DateEx({
						hours
					});

					expect(date.format(FormatToken.MeridiemLower)).to.be.eql(
						hours < 12
							? defaultLocaleSet.Meridiem[0].toLowerCase()
							: defaultLocaleSet.Meridiem[1].toLowerCase()
					);
				});
			});

			it(FormatToken.MeridiemCapital, () => {
				const hoursArr : number[] = newArray(24, i => i); // 0 ~ 23

				hoursArr.forEach(hours => {
					const date : DateEx = new DateEx({
						hours
					});

					expect(date.format(FormatToken.MeridiemCapital)).to.be.eql(
						hours < 12
							? defaultLocaleSet.Meridiem[0].toUpperCase()
							: defaultLocaleSet.Meridiem[1].toUpperCase()
					);
				});
			});
		});

		describe('hours', () => {
			it(FormatToken.Hours24, () => {
				const hoursArr : number[] = newArray(24, i => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach(hours => {
					const date : DateEx = new DateEx({ hours });

					const result : string = date.format(FormatToken.Hours24);

					expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
					expect(result).to.be.eql('' + hours);
				});
			});


			it(FormatToken.Hours24Padded, () => {
				const hoursArr : number[] = newArray(24, i => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach(hours => {
					const date : DateEx = new DateEx({ hours });

					const result : string = date.format(FormatToken.Hours24Padded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(hours, 2));
				});
			});

			it(FormatToken.Hours12, () => {
				const hoursArr : number[] = newArray(24, i => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach(hours => {
					const date : DateEx = new DateEx({ hours });

					const result : string = date.format(FormatToken.Hours12);

					expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
					expect(result).to.be.eql('' + (hours > 12 ? hours % 12 : hours));
				});
			});

			it(FormatToken.Hours12Padded, () => {
				const hoursArr : number[] = newArray(24, i => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach(hours => {
					const date : DateEx = new DateEx({ hours });

					const result : string = date.format(FormatToken.Hours12Padded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(hours > 12 ? hours % 12 : hours, 2));
				});
			});
		});

		describe('minutes', () => {
			it(FormatToken.Minutes, () => {
				const minutesArr : number[] = newArray(60, i => {
					return i; // 0 ~ 59
				});

				minutesArr.forEach(minutes => {
					const date : DateEx = new DateEx({ minutes });

					const result : string = date.format(FormatToken.Minutes);

					expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
					expect(result).to.be.eql('' + minutes);
				});
			});


			it(FormatToken.MinutesPadded, () => {
				const minutesArr : number[] = newArray(60, i => {
					return i; // 0 ~ 59
				});

				minutesArr.forEach(minutes => {
					const date : DateEx = new DateEx({ minutes });

					const result : string = date.format(FormatToken.MinutesPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(minutes, 2));
				});
			});
		});

		describe('seconds', () => {
			it(FormatToken.Seconds, () => {
				const secondsArr : number[] = newArray(60, i => {
					return i; // 0 ~ 59
				});

				secondsArr.forEach(seconds => {
					const date : DateEx = new DateEx({ seconds });

					const result : string = date.format(FormatToken.Seconds);

					expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
					expect(result).to.be.eql('' + seconds);
				});
			});


			it(FormatToken.SecondsPadded, () => {
				const secondsArr : number[] = newArray(60, i => {
					return i; // 0 ~ 59
				});

				secondsArr.forEach(seconds => {
					const date : DateEx = new DateEx({ seconds });

					const result : string = date.format(FormatToken.SecondsPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(seconds, 2));
				});
			});
		});

		describe('ms', () => {
			it(FormatToken.MilliSeconds, () => {
				const msArr : number[] = newArray(999, i => {
					return i; // 0 ~ 999
				});

				msArr.forEach(ms => {
					const date : DateEx = new DateEx({ ms });

					const result : string = date.format(FormatToken.MilliSeconds);

					expect(result).to.be.lengthOf(+result < 10 ? 1 : (+result < 100 ? 2 : 3));
					expect(result).to.be.eql('' + ms);
				});
			});


			it(FormatToken.MilliSecondsPadded2, () => {
				const msArr : number[] = newArray(999, i => {
					return i; // 0 ~ 999
				});

				msArr.forEach(ms => {
					const date : DateEx = new DateEx({ ms });

					const result : string = date.format(FormatToken.MilliSecondsPadded2);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(ms < 100 ? ms : Math.floor(ms / 10), 2));
				});
			});

			it(FormatToken.MilliSecondsPadded3, () => {
				const msArr : number[] = newArray(999, i => {
					return i; // 0 ~ 999
				});

				msArr.forEach(ms => {
					const date : DateEx = new DateEx({ ms });

					const result : string = date.format(FormatToken.MilliSecondsPadded3);

					expect(result).to.be.lengthOf(3);
					expect(result).to.be.eql(padDigit(ms, 3));
				});
			});
		});
	});

	// test with default locale
	describe('locale string', () => {
		let defaultLocaleSet : LocaleSet;

		const initParam : InitDataFormat = {
			year : 2020, month : 8, date : 4,
			hours : 13, minutes : 3, seconds : 16, ms : 32
		};

		before(async () => {
			defaultLocaleSet = await loadLocaleFile(DefaultLocale);

			await wait();
		});

		describe('toDateTimeLocale()', () => {
			it('ok', () => {
				const date : DateEx = new DateEx(initParam);

				expect(date.toLocaleDateTimeString()).to.be.eql([
					[
						initParam.month,
						initParam.date,
						initParam.year
					].join('/'),
					', ',
					[
						(initParam.hours + 1) % 12 - 1,
						padDigit(initParam.minutes, 2),
						padDigit(initParam.seconds, 2)
					].join(':'),
					' ',
					defaultLocaleSet.Meridiem[initParam.hours < 12 ? 0 : 1]
				].join(''));
			});
		});

		describe('toLocaleDateString()', () => {
			it('ok', () => {
				const date : DateEx = new DateEx(initParam);

				expect(date.toLocaleDateString()).to.be.eql([
					initParam.month,
					initParam.date,
					initParam.year
				].join('/'));
			});
		});

		describe('toLocaleTimeString()', () => {
			it('ok', () => {
				const date : DateEx = new DateEx(initParam);

				expect(date.toLocaleTimeString()).to.be.eql([
					[
						(initParam.hours + 1) % 12 - 1,
						padDigit(initParam.minutes, 2),
						padDigit(initParam.seconds, 2)
					].join(':'),
					' ',
					defaultLocaleSet.Meridiem[initParam.hours < 12 ? 0 : 1]
				].join(''));
			});
		});
	});

	describe('diff()', () => {
		describe(DateTimeDimension.Year, () => {
			it('ok', () => {
				const date1 : DateEx = new DateEx({
					year : 2020
				});

				const date2 : DateEx = new DateEx({
					year : 2021
				});

				expect(date1.diff(date2, DateTimeDimension.Year)).to.be.eql(-1);
			});
		});
		describe(DateTimeDimension.Quarter, () => {
			it('same year', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 3
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 5
				});

				expect(date1.diff(date2, DateTimeDimension.Quarter)).to.be.eql(-1);
			});

			it('different year', () => {
				const date1 : DateEx = new DateEx({
					year : 2021,
					month : 6,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 8
				});

				expect(date1.diff(date2, DateTimeDimension.Quarter)).to.be.eql(3);
			});
		});


		describe(DateTimeDimension.Month, () => {
			it('same year', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 3,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 5
				});

				expect(date1.diff(date2, DateTimeDimension.Month)).to.be.eql(-2);
			});

			it('different year', () => {
				const date1 : DateEx = new DateEx({
					year : 2021,
					month : 3,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 5
				});

				expect(date1.diff(date2, DateTimeDimension.Month)).to.be.eql(10);
			});
		});

		describe(DateTimeDimension.Week, () => {
			it('same week', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 10
				});

				expect(date1.diff(date2, DateTimeDimension.Week)).to.be.eql(0);
			});

			it('different week', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 11
				});

				expect(date1.diff(date2, DateTimeDimension.Week)).to.be.eql(-1);
			});

			it('different month', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 3,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 11,
					date : 5
				});

				expect(date1.diff(date2, DateTimeDimension.Week)).to.be.eql(-5);
			});

			it('different year, but same week', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 12,
					date : 30,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2021,
					month : 1,
					date : 2
				});

				expect(date1.diff(date2, DateTimeDimension.Week)).to.be.eql(0);
			});

			it('different year, but different week', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 12,
					date : 30,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2021,
					month : 1,
					date : 3
				});

				expect(date1.diff(date2, DateTimeDimension.Week)).to.be.eql(-1);
			});
		});

		describe(DateTimeDimension.Date, () => {
			it('same month', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 13,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 20
				});

				expect(date1.diff(date2, DateTimeDimension.Date)).to.be.eql(-7);
			});

			it('different month', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 8,
					date : 5,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 7,
					date : 31
				});

				expect(date1.diff(date2, DateTimeDimension.Date)).to.be.eql(5);
			});

			it('different year', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 5,
					date : 5,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2021,
					month : 5,
					date : 6
				});

				expect(date1.diff(date2, DateTimeDimension.Date)).to.be.eql(-366);
			});
		});

		describe(DateTimeDimension.Hours, () => {
			it('same day', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					hours : 10,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					hours : 12
				});

				expect(date1.diff(date2, DateTimeDimension.Hours)).to.be.eql(-2);
			});

			it('different dates', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 3,
					hours : 5,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					hours : 5
				});

				expect(date1.diff(date2, DateTimeDimension.Hours)).to.be.eql(-2 * 24);
			});
		});

		describe(DateTimeDimension.Minutes, () => {
			it('same day', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					minutes : 10,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					minutes : 30
				});

				expect(date1.diff(date2, DateTimeDimension.Minutes)).to.be.eql(-20);
			});

			it('different dates', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 3,
					minutes : 5,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					minutes : 5
				});

				expect(date1.diff(date2, DateTimeDimension.Minutes)).to.be.eql(-2 * 24 * 60);
			});
		});

		describe(DateTimeDimension.Seconds, () => {
			it('same day', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					seconds : 10,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					seconds : 30
				});

				expect(date1.diff(date2, DateTimeDimension.Seconds)).to.be.eql(-20);
			});

			it('different minutes', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					minutes : 8,
					seconds : 10,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					minutes : 5,
					seconds : 30
				});

				expect(date1.diff(date2, DateTimeDimension.Seconds)).to.be.eql(160);
			});

			it('different day', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 3,
					seconds : 10,
					ms : 3 // margin
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 5,
					seconds : 30
				});

				expect(date1.diff(date2, DateTimeDimension.Seconds)).to.be.eql(-2 * 24 * 60 * 60 - 20);
			});
		});

		describe(DateTimeDimension.Ms, () => {
			it('same seconds', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 3,
					hours : 13,
					minutes : 53,
					seconds : 10,
					ms : 100
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 3,
					hours : 13,
					minutes : 53,
					seconds : 10,
					ms : 300
				});

				expect(date1.diff(date2, DateTimeDimension.Ms)).to.be.eql(date1.ms - date2.ms);
			});

			it('different seconds', () => {
				const date1 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 3,
					hours : 13,
					minutes : 53,
					seconds : 12,
					ms : 100
				});

				const date2 : DateEx = new DateEx({
					year : 2020,
					month : 10,
					date : 3,
					hours : 13,
					minutes : 53,
					seconds : 10,
					ms : 300
				});

				expect(date1.diff(date2, DateTimeDimension.Ms)).to.be.eql(2 * 1000 + date1.ms - date2.ms);
			});
		});
	});

	describe('isBefore()', () => {
		it('no dimension param', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22,
				ms : 1
			});

			expect(date1.isBefore(date2)).to.be.true;
		});

		it('same date', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isBefore(date2, DateTimeDimension.Date)).to.be.false;
		});

		it('is before, but same with dimension', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 21
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isBefore(date2, DateTimeDimension.Month)).to.be.false;
		});
	});

	describe('isBeforeOrEqual()', () => {
		it('no dimension param', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22,
				ms : 1
			});

			expect(date1.isBeforeOrEqual(date2)).to.be.true;
		});

		it('same date', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isBeforeOrEqual(date2, DateTimeDimension.Date)).to.be.true;
		});

		it('is before, but same with dimension', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 21
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isBeforeOrEqual(date2, DateTimeDimension.Month)).to.be.true;
		});
	});

	describe('isAfter()', () => {
		it('no dimension param', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22,
				ms : 1
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfter(date2)).to.be.true;
		});

		it('same date', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfter(date2, DateTimeDimension.Date)).to.be.false;
		});

		it('is after, but same with dimension', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 23
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfter(date2, DateTimeDimension.Month)).to.be.false;
		});
	});

	describe('isAfterOrEqual()', () => {
		it('no dimension param', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22,
				ms : 1
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfterOrEqual(date2)).to.be.true;
		});

		it('same date', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfterOrEqual(date2, DateTimeDimension.Date)).to.be.true;
		});

		it('is after, but same with dimension', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 23
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfterOrEqual(date2, DateTimeDimension.Month)).to.be.true;
		});
	});

	describe('isBetween()', () => {
		it('different days', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 20
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date3 : DateEx = new DateEx({
				year : 2020, month : 10, date : 24
			});

			expect(date1.isBetween(date2, date3)).to.be.false;
			expect(date1.isBetween(date3, date2)).to.be.false;

			expect(date2.isBetween(date1, date3)).to.be.true;
			expect(date2.isBetween(date3, date1)).to.be.true;

			expect(date3.isBetween(date1, date2)).to.be.false;
			expect(date3.isBetween(date2, date1)).to.be.false;
		});

		it('same day', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date3 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isBetween(date2, date3)).to.be.false;
			expect(date1.isBetween(date3, date2)).to.be.false;

			expect(date2.isBetween(date1, date3)).to.be.false;
			expect(date2.isBetween(date3, date1)).to.be.false;

			expect(date3.isBetween(date1, date2)).to.be.false;
			expect(date3.isBetween(date2, date1)).to.be.false;
		});
	});

	describe('isBetweenOrEqual()', () => {
		it('different days', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 20
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date3 : DateEx = new DateEx({
				year : 2020, month : 10, date : 24
			});

			expect(date1.isBetweenOrEqual(date2, date3)).to.be.false;
			expect(date1.isBetweenOrEqual(date3, date2)).to.be.false;

			expect(date2.isBetweenOrEqual(date1, date3)).to.be.true;
			expect(date2.isBetweenOrEqual(date3, date1)).to.be.true;

			expect(date3.isBetweenOrEqual(date1, date2)).to.be.false;
			expect(date3.isBetweenOrEqual(date2, date1)).to.be.false;
		});

		it('same day', () => {
			const date1 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			const date3 : DateEx = new DateEx({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isBetweenOrEqual(date2, date3)).to.be.true;
			expect(date1.isBetweenOrEqual(date3, date2)).to.be.true;

			expect(date2.isBetweenOrEqual(date1, date3)).to.be.true;
			expect(date2.isBetweenOrEqual(date3, date1)).to.be.true;

			expect(date3.isBetweenOrEqual(date1, date2)).to.be.true;
			expect(date3.isBetweenOrEqual(date2, date1)).to.be.true;
		});
	});
});
