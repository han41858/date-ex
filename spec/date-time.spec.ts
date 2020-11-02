import { expect } from 'chai';

import { DateTime } from '../src/date-time';
import { DateTimeParamKeys, DateTimeUnit, DefaultLocale, DurationParamKeys, FormatToken } from '../src/constants';
import { durationUnitToDateTimeUnit, loadLocaleFile, newArray, padDigit, wait } from '../src/util';
import { DateTimeParam, InitDataFormat, LocaleSet } from '../src/interfaces';


const MilliSecondsCloseTo : number = 10;

describe('DateTime', () => {
	describe('constructor()', () => {
		it('empty initializer', () => {
			const now : Date = new Date();
			const newDate : DateTime = new DateTime();

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

						const newDateTime : DateTime = new DateTime(dateStr);

						expect(newDateTime).to.be.ok;

						expect(+newDateTime).to.be.eql(+newDate);

						expect(newDateTime.year).to.be.eql(newDate.getFullYear());
						expect(newDateTime.month).to.be.eql(newDate.getMonth() + 1);
						expect(newDateTime.date).to.be.eql(newDate.getDate());

						expect(newDateTime.hours).to.be.eql(-timezoneOffsetInHours);
						expect(newDateTime.minutes).to.be.eql(0);
						expect(newDateTime.seconds).to.be.eql(0);
						expect(newDateTime.ms).to.be.eql(0);
					});

					it('YYYY-MM', () => {
						const now : Date = new Date();

						const dateStr : string = [
							now.getFullYear(),
							padDigit(now.getMonth() + 1, 2)
						].join('-');

						const newDate : Date = new Date(dateStr);
						const timezoneOffsetInHours : number = now.getTimezoneOffset() / 60;

						const newDateTime : DateTime = new DateTime(dateStr);

						expect(newDateTime).to.be.ok;

						expect(+newDateTime).to.be.eql(+newDate);

						expect(newDateTime.year).to.be.eql(newDate.getFullYear());
						expect(newDateTime.month).to.be.eql(newDate.getMonth() + 1);
						expect(newDateTime.date).to.be.eql(1);

						expect(newDateTime.hours).to.be.eql(-timezoneOffsetInHours);
						expect(newDateTime.minutes).to.be.eql(0);
						expect(newDateTime.seconds).to.be.eql(0);
						expect(newDateTime.ms).to.be.eql(0);
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

						const newDateTime : DateTime = new DateTime(dateStr);

						expect(newDateTime).to.be.ok;

						expect(+newDateTime).to.be.eql(+newDate);

						expect(newDateTime.year).to.be.eql(newDate.getFullYear());
						expect(newDateTime.month).to.be.eql(newDate.getMonth() + 1);
						expect(newDateTime.date).to.be.eql(newDate.getDate());

						expect(newDateTime.hours).to.be.eql(0);
						expect(newDateTime.minutes).to.be.eql(0);
						expect(newDateTime.seconds).to.be.eql(0);
						expect(newDateTime.ms).to.be.eql(0);
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

						expect(new DateTime(dateStr).isValid()).to.be.false;
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

							const dateTime : DateTime = new DateTime(timeStr);

							expect(dateTime.isValid()).to.be.false;
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

							const dateTime : DateTime = new DateTime(timeStr);

							expect(dateTime.isValid()).to.be.false;
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

							const dateTime : DateTime = new DateTime(timeStr);

							expect(dateTime.isValid()).to.be.false;
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

							const dateTime : DateTime = new DateTime(timeStr);

							expect(dateTime.isValid()).to.be.false;
						});

						it('hh:mm', () => {
							const now : Date = new Date();

							const timeStr : string = [
								padDigit(now.getHours(), 2),
								':',
								padDigit(now.getMinutes(), 2)
							].join('');

							const dateTime : DateTime = new DateTime(timeStr);

							expect(dateTime.isValid()).to.be.false;
						});

						it('Thhmm', () => {
							const now : Date = new Date();

							const timeStr : string = [
								'T',
								padDigit(now.getHours(), 2),
								padDigit(now.getMinutes(), 2)
							].join('');

							const dateTime : DateTime = new DateTime(timeStr);

							expect(dateTime.isValid()).to.be.false;
						});

						it('Thh', () => {
							const now : Date = new Date();

							const timeStr : string = [
								'T',
								padDigit(now.getHours(), 2)
							].join('');

							const dateTime : DateTime = new DateTime(timeStr);

							expect(dateTime.isValid()).to.be.false;
						});
					});
				});
			});
		});

		describe('with Date', () => {
			it('ok', () => {
				const now : Date = new Date();

				const newDate : Date = new Date(now);
				const newDateTime : DateTime = new DateTime(now);

				expect(newDateTime).to.be.ok;

				expect(+newDate).to.be.eql(+newDateTime);

				expect(newDateTime.year).to.be.eql(newDate.getFullYear());
				expect(newDateTime.month).to.be.eql(newDate.getMonth() + 1);
				expect(newDateTime.date).to.be.eql(newDate.getDate());

				expect(newDateTime.hours).to.be.eql(newDate.getHours());
				expect(newDateTime.minutes).to.be.eql(newDate.getMinutes());
				expect(newDateTime.seconds).to.be.eql(newDate.getSeconds());
				expect(newDateTime.ms).to.be.eql(newDate.getMilliseconds());
			});
		});

		describe('with DateTime', () => {
			it('ok', () => {
				const now : Date = new Date();

				const newDateTime1 : DateTime = new DateTime(now);
				const newDateTime2 : DateTime = new DateTime(newDateTime1);

				expect(newDateTime2).to.be.ok;

				expect(+newDateTime1).to.be.eql(+newDateTime2);

				expect(newDateTime2.year).to.be.eql(newDateTime1.year);
				expect(newDateTime2.month).to.be.eql(newDateTime1.month);
				expect(newDateTime2.date).to.be.eql(newDateTime1.date);

				expect(newDateTime2.hours).to.be.eql(newDateTime1.hours);
				expect(newDateTime2.minutes).to.be.eql(newDateTime1.minutes);
				expect(newDateTime2.seconds).to.be.eql(newDateTime1.seconds);
				expect(newDateTime2.ms).to.be.eql(newDateTime1.ms);
			});
		});

		describe('with DateTimeParam', () => {
			describe('each field', () => {
				DateTimeParamKeys.forEach(key => {
					it(key, () => {
						const date : DateTime = new DateTime({
							[key] : key === DateTimeUnit.Year
								? 1973
								: 3
						});

						DateTimeParamKeys.forEach(checkKey => {
							if (checkKey === key) {
								expect(date[checkKey]).to.be.eql(
									checkKey === DateTimeUnit.Year
										? 1973
										: 3
								);
							}
							else {
								expect(date[checkKey]).to.be.eql(
									checkKey === DateTimeUnit.Year
										? 1970
										: ((checkKey === DateTimeUnit.Month || checkKey === DateTimeUnit.Date)
											? 1
											: (checkKey === DateTimeUnit.Hours
												? 9 // timezone
												: 0)
										)
								);
							}
						});
					});
				});
			});

			it('all', () => {
				const now : Date = new Date();

				const newDate : DateTime = new DateTime({
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

			describe('affect other field', () => {
				describe(DateTimeUnit.Month, () => {
					it('> 0, round up', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 13
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2021);
						expect(newDate.month).to.be.eql(1);
						expect(newDate.date).to.be.eql(1);

						expect(newDate.hours).to.be.eql(9);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('=== 0, round down', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 0 // 1 step
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2019);
						expect(newDate.month).to.be.eql(12);
						expect(newDate.date).to.be.eql(1);

						expect(newDate.hours).to.be.eql(9);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('< 0, round down', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : -5 // 6 steps
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2019);
						expect(newDate.month).to.be.eql(7);
						expect(newDate.date).to.be.eql(1);

						expect(newDate.hours).to.be.eql(9);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('< 0, round down', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : -11 // 12 steps
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2019);
						expect(newDate.month).to.be.eql(1);
						expect(newDate.date).to.be.eql(1);

						expect(newDate.hours).to.be.eql(9);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});
				});

				describe(DateTimeUnit.Date, () => {
					it('> 0, round up', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 5,
							date : 33
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2020);
						expect(newDate.month).to.be.eql(6);
						expect(newDate.date).to.be.eql(2);

						expect(newDate.hours).to.be.eql(9);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('> 0, round up more', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 12,
							date : 33 // +2 steps
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2021);
						expect(newDate.month).to.be.eql(1);
						expect(newDate.date).to.be.eql(2);

						expect(newDate.hours).to.be.eql(9);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('=== 0, round down', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 5,
							date : 0 // 1 step
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2020);
						expect(newDate.month).to.be.eql(4);
						expect(newDate.date).to.be.eql(30);

						expect(newDate.hours).to.be.eql(9);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('< 0, round down', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 5,
							date : -5 // 1, 30, 29, 28, 27, 26, 25
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2020);
						expect(newDate.month).to.be.eql(4);
						expect(newDate.date).to.be.eql(25);

						expect(newDate.hours).to.be.eql(9);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('< 0, round down more', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 1,
							date : -5 // 1, 31, 30, 29, 28, 27, 26
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2019);
						expect(newDate.month).to.be.eql(12);
						expect(newDate.date).to.be.eql(26);

						expect(newDate.hours).to.be.eql(9);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});
				});

				describe(DateTimeUnit.Hours, () => {
					it('> 0, round up', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 5,
							date : 3,

							hours : 25
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2020);
						expect(newDate.month).to.be.eql(5);
						expect(newDate.date).to.be.eql(4);

						expect(newDate.hours).to.be.eql(1);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('> 0, round up more', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 12,
							date : 31,

							hours : 36
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2021);
						expect(newDate.month).to.be.eql(1);
						expect(newDate.date).to.be.eql(1);

						expect(newDate.hours).to.be.eql(12);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('< 0, round down', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 5,
							date : 2,

							hours : -1
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2020);
						expect(newDate.month).to.be.eql(5);
						expect(newDate.date).to.be.eql(1);

						expect(newDate.hours).to.be.eql(23);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('< 0, round down more', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 1,
							date : 1,

							hours : -1
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2019);
						expect(newDate.month).to.be.eql(12);
						expect(newDate.date).to.be.eql(31);

						expect(newDate.hours).to.be.eql(23);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});
				});

				describe(DateTimeUnit.Minutes, () => {
					it('> 0, round up', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 5,
							date : 3,

							hours : 13,
							minutes : 80
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2020);
						expect(newDate.month).to.be.eql(5);
						expect(newDate.date).to.be.eql(3);

						expect(newDate.hours).to.be.eql(14);
						expect(newDate.minutes).to.be.eql(20);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('> 0, round up more', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 12,
							date : 31,

							hours : 23,
							minutes : 61
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2021);
						expect(newDate.month).to.be.eql(1);
						expect(newDate.date).to.be.eql(1);

						expect(newDate.hours).to.be.eql(0);
						expect(newDate.minutes).to.be.eql(1);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('< 0, round down', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 5,
							date : 2,

							hours : 3,
							minutes : -10
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2020);
						expect(newDate.month).to.be.eql(5);
						expect(newDate.date).to.be.eql(2);

						expect(newDate.hours).to.be.eql(2);
						expect(newDate.minutes).to.be.eql(50);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});

					it('< 0, round down more', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 1,
							date : 1,

							hours : 0,
							minutes : -10
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2019);
						expect(newDate.month).to.be.eql(12);
						expect(newDate.date).to.be.eql(31);

						expect(newDate.hours).to.be.eql(23);
						expect(newDate.minutes).to.be.eql(50);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(0);
					});
				});

				describe(DateTimeUnit.Seconds, () => {
					it('> 0, round up', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 5,
							date : 3,

							hours : 13,
							minutes : 30,
							seconds : 70
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2020);
						expect(newDate.month).to.be.eql(5);
						expect(newDate.date).to.be.eql(3);

						expect(newDate.hours).to.be.eql(13);
						expect(newDate.minutes).to.be.eql(31);
						expect(newDate.seconds).to.be.eql(10);
						expect(newDate.ms).to.be.eql(0);
					});

					it('> 0, round up more', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 12,
							date : 31,

							hours : 23,
							minutes : 59,
							seconds : 90
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2021);
						expect(newDate.month).to.be.eql(1);
						expect(newDate.date).to.be.eql(1);

						expect(newDate.hours).to.be.eql(0);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(30);
						expect(newDate.ms).to.be.eql(0);
					});

					it('< 0, round down', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 5,
							date : 2,

							hours : 3,
							minutes : 3,
							seconds : -10
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2020);
						expect(newDate.month).to.be.eql(5);
						expect(newDate.date).to.be.eql(2);

						expect(newDate.hours).to.be.eql(3);
						expect(newDate.minutes).to.be.eql(2);
						expect(newDate.seconds).to.be.eql(50);
						expect(newDate.ms).to.be.eql(0);
					});

					it('< 0, round down more', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 1,
							date : 1,

							hours : 0,
							minutes : 0,
							seconds : -10
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2019);
						expect(newDate.month).to.be.eql(12);
						expect(newDate.date).to.be.eql(31);

						expect(newDate.hours).to.be.eql(23);
						expect(newDate.minutes).to.be.eql(59);
						expect(newDate.seconds).to.be.eql(50);
						expect(newDate.ms).to.be.eql(0);
					});
				});

				describe(DateTimeUnit.Ms, () => {
					it('> 0, round up', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 5,
							date : 3,

							hours : 13,
							minutes : 30,
							seconds : 30,
							ms : 1001
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2020);
						expect(newDate.month).to.be.eql(5);
						expect(newDate.date).to.be.eql(3);

						expect(newDate.hours).to.be.eql(13);
						expect(newDate.minutes).to.be.eql(30);
						expect(newDate.seconds).to.be.eql(31);
						expect(newDate.ms).to.be.eql(1);
					});

					it('> 0, round up more', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 12,
							date : 31,

							hours : 23,
							minutes : 59,
							seconds : 59,
							ms : 1010
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2021);
						expect(newDate.month).to.be.eql(1);
						expect(newDate.date).to.be.eql(1);

						expect(newDate.hours).to.be.eql(0);
						expect(newDate.minutes).to.be.eql(0);
						expect(newDate.seconds).to.be.eql(0);
						expect(newDate.ms).to.be.eql(10);
					});

					it('< 0, round down', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 5,
							date : 2,

							hours : 3,
							minutes : 3,
							seconds : 3,
							ms : -50
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2020);
						expect(newDate.month).to.be.eql(5);
						expect(newDate.date).to.be.eql(2);

						expect(newDate.hours).to.be.eql(3);
						expect(newDate.minutes).to.be.eql(3);
						expect(newDate.seconds).to.be.eql(2);
						expect(newDate.ms).to.be.eql(950);
					});

					it('< 0, round down more', () => {
						const newDate : DateTime = new DateTime({
							year : 2020,
							month : 1,
							date : 1,

							hours : 0,
							minutes : 0,
							seconds : 0,
							ms : -50
						});

						expect(newDate).to.be.instanceOf(DateTime);

						expect(newDate.year).to.be.eql(2019);
						expect(newDate.month).to.be.eql(12);
						expect(newDate.date).to.be.eql(31);

						expect(newDate.hours).to.be.eql(23);
						expect(newDate.minutes).to.be.eql(59);
						expect(newDate.seconds).to.be.eql(59);
						expect(newDate.ms).to.be.eql(950);
					});
				});
			});
		});
	});

	describe('toDate()', () => {
		it('is Date', () => {
			expect(new DateTime().toDate()).to.be.instanceOf(Date);
		});
	});

	describe('toJson()', () => {
		it('ok', () => {
			const initParam : InitDataFormat = {
				year : 2020, month : 8, date : 4,
				hours : 13, minutes : 3, seconds : 16, ms : 32
			};

			const result : any = new DateTime(initParam).toJson();

			expect(result).to.be.instanceOf(Object);

			DateTimeParamKeys.forEach(key => {
				expect(result[key]).to.be.a('number');
				expect(result[key]).to.be.eql(initParam[key]);
			});
		});
	});

	describe('locale', () => {
		const anotherLocale : string = 'ko-kr';

		beforeEach(async () => {
			// reset locale
			DateTime.locale(DefaultLocale);

			await wait();
		});

		describe('error', () => {
			// undefined is getter
			describe('invalid locale', () => {
				const invalidLocale : string = 'invalid-locale';

				it('with static setter', async () => {
					DateTime.locale(invalidLocale);

					// wait for load
					await wait();

					const date : DateTime = new DateTime();

					// not changed
					expect(date.locale()).to.be.eql(DefaultLocale);
				});

				it('with local setter', async () => {
					const date : DateTime = new DateTime();

					date.locale(invalidLocale);

					// wait for load
					await wait();

					// not changed
					expect(date.locale()).to.be.eql(DefaultLocale);
				});
			});

		});

		it('default locale', async () => {
			const date : DateTime = new DateTime();

			expect(date.locale()).to.be.eql(DefaultLocale);
		});

		it('start with another', async () => {
			DateTime.locale(anotherLocale);

			// wait for load
			await wait();

			const date1 : DateTime = new DateTime();
			const date2 : DateTime = new DateTime();

			expect(date1.locale()).to.be.eql(anotherLocale);
			expect(date2.locale()).to.be.eql(anotherLocale);
		});

		it('change to another', async () => {
			const date1 : DateTime = new DateTime();

			// set locally
			date1.locale(anotherLocale);

			// wait for load
			await wait();

			expect(date1.locale()).to.be.eql(anotherLocale);

			const date2 : DateTime = new DateTime();

			expect(date2.locale()).to.be.eql(DefaultLocale);

			// set globally
			DateTime.locale(anotherLocale);

			// wait for load
			await wait();

			const date3 : DateTime = new DateTime();

			expect(date1.locale()).to.be.eql(anotherLocale);
			expect(date2.locale()).to.be.eql(DefaultLocale);
			expect(date3.locale()).to.be.eql(anotherLocale);
		});

		it('called multiple - global', async () => {
			DateTime.locale(anotherLocale);
			DateTime.locale(DefaultLocale);
			DateTime.locale(anotherLocale);

			// wait for load
			await wait();

			const date : DateTime = new DateTime();
			expect(date.locale()).to.be.eql(anotherLocale);
		});

		it('called multiple - local', async () => {
			const date : DateTime = new DateTime();

			date.locale(anotherLocale);
			date.locale(DefaultLocale);
			date.locale(anotherLocale);

			// wait for load
			await wait();

			expect(date.locale()).to.be.eql(anotherLocale);
		});

		it('from DateTime', async () => {
			const date1 : DateTime = new DateTime();
			date1.locale(anotherLocale);

			// wait for load
			await wait();

			const date2 : DateTime = new DateTime(date1);

			expect(date2.locale()).to.be.eql(anotherLocale);
		});
	});

	describe('set()', () => {
		let refDate : DateTime;

		before(() => {
			refDate = new DateTime(0); // zero base
		});

		it('ok', () => {
			DateTimeParamKeys.forEach(key => {
				const now : Date = new Date();

				const newDate : DateTime = new DateTime(refDate);

				let changingValue : number;

				switch (key) {
					case DateTimeUnit.Year:
						changingValue = now.getFullYear();
						break;

					case DateTimeUnit.Month:
						changingValue = now.getMonth() + 1;
						break;

					case DateTimeUnit.Date:
						changingValue = now.getDate();
						break;

					case DateTimeUnit.Hours:
						changingValue = now.getHours();
						break;

					case DateTimeUnit.Minutes:
						changingValue = now.getMinutes();
						break;

					case DateTimeUnit.Seconds:
						changingValue = now.getSeconds();
						break;

					case DateTimeUnit.Ms:
						changingValue = now.getMilliseconds();
						break;


				}

				// set
				newDate.set({
					[key] : changingValue
				});

				// check
				DateTimeParamKeys.forEach(checkKey => {
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
		let refDate : DateTime;

		before(() => {
			refDate = new DateTime(0); // zero base
		});

		describe('with DateTimeParam', () => {
			it('ok', () => {
				DateTimeParamKeys.forEach(key => {
					const newDate : DateTime = new DateTime(refDate);

					// add
					newDate.add({
						[key] : 1
					});

					// check
					DateTimeParamKeys.forEach(checkKey => {
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

		describe('with DurationParam', () => {
			it('ok', () => {
				DurationParamKeys.forEach(durationKey => {
					const newDate : DateTime = new DateTime(refDate);

					// add
					newDate.add({
						[durationKey] : 1
					});

					// check
					const changedKey : keyof DateTimeParam = durationUnitToDateTimeUnit(durationKey);

					DateTimeParamKeys.forEach(key => {
						if (changedKey === key) {
							expect(newDate[key]).to.be.eql(refDate[key] + 1);
						}
						else {
							expect(newDate[key]).to.be.eql(refDate[key]);
						}
					});
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
					const date : DateTime = new DateTime({
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
					const date : DateTime = new DateTime({
						year
					});

					const result : string = date.format(FormatToken.YearShort);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(('' + year).substr(2, 2));
				});
			});
		});

		describe('quarter', () => {
			it(FormatToken.Quarter, () => {
				const months : number[] = newArray(12, i => {
					return i + 1; // 1 ~ 12
				});

				months.forEach(month => {
					const date : DateTime = new DateTime({
						month
					});

					const result : string = date.format(FormatToken.Quarter);

					expect(result).to.be.lengthOf(1);

					switch (month) {
						case 1:
						case 2:
						case 3:
							expect(result).to.be.eql('1');
							break;

						case 4:
						case 5:
						case 6:
							expect(result).to.be.eql('2');
							break;

						case 7:
						case 8:
						case 9:
							expect(result).to.be.eql('3');
							break;

						case 10:
						case 11:
						case 12:
							expect(result).to.be.eql('4');
							break;
					}
				});
			});
		});

		describe('month', () => {
			let defaultLocaleSet : LocaleSet;

			before(async () => {
				defaultLocaleSet = await loadLocaleFile(DefaultLocale);
				DateTime.locale(DefaultLocale);

				await wait();
			});

			it(FormatToken.Month, () => {
				const months : number[] = newArray(12, i => {
					return i + 1; // 1 ~ 12
				});

				months.forEach(month => {
					const date : DateTime = new DateTime({
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
					const date : DateTime = new DateTime({
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
					const date : DateTime = new DateTime({
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
					const date : DateTime = new DateTime({
						month
					});

					const result : string = date.format(FormatToken.MonthStringLong);

					expect(result).to.be.eql(defaultLocaleSet.MonthLong[i]);
				});
			});
		});

		describe('week', () => {
			it(FormatToken.Week, () => {
				const dates : DateTime[] = newArray(43, i => {
					return new DateTime({ year : 2020, month : 1, date : i + 1 });
				});

				dates.forEach(date => {
					const result : string = date.format(FormatToken.Week);

					expect(result).to.be.lengthOf(date.weekOfYear < 10 ? 1 : 2);
					expect(result).to.be.eql('' + date.weekOfYear);
				});
			});

			it(FormatToken.WeekPadded, () => {
				const dates : DateTime[] = newArray(43, i => {
					return new DateTime({ year : 2020, month : 1, date : i + 1 });
				});

				dates.forEach(date => {
					const result : string = date.format(FormatToken.WeekPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(date.weekOfYear, 2));
				});
			});

			it(FormatToken.WeekPaddedWithPrefix, () => {
				const dates : DateTime[] = newArray(43, i => {
					return new DateTime({ year : 2020, month : 1, date : i + 1 });
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
					const dateTime : DateTime = new DateTime({
						date
					});

					const result : string = dateTime.format(FormatToken.DayOfYear);

					expect(result).to.be.lengthOf(date < 10 ? 1 : (date < 100 ? 2 : 3));
					expect(result).to.be.eql('' + date);
				});
			});

			it(FormatToken.DayOfYearPadded, () => {
				const dates : number[] = newArray(100, i => {
					return i + 1; // 1 ~ 100
				});

				dates.forEach(date => {
					const dateTime : DateTime = new DateTime({
						date
					});

					const result : string = dateTime.format(FormatToken.DayOfYearPadded);

					expect(result).to.be.lengthOf(3);
					expect(result).to.be.eql(padDigit(date, 3));
				});
			});

			it(FormatToken.DayOfMonth, () => {
				const dates : number[] = newArray(31, i => {
					return i + 1; // 1 ~ 31
				});

				dates.forEach(date => {
					const dateTime : DateTime = new DateTime({
						date
					});

					const result : string = dateTime.format(FormatToken.DayOfMonth);

					expect(result).to.be.lengthOf(date < 10 ? 1 : 2);
					expect(result).to.be.eql('' + date);
				});
			});

			it(FormatToken.DayOfMonthPadded, () => {
				const dates : number[] = newArray(31, i => {
					return i + 1; // 1 ~ 31
				});

				dates.forEach(date => {
					const dateTime : DateTime = new DateTime({
						date
					});

					const result : string = dateTime.format(FormatToken.DayOfMonthPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(date, 2));
				});
			});
		});

		describe('day', () => {
			let defaultLocaleSet : LocaleSet;

			before(async () => {
				defaultLocaleSet = await loadLocaleFile(DefaultLocale);
				DateTime.locale(DefaultLocale);

				await wait();
			});

			it(FormatToken.DayOfWeek, () => {
				const dates : DateTime[] = newArray(7, i => {
					return new DateTime({ year : 2020, month : 1, date : i });
				});

				dates.forEach(date => {
					const result : string = date.format(FormatToken.DayOfWeek);

					expect(result).to.be.lengthOf(1);
					expect(result).to.be.eql('' + date.day);
				});
			});

			it(FormatToken.DayOfWeekStringShort, () => {
				const dates : DateTime[] = newArray(7, i => {
					return new DateTime({ year : 2020, month : 1, date : 5 + i }); // start with sunday (0)
				});

				dates.forEach((date, i) => {
					const result : string = date.format(FormatToken.DayOfWeekStringShort);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(defaultLocaleSet.DayOfWeekShort[i]);
				});
			});

			it(FormatToken.DayOfWeekStringMiddle, () => {
				const dates : DateTime[] = newArray(7, i => {
					return new DateTime({ year : 2020, month : 1, date : 5 + i }); // start with sunday (0)
				});

				dates.forEach((date, i) => {
					const result : string = date.format(FormatToken.DayOfWeekStringMiddle);

					expect(result).to.be.lengthOf(3);
					expect(result).to.be.eql(defaultLocaleSet.DayOfWeekMiddle[i]);
				});
			});

			it(FormatToken.DayOfWeekStringLong, () => {
				const dates : DateTime[] = newArray(7, i => {
					return new DateTime({ year : 2020, month : 1, date : 5 + i }); // start with sunday (0)
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
				DateTime.locale(DefaultLocale);

				await wait();
			});

			it(FormatToken.MeridiemLower, () => {
				const hoursArr : number[] = newArray(24, i => i); // 0 ~ 23

				hoursArr.forEach(hours => {
					const date : DateTime = new DateTime({
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
					const date : DateTime = new DateTime({
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
					const date : DateTime = new DateTime({ hours });

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
					const date : DateTime = new DateTime({ hours });

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
					const date : DateTime = new DateTime({ hours });

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
					const date : DateTime = new DateTime({ hours });

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
					const date : DateTime = new DateTime({ minutes });

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
					const date : DateTime = new DateTime({ minutes });

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
					const date : DateTime = new DateTime({ seconds });

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
					const date : DateTime = new DateTime({ seconds });

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
					const date : DateTime = new DateTime({ ms });

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
					const date : DateTime = new DateTime({ ms });

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
					const date : DateTime = new DateTime({ ms });

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
				const date : DateTime = new DateTime(initParam);

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
				const date : DateTime = new DateTime(initParam);

				expect(date.toLocaleDateString()).to.be.eql([
					initParam.month,
					initParam.date,
					initParam.year
				].join('/'));
			});
		});

		describe('toLocaleTimeString()', () => {
			it('ok', () => {
				const date : DateTime = new DateTime(initParam);

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
		describe(DateTimeUnit.Year, () => {
			it('ok', () => {
				const date1 : DateTime = new DateTime({
					year : 2020
				});

				const date2 : DateTime = new DateTime({
					year : 2021
				});

				expect(date1.diff(date2, DateTimeUnit.Year)).to.be.eql(-1);
			});
		});
		describe(DateTimeUnit.Quarter, () => {
			it('same year', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 3
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 5
				});

				expect(date1.diff(date2, DateTimeUnit.Quarter)).to.be.eql(-1);
			});

			it('different year', () => {
				const date1 : DateTime = new DateTime({
					year : 2021,
					month : 6,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 8
				});

				expect(date1.diff(date2, DateTimeUnit.Quarter)).to.be.eql(3);
			});
		});


		describe(DateTimeUnit.Month, () => {
			it('same year', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 3,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 5
				});

				expect(date1.diff(date2, DateTimeUnit.Month)).to.be.eql(-2);
			});

			it('different year', () => {
				const date1 : DateTime = new DateTime({
					year : 2021,
					month : 3,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 5
				});

				expect(date1.diff(date2, DateTimeUnit.Month)).to.be.eql(10);
			});
		});

		describe(DateTimeUnit.Week, () => {
			it('same week', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 10
				});

				expect(date1.diff(date2, DateTimeUnit.Week)).to.be.eql(0);
			});

			it('different week', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 11
				});

				expect(date1.diff(date2, DateTimeUnit.Week)).to.be.eql(-1);
			});

			it('different month', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 3,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 11,
					date : 5
				});

				expect(date1.diff(date2, DateTimeUnit.Week)).to.be.eql(-5);
			});

			it('different year, but same week', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 12,
					date : 30,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2021,
					month : 1,
					date : 2
				});

				expect(date1.diff(date2, DateTimeUnit.Week)).to.be.eql(0);
			});

			it('different year, but different week', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 12,
					date : 30,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2021,
					month : 1,
					date : 3
				});

				expect(date1.diff(date2, DateTimeUnit.Week)).to.be.eql(-1);
			});
		});

		describe(DateTimeUnit.Date, () => {
			it('same month', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 13,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 20
				});

				expect(date1.diff(date2, DateTimeUnit.Date)).to.be.eql(-7);
			});

			it('different month', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 8,
					date : 5,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 7,
					date : 31
				});

				expect(date1.diff(date2, DateTimeUnit.Date)).to.be.eql(5);
			});

			it('different year', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 5,
					date : 5,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2021,
					month : 5,
					date : 6
				});

				expect(date1.diff(date2, DateTimeUnit.Date)).to.be.eql(-366);
			});
		});

		describe(DateTimeUnit.Hours, () => {
			it('same day', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					hours : 10,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					hours : 12
				});

				expect(date1.diff(date2, DateTimeUnit.Hours)).to.be.eql(-2);
			});

			it('different dates', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 3,
					hours : 5,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					hours : 5
				});

				expect(date1.diff(date2, DateTimeUnit.Hours)).to.be.eql(-2 * 24);
			});
		});

		describe(DateTimeUnit.Minutes, () => {
			it('same day', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					minutes : 10,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					minutes : 30
				});

				expect(date1.diff(date2, DateTimeUnit.Minutes)).to.be.eql(-20);
			});

			it('different dates', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 3,
					minutes : 5,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					minutes : 5
				});

				expect(date1.diff(date2, DateTimeUnit.Minutes)).to.be.eql(-2 * 24 * 60);
			});
		});

		describe(DateTimeUnit.Seconds, () => {
			it('same day', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					seconds : 10,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					seconds : 30
				});

				expect(date1.diff(date2, DateTimeUnit.Seconds)).to.be.eql(-20);
			});

			it('different minutes', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					minutes : 8,
					seconds : 10,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					minutes : 5,
					seconds : 30
				});

				expect(date1.diff(date2, DateTimeUnit.Seconds)).to.be.eql(160);
			});

			it('different day', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 3,
					seconds : 10,
					ms : 3 // margin
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 5,
					seconds : 30
				});

				expect(date1.diff(date2, DateTimeUnit.Seconds)).to.be.eql(-2 * 24 * 60 * 60 - 20);
			});
		});

		describe(DateTimeUnit.Ms, () => {
			it('same seconds', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 3,
					hours : 13,
					minutes : 53,
					seconds : 10,
					ms : 100
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 3,
					hours : 13,
					minutes : 53,
					seconds : 10,
					ms : 300
				});

				expect(date1.diff(date2, DateTimeUnit.Ms)).to.be.eql(date1.ms - date2.ms);
			});

			it('different seconds', () => {
				const date1 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 3,
					hours : 13,
					minutes : 53,
					seconds : 12,
					ms : 100
				});

				const date2 : DateTime = new DateTime({
					year : 2020,
					month : 10,
					date : 3,
					hours : 13,
					minutes : 53,
					seconds : 10,
					ms : 300
				});

				expect(date1.diff(date2, DateTimeUnit.Ms)).to.be.eql(2 * 1000 + date1.ms - date2.ms);
			});
		});
	});

	describe('isBefore()', () => {
		it('no unit param', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22,
				ms : 1
			});

			expect(date1.isBefore(date2)).to.be.true;
		});

		it('same date', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isBefore(date2, DateTimeUnit.Date)).to.be.false;
		});

		it('is before, but same with unit', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 21
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isBefore(date2, DateTimeUnit.Month)).to.be.false;
		});
	});

	describe('isBeforeOrEqual()', () => {
		it('no unit param', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22,
				ms : 1
			});

			expect(date1.isBeforeOrEqual(date2)).to.be.true;
		});

		it('same date', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isBeforeOrEqual(date2, DateTimeUnit.Date)).to.be.true;
		});

		it('is before, but same with unit', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 21
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isBeforeOrEqual(date2, DateTimeUnit.Month)).to.be.true;
		});
	});

	describe('isAfter()', () => {
		it('no unit param', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22,
				ms : 1
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfter(date2)).to.be.true;
		});

		it('same date', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfter(date2, DateTimeUnit.Date)).to.be.false;
		});

		it('is after, but same with unit', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 23
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfter(date2, DateTimeUnit.Month)).to.be.false;
		});
	});

	describe('isAfterOrEqual()', () => {
		it('no unit param', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22,
				ms : 1
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfterOrEqual(date2)).to.be.true;
		});

		it('same date', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfterOrEqual(date2, DateTimeUnit.Date)).to.be.true;
		});

		it('is after, but same with unit', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 23
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			expect(date1.isAfterOrEqual(date2, DateTimeUnit.Month)).to.be.true;
		});
	});

	describe('isBetween()', () => {
		it('different days', () => {
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 20
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date3 : DateTime = new DateTime({
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
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date3 : DateTime = new DateTime({
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
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 20
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date3 : DateTime = new DateTime({
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
			const date1 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date2 : DateTime = new DateTime({
				year : 2020, month : 10, date : 22
			});

			const date3 : DateTime = new DateTime({
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
