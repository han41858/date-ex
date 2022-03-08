import { expect } from 'chai';

import { checkDateTime } from '../test';
import { DateTime } from '../../src/date-time';
import { padDigit } from '../../src/util';
import { DateTimeParamKeys, DateTimeUnit, DefaultValue, FormatToken } from '../../src/constants';
import { DateTimeParam } from '../../src/interfaces';


const MilliSecondsCloseTo: number = 10;

export const constructorSpec = (): void => {
	it('empty initializer', () => {
		const now: Date = new Date();
		const newDate: DateTime = new DateTime();

		checkDateTime(newDate, {
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			date: now.getDate(),

			hours: now.getHours(),
			minutes: now.getMinutes(),
			seconds: now.getSeconds(),
			ms: undefined // no ms
		});

		expect(+now).to.be.closeTo(+newDate, MilliSecondsCloseTo);
		expect(newDate.ms).to.be.closeTo(now.getMilliseconds(), MilliSecondsCloseTo);
	});

	// test string initializer
	describe('by string', () => {
		describe('by date string', () => {
			describe('ok', () => {
				it('YYYY-MM-DD', () => {
					const now: Date = new Date();

					const dateStr: string = [
						now.getFullYear(),
						padDigit(now.getMonth() + 1, 2),
						padDigit(now.getDate(), 2)
					].join('-');

					const newDate: Date = new Date(dateStr);
					const newDateTime: DateTime = new DateTime(dateStr);

					checkDateTime(newDateTime, {
						year: newDate.getFullYear(),
						month: newDate.getMonth() + 1,
						date: newDate.getDate(),

						hours: newDate.getHours(),
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('YYYY-MM', () => {
					const now: Date = new Date();

					const dateStr: string = [
						now.getFullYear(),
						padDigit(now.getMonth() + 1, 2)
					].join('-');

					const newDate: Date = new Date(dateStr);
					const newDateTime: DateTime = new DateTime(dateStr);

					checkDateTime(newDateTime, {
						year: newDate.getFullYear(),
						month: newDate.getMonth() + 1,
						date: 1,

						hours: newDate.getHours(),
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('--MM-DD', () => {
					const now: Date = new Date();

					const dateStr: string = [
						'--',
						padDigit(now.getMonth() + 1, 2), // real month
						'-',
						padDigit(now.getDate(), 2)
					].join('');

					const newDate: Date = new Date(dateStr);
					const newDateTime: DateTime = new DateTime(dateStr);

					checkDateTime(newDateTime, {
						year: newDate.getFullYear(),
						month: newDate.getMonth() + 1,
						date: newDate.getDate(),

						hours: newDate.getHours(),
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});
			});

			describe('failed', () => {
				// YYYYMM assumes hhmmss

				it('YYYYMMDD', () => {
					const now: Date = new Date();

					const dateStr: string = [
						now.getFullYear(),
						padDigit(now.getMonth() + 1, 2),
						padDigit(now.getDate(), 2)
					].join('');

					expect(new DateTime(dateStr).valid).to.be.false;
				});
			});
		});

		describe('by time string', () => {
			describe('no timezone', () => {
				describe('failed', () => {
					it('hh:mm:ss.SSS', () => {
						const now: Date = new Date();

						const timeStr: string = [
							[
								padDigit(now.getHours(), 2),
								padDigit(now.getMinutes(), 2),
								padDigit(now.getSeconds(), 2)
							].join(':'),
							'.',
							padDigit(now.getMilliseconds(), 3)
						].join('');

						const dateTime: DateTime = new DateTime(timeStr);

						expect(dateTime.valid).to.be.false;
					});

					it('Thh:mm:ss.SSS', () => {
						const now: Date = new Date();

						const timeStr: string = [
							'T',
							[
								padDigit(now.getHours(), 2),
								padDigit(now.getMinutes(), 2),
								padDigit(now.getSeconds(), 2)
							].join(':'),
							'.',
							padDigit(now.getMilliseconds(), 3)
						].join('');

						const dateTime: DateTime = new DateTime(timeStr);

						expect(dateTime.valid).to.be.false;
					});

					it('hh:mm:ss', () => {
						const now: Date = new Date();

						const timeStr: string = [
							padDigit(now.getHours(), 2),
							padDigit(now.getMinutes(), 2),
							padDigit(now.getSeconds(), 2)
						].join(':');

						const dateTime: DateTime = new DateTime(timeStr);

						expect(dateTime.valid).to.be.false;
					});

					// hhmmss : not error, but invalid parsed with Date

					it('Thhmmss', () => {
						const now: Date = new Date();

						const timeStr: string = [
							'T',
							padDigit(now.getHours(), 2),
							padDigit(now.getMinutes(), 2),
							padDigit(now.getSeconds(), 2)
						].join('');

						const dateTime: DateTime = new DateTime(timeStr);

						expect(dateTime.valid).to.be.false;
					});

					it('hh:mm', () => {
						const now: Date = new Date();

						const timeStr: string = [
							padDigit(now.getHours(), 2),
							padDigit(now.getMinutes(), 2)
						].join(':');

						const dateTime: DateTime = new DateTime(timeStr);

						expect(dateTime.valid).to.be.false;
					});

					it('Thhmm', () => {
						const now: Date = new Date();

						const timeStr: string = [
							'T',
							padDigit(now.getHours(), 2),
							padDigit(now.getMinutes(), 2)
						].join('');

						const dateTime: DateTime = new DateTime(timeStr);

						expect(dateTime.valid).to.be.false;
					});

					it('Thh', () => {
						const now: Date = new Date();

						const timeStr: string = [
							'T',
							padDigit(now.getHours(), 2)
						].join('');

						const dateTime: DateTime = new DateTime(timeStr);

						expect(dateTime.valid).to.be.false;
					});
				});
			});
		});

		// date string is set to 'YYYY-MM-DD'
		// Z (not exists: assumes UTC, exists: Local
		describe('by date & time string', () => {
			it('YYYY-MM-DDTHH:mm', () => {
				const refDate: DateTime = new DateTime();

				const initStr: string = [
					[
						refDate.year,
						padDigit(refDate.month, 2),
						padDigit(refDate.date, 2)
					].join('-'),
					'T',
					[
						padDigit(refDate.hours, 2),
						padDigit(refDate.minutes, 2)
					].join(':')
				].join('');

				const date: DateTime = new DateTime(initStr);

				checkDateTime(date, {
					year: refDate.year,
					month: refDate.month,
					date: refDate.date,

					hours: refDate.hours,
					minutes: refDate.minutes,
					seconds: 0,
					ms: 0
				});
			});

			it('YYYY-MM-DDTHH:mmZ', () => {
				const refDate: DateTime = new DateTime();
				const refDateTimezoneAdded: DateTime = new DateTime(refDate).add({
					hours: refDate.timezoneOffsetInHours
				});

				const initStr: string = [
					[
						refDate.year,
						padDigit(refDate.month, 2),
						padDigit(refDate.date, 2)
					].join('-'),
					'T',
					[
						padDigit(refDate.hours, 2),
						padDigit(refDate.minutes, 2)
					].join(':'),
					'Z'
				].join('');

				const date: DateTime = new DateTime(initStr);

				checkDateTime(date, {
					year: refDateTimezoneAdded.year,
					month: refDateTimezoneAdded.month,
					date: refDateTimezoneAdded.date,

					hours: refDateTimezoneAdded.hours,
					minutes: refDateTimezoneAdded.minutes,
					seconds: 0,
					ms: 0
				});
			});

			it('YYYY-MM-DDTHH:mm:ss', () => {
				const refDate: DateTime = new DateTime();

				const initStr: string = [
					[
						refDate.year,
						padDigit(refDate.month, 2),
						padDigit(refDate.date, 2)
					].join('-'),
					'T',
					[
						padDigit(refDate.hours, 2),
						padDigit(refDate.minutes, 2),
						padDigit(refDate.seconds, 2)
					].join(':')
				].join('');

				const date: DateTime = new DateTime(initStr);

				checkDateTime(date, {
					year: refDate.year,
					month: refDate.month,
					date: refDate.date,

					hours: refDate.hours,
					minutes: refDate.minutes,
					seconds: refDate.seconds,
					ms: 0
				});
			});

			it('YYYY-MM-DDTHH:mm:ssZ', () => {
				const refDate: DateTime = new DateTime();
				const refDateTimezoneAdded: DateTime = new DateTime(refDate).add({
					hours: refDate.timezoneOffsetInHours
				});

				const initStr: string = [
					[
						refDate.year,
						padDigit(refDate.month, 2),
						padDigit(refDate.date, 2)
					].join('-'),
					'T',
					[
						padDigit(refDate.hours, 2),
						padDigit(refDate.minutes, 2),
						padDigit(refDate.seconds, 2)
					].join(':'),
					'Z'
				].join('');

				const date: DateTime = new DateTime(initStr);

				checkDateTime(date, {
					year: refDateTimezoneAdded.year,
					month: refDateTimezoneAdded.month,
					date: refDateTimezoneAdded.date,

					hours: refDateTimezoneAdded.hours,
					minutes: refDateTimezoneAdded.minutes,
					seconds: refDateTimezoneAdded.seconds,
					ms: 0
				});
			});

			it('YYYY-MM-DDTHH:mm:ss.SSS', () => {
				const refDate: DateTime = new DateTime();

				const initStr: string = [
					[
						refDate.year,
						padDigit(refDate.month, 2),
						padDigit(refDate.date, 2)
					].join('-'),
					'T',
					[
						padDigit(refDate.hours, 2),
						padDigit(refDate.minutes, 2),
						padDigit(refDate.seconds, 2)
					].join(':'),
					'.',
					padDigit(refDate.ms, 3)
				].join('');

				const date: DateTime = new DateTime(initStr);

				checkDateTime(date, {
					year: refDate.year,
					month: refDate.month,
					date: refDate.date,

					hours: refDate.hours,
					minutes: refDate.minutes,
					seconds: refDate.seconds,
					ms: refDate.ms
				});
			});

			it('YYYY-MM-DDTHH:mm:ss.SSSZ', () => {
				const refDate: DateTime = new DateTime();
				const refDateTimezoneAdded: DateTime = new DateTime(refDate).add({
					hours: refDate.timezoneOffsetInHours
				});

				const initStr: string = [
					[
						refDate.year,
						padDigit(refDate.month, 2),
						padDigit(refDate.date, 2)
					].join('-'),
					'T',
					[
						padDigit(refDate.hours, 2),
						padDigit(refDate.minutes, 2),
						padDigit(refDate.seconds, 2)
					].join(':'),
					'.',
					padDigit(refDate.ms, 3),
					'Z'
				].join('');

				const date: DateTime = new DateTime(initStr);

				checkDateTime(date, {
					year: refDateTimezoneAdded.year,
					month: refDateTimezoneAdded.month,
					date: refDateTimezoneAdded.date,

					hours: refDateTimezoneAdded.hours,
					minutes: refDateTimezoneAdded.minutes,
					seconds: refDateTimezoneAdded.seconds,
					ms: refDateTimezoneAdded.ms
				});
			});
		});

		describe('with string format', () => {
			const now: Date = new Date();

			it('invalid format token', () => {
				expect(() => new DateTime('1234', 'bc')).to.throws;
			});

			describe('year', () => {
				it('duplicated tokens', () => {
					expect(() => new DateTime(
						('' + now.getFullYear()) + '-' + (now.getFullYear() % 100),
						FormatToken.Year + FormatToken.YearShort
					)).to.throws;
				});

				describe(FormatToken.YearShort, () => {
					it('invalid value', () => {
						expect(() => new DateTime('1', FormatToken.YearShort)).to.throws;
					});

					it('simple - 1 digit', () => {
						const date: DateTime = new DateTime(
							'' + 5,
							FormatToken.YearShort
						);

						checkDateTime(date, {
							year: 1905,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('simple - 2 digit', () => {
						const date: DateTime = new DateTime(
							'21',
							FormatToken.YearShort
						);

						checkDateTime(date, {
							year: 1921,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					xit('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const date: DateTime = new DateTime(
							prefix + '21' + suffix,
							prefix + FormatToken.YearShort + suffix
						);

						checkDateTime(date, {
							year: 1921,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});
				});

				describe(FormatToken.Year, () => {
					it('very before value', () => {
						const date: DateTime = new DateTime('100', FormatToken.Year);

						checkDateTime(date, {
							year: 100,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('very after value', () => {
						const date: DateTime = new DateTime('123456', FormatToken.Year);

						checkDateTime(date, {
							year: 123456,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('simple', () => {
						const date: DateTime = new DateTime(
							'' + now.getFullYear(),
							FormatToken.Year
						);

						checkDateTime(date, {
							year: now.getFullYear(),
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const date: DateTime = new DateTime(
							prefix + now.getFullYear() + suffix,
							prefix + FormatToken.Year + suffix
						);

						checkDateTime(date, {
							year: now.getFullYear(),
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});
				});
			});

			describe('month', () => {
				it('duplicated tokens', () => {
					expect(() => new DateTime(
						('' + (now.getMonth() + 1)) + '-' + (now.getMonth() + 1),
						FormatToken.Month + FormatToken.MonthPadded
					)).to.throws;
				});

				describe(FormatToken.Month, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.Month)).to.throws;
					});

					it('value === 0', () => {
						const date: DateTime = new DateTime(
							'0',
							FormatToken.Month
						);

						checkDateTime(date, {
							year: DefaultValue.year - 1,
							month: 12,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const date: DateTime = new DateTime(
							'' + (now.getMonth() + 1),
							FormatToken.Month
						);

						checkDateTime(date, {
							year: DefaultValue.year,
							month: now.getMonth() + 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('simple - 2 digit', () => {
						const refDate: Date = new Date(now.getFullYear(), 11, 1);

						const date: DateTime = new DateTime(
							'' + (refDate.getMonth() + 1),
							FormatToken.Month
						);

						checkDateTime(date, {
							year: DefaultValue.year,
							month: refDate.getMonth() + 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('value - round up', () => {
						const date: DateTime = new DateTime(
							'13',
							FormatToken.Month
						);

						checkDateTime(date, {
							year: DefaultValue.year + 1,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const date: DateTime = new DateTime(
							prefix + (now.getMonth() + 1) + suffix,
							prefix + FormatToken.Month + suffix
						);

						checkDateTime(date, {
							year: DefaultValue.year,
							month: now.getMonth() + 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});
				});

				describe(FormatToken.MonthPadded, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.MonthPadded)).to.throws;
					});

					it('invalid length', () => {
						expect(() => new DateTime(
							'0',
							FormatToken.MonthPadded
						)).to.throws;
					});

					it('value === 0', () => {
						const date: DateTime = new DateTime(
							'00',
							FormatToken.MonthPadded
						);

						checkDateTime(date, {
							year: DefaultValue.year - 1,
							month: 12,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const date: DateTime = new DateTime(
							padDigit(now.getMonth() + 1, 2),
							FormatToken.MonthPadded
						);

						checkDateTime(date, {
							year: DefaultValue.year,
							month: now.getMonth() + 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('simple - 2 digit', () => {
						const refDate: Date = new Date(now.getFullYear(), 11, 1);

						const date: DateTime = new DateTime(
							padDigit(refDate.getMonth() + 1, 2),
							FormatToken.MonthPadded
						);

						checkDateTime(date, {
							year: DefaultValue.year,
							month: refDate.getMonth() + 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('value - round up', () => {
						const date: DateTime = new DateTime(
							'13',
							FormatToken.MonthPadded
						);

						checkDateTime(date, {
							year: DefaultValue.year + 1,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const date: DateTime = new DateTime(
							prefix + padDigit(now.getMonth() + 1, 2) + suffix,
							prefix + FormatToken.MonthPadded + suffix
						);

						checkDateTime(date, {
							year: DefaultValue.year,
							month: now.getMonth() + 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});
				});

				// TODO: FormatToken.MonthStringShort
				// TODO: FormatToken.MonthStringLong
			});

			describe('date', () => {
				it('duplicated tokens', () => {
					expect(() => new DateTime(
						('' + now.getDate()) + '-' + now.getDate(),
						FormatToken.DayOfMonth + FormatToken.DayOfMonthPadded
					)).to.throws;
				});

				describe(FormatToken.DayOfMonth, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.DayOfMonth)).to.throws;
					});

					it('value === 0', () => {
						const refDate: DateTime = new DateTime({
							date: 0
						});

						const date: DateTime = new DateTime(
							'0',
							FormatToken.DayOfMonth
						);

						checkDateTime(date, {
							year: refDate.year,
							month: refDate.month,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('simple - 1 digit', () => {
						const refDate: DateTime = new DateTime({
							date: 5
						});

						const date: DateTime = new DateTime(
							'' + 5,
							FormatToken.DayOfMonth
						);

						checkDateTime(date, {
							year: refDate.year,
							month: refDate.month,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							date: 13
						});

						const date: DateTime = new DateTime(
							'' + refDate.date,
							FormatToken.DayOfMonth
						);

						checkDateTime(date, {
							year: refDate.year,
							month: refDate.month,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('value - round up', () => {
						const refDate: DateTime = new DateTime({
							date: 50
						});

						const date: DateTime = new DateTime(
							'50',
							FormatToken.DayOfMonth
						);

						checkDateTime(date, {
							year: refDate.year,
							month: refDate.month,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const refDate: DateTime = new DateTime({
							date: 15
						});

						const date: DateTime = new DateTime(
							prefix + refDate.date + suffix,
							prefix + FormatToken.DayOfMonth + suffix
						);

						checkDateTime(date, {
							year: refDate.year,
							month: refDate.month,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});
				});

				describe(FormatToken.DayOfMonthPadded, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.DayOfMonthPadded)).to.throws;
					});

					it('invalid length', () => {
						expect(() => new DateTime(
							'0',
							FormatToken.DayOfMonthPadded
						)).to.throws;
					});

					it('value === 0', () => {
						const refDate: DateTime = new DateTime({
							date: 0
						});

						const date: DateTime = new DateTime(
							'00',
							FormatToken.DayOfMonthPadded
						);

						checkDateTime(date, {
							year: refDate.year,
							month: refDate.month,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const refDate: DateTime = new DateTime({
							date: 5
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.date, 2),
							FormatToken.DayOfMonthPadded
						);

						checkDateTime(date, {
							year: refDate.year,
							month: refDate.month,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							date: 13
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.date, 2),
							FormatToken.DayOfMonthPadded
						);

						checkDateTime(date, {
							year: refDate.year,
							month: refDate.month,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('value - round up', () => {
						const refDate: DateTime = new DateTime({
							date: 50
						});

						const date: DateTime = new DateTime(
							'50',
							FormatToken.DayOfMonthPadded
						);

						checkDateTime(date, {
							year: refDate.year,
							month: refDate.month,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const refDate: DateTime = new DateTime({
							date: 15
						});

						const date: DateTime = new DateTime(
							prefix + refDate.date + suffix,
							prefix + FormatToken.DayOfMonthPadded + suffix
						);

						checkDateTime(date, {
							year: refDate.year,
							month: refDate.month,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});
				});

				describe(FormatToken.DayOfYear, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.DayOfYear)).to.throws;
					});

					it('value === 0', () => {
						const refDate: DateTime = new DateTime({
							date: 0
						});

						const date: DateTime = new DateTime(
							'0',
							FormatToken.DayOfYear
						);

						checkDateTime(date, {
							year: DefaultValue.year - 1,
							month: 12,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const refDate: DateTime = new DateTime({
							date: 5
						});

						const date: DateTime = new DateTime(
							'' + refDate.date,
							FormatToken.DayOfYear
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							date: 13
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.date, 2),
							FormatToken.DayOfYear
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('value - round up', () => {
						const refDate: DateTime = new DateTime({
							month: 1,
							date: 50
						});

						const date: DateTime = new DateTime(
							'50',
							FormatToken.DayOfYear
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 2,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const refDate: DateTime = new DateTime({
							date: 15
						});

						const date: DateTime = new DateTime(
							prefix + refDate.date + suffix,
							prefix + FormatToken.DayOfYear + suffix
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});
				});

				describe(FormatToken.DayOfYearPadded, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.DayOfYearPadded)).to.throws;
					});

					it('invalid length', () => {
						expect(() => new DateTime(
							'0',
							FormatToken.DayOfYearPadded
						)).to.throws;
					});

					it('invalid length', () => {
						expect(() => new DateTime(
							'00',
							FormatToken.DayOfYearPadded
						)).to.throws;
					});

					it('value === 0', () => {
						const refDate: DateTime = new DateTime({
							date: 0
						});

						const date: DateTime = new DateTime(
							padDigit('0', 3),
							FormatToken.DayOfYearPadded
						);

						checkDateTime(date, {
							year: DefaultValue.year - 1,
							month: 12,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const refDate: DateTime = new DateTime({
							date: 5
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.date, 3),
							FormatToken.DayOfYearPadded
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							date: 13
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.date, 3),
							FormatToken.DayOfYearPadded
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('value - round up', () => {
						const refDate: DateTime = new DateTime({
							month: 1,
							date: 50
						});

						const date: DateTime = new DateTime(
							padDigit('50', 3),
							FormatToken.DayOfYearPadded
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 2,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const refDate: DateTime = new DateTime({
							date: 15
						});

						const date: DateTime = new DateTime(
							prefix + padDigit(refDate.date, 3) + suffix,
							prefix + FormatToken.DayOfYearPadded + suffix
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: refDate.date,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});
				});
			});

			xdescribe('meridiem', () => {
				it('duplicated tokens', () => {
					expect(() => new DateTime(
						('' + now.getDate()) + '-' + now.getDate(),
						FormatToken.MeridiemLower + FormatToken.MeridiemCapital
					)).to.throws;
				});

				describe(FormatToken.MeridiemLower, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.MeridiemLower)).to.throws;
					});

					it('am - from lower string', () => {
						const date: DateTime = new DateTime('am', FormatToken.MeridiemLower);

						checkDateTime(date, {
							year: now.getFullYear(),
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('pm - from lower string', () => {
						const date: DateTime = new DateTime('pm', FormatToken.MeridiemLower);

						checkDateTime(date, {
							year: now.getFullYear(),
							month: 1,
							date: 1,

							hours: 12,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('am - from capital string', () => {
						expect(() => new DateTime('AM', FormatToken.MeridiemLower)).to.throws;
					});

					it('pm - from capital string', () => {
						expect(() => new DateTime('PM', FormatToken.MeridiemLower)).to.throws;
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const date: DateTime = new DateTime(
							prefix + 'am' + suffix,
							prefix + FormatToken.MeridiemLower + suffix
						);

						checkDateTime(date, {
							year: now.getFullYear(),
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});
				});

				describe(FormatToken.MeridiemCapital, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.MeridiemCapital)).to.throws;
					});

					it('am - from lower string', () => {
						expect(() => new DateTime('am', FormatToken.MeridiemCapital)).to.throws;
					});

					it('pm - from lower string', () => {
						expect(() => new DateTime('PM', FormatToken.MeridiemCapital)).to.throws;
					});

					it('am - from capital string', () => {
						const date: DateTime = new DateTime('AM', FormatToken.MeridiemCapital);

						checkDateTime(date, {
							year: now.getFullYear(),
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('pm - from capital string', () => {
						const date: DateTime = new DateTime('PM', FormatToken.MeridiemCapital);

						checkDateTime(date, {
							year: now.getFullYear(),
							month: 1,
							date: 1,

							hours: 12,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const date: DateTime = new DateTime(
							prefix + 'PM' + suffix,
							prefix + FormatToken.MeridiemCapital + suffix
						);

						checkDateTime(date, {
							year: now.getFullYear(),
							month: 1,
							date: 1,

							hours: 12,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});
				});
			});

			describe('hours', () => {
				it('duplicated tokens', () => {
					expect(() => new DateTime(
						('' + now.getDate()) + '-' + now.getDate(),
						FormatToken.Hours24 + FormatToken.Hours12
					)).to.throws;
				});

				describe('24-hours', () => {
					describe(FormatToken.Hours24, () => {
						it('invalid value', () => {
							expect(() => new DateTime('', FormatToken.Hours24)).to.throws;
						});

						it('value === 0', () => {
							const refDate: DateTime = new DateTime({
								hours: 0
							});

							const date: DateTime = new DateTime(
								'0',
								FormatToken.Hours24
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: 0,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});


						it('simple - 1 digit', () => {
							const refDate: DateTime = new DateTime({
								hours: 5
							});

							const date: DateTime = new DateTime(
								'' + refDate.hours,
								FormatToken.Hours24
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: 5,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('simple - 2 digit', () => {
							const refDate: DateTime = new DateTime({
								hours: 13
							});

							const date: DateTime = new DateTime(
								padDigit(refDate.hours, 2),
								FormatToken.Hours24
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: refDate.hours,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('value - round up', () => {
							const refDate: DateTime = new DateTime({
								hours: 26
							});

							const date: DateTime = new DateTime(
								'26',
								FormatToken.Hours24
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 2,

								hours: 2,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('extract', () => {
							const prefix: string = '123-';
							const suffix: string = '-321';

							const refDate: DateTime = new DateTime({
								hours: 15
							});

							const date: DateTime = new DateTime(
								prefix + refDate.hours + suffix,
								prefix + FormatToken.Hours24 + suffix
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: 15,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});
					});

					describe(FormatToken.Hours24Padded, () => {
						it('invalid value', () => {
							expect(() => new DateTime('', FormatToken.Hours24Padded)).to.throws;
						});

						it('invalid length', () => {
							expect(() => new DateTime(
								'0',
								FormatToken.Hours24Padded
							)).to.throws;
						});

						it('value === 0', () => {
							const refDate: DateTime = new DateTime({
								hours: 0
							});

							const date: DateTime = new DateTime(
								'00',
								FormatToken.Hours24Padded
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: 0,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});


						it('simple - 1 digit', () => {
							const refDate: DateTime = new DateTime({
								hours: 5
							});

							const date: DateTime = new DateTime(
								padDigit(refDate.hours, 2),
								FormatToken.Hours24Padded
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: 5,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('simple - 2 digit', () => {
							const refDate: DateTime = new DateTime({
								hours: 13
							});

							const date: DateTime = new DateTime(
								padDigit(refDate.hours, 2),
								FormatToken.Hours24Padded
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: refDate.hours,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('value - round up', () => {
							const refDate: DateTime = new DateTime({
								hours: 26
							});

							const date: DateTime = new DateTime(
								'26',
								FormatToken.Hours24Padded
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 2,

								hours: 2,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('extract', () => {
							const prefix: string = '123-';
							const suffix: string = '-321';

							const refDate: DateTime = new DateTime({
								hours: 15
							});

							const date: DateTime = new DateTime(
								prefix + refDate.hours + suffix,
								prefix + FormatToken.Hours24Padded + suffix
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: refDate.hours,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});
					});
				});

				xdescribe('12-hours', () => {
					describe(FormatToken.Hours12, () => {
						it('invalid value', () => {
							expect(() => new DateTime('', FormatToken.Hours12)).to.throws;
						});

						it('without meridiem', () => {
							expect(() => new DateTime('08', FormatToken.Hours12)).to.throws;
						});

						it('value === 0', () => {
							const refDate: DateTime = new DateTime({
								hours: 0
							});

							const date: DateTime = new DateTime(
								'0 am',
								FormatToken.Hours12 + ' ' + FormatToken.MeridiemLower
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: 0,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});


						it('simple - 1 digit', () => {
							const refDate: DateTime = new DateTime({
								hours: 5
							});

							const date: DateTime = new DateTime(
								'' + refDate.hours + ' am',
								FormatToken.Hours12 + ' ' + FormatToken.MeridiemLower
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: refDate.hours,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('simple - 2 digit', () => {
							const refDate: DateTime = new DateTime({
								hours: 11
							});

							const date: DateTime = new DateTime(
								padDigit(refDate.hours, 2) + ' am',
								FormatToken.Hours12 + ' ' + FormatToken.MeridiemLower
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: refDate.hours,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('value - round up', () => {
							const refDate: DateTime = new DateTime({
								hours: 13
							});

							const date: DateTime = new DateTime(
								'13 pm',
								FormatToken.Hours12 + ' ' + FormatToken.MeridiemLower
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 2,

								hours: 1,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('extract', () => {
							const prefix: string = '123-';
							const suffix: string = '-321';

							const refDate: DateTime = new DateTime({
								hours: 11
							});

							const date: DateTime = new DateTime(
								prefix + refDate.hours + suffix + ' am',
								prefix + FormatToken.Hours12 + suffix + ' am'
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: refDate.hours,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});
					});

					describe(FormatToken.Hours12Padded, () => {
						it('invalid value', () => {
							expect(() => new DateTime('', FormatToken.Hours12Padded)).to.throws;
						});

						it('without meridiem', () => {
							expect(() => new DateTime('08', FormatToken.Hours12Padded)).to.throws;
						});

						it('invalid length', () => {
							expect(() => new DateTime(
								'0 am',
								FormatToken.Hours12Padded + ' ' + FormatToken.MeridiemLower
							)).to.throws;
						});

						it('value === 0', () => {
							const refDate: DateTime = new DateTime({
								hours: 0
							});

							const date: DateTime = new DateTime(
								'00',
								FormatToken.Hours12Padded + ' ' + FormatToken.MeridiemLower
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: 0,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});


						it('simple - 1 digit', () => {
							const refDate: DateTime = new DateTime({
								hours: 5
							});

							const date: DateTime = new DateTime(
								padDigit(refDate.hours, 2) + ' am',
								FormatToken.Hours12Padded + ' ' + FormatToken.MeridiemLower
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: refDate.hours,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('simple - 2 digit', () => {
							const refDate: DateTime = new DateTime({
								hours: 11
							});

							const date: DateTime = new DateTime(
								padDigit(refDate.hours, 2) + ' am',
								FormatToken.Hours12Padded + ' ' + FormatToken.MeridiemLower
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: refDate.hours,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('value - round up', () => {
							const refDate: DateTime = new DateTime({
								hours: 13
							});

							const date: DateTime = new DateTime(
								'13 pm',
								FormatToken.Hours12Padded + ' ' + FormatToken.MeridiemLower
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 2,

								hours: 1,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});

						it('extract', () => {
							const prefix: string = '123-';
							const suffix: string = '-321';

							const refDate: DateTime = new DateTime({
								hours: 11
							});

							const date: DateTime = new DateTime(
								prefix + refDate.hours + suffix + ' am',
								prefix + FormatToken.Hours12Padded + suffix + ' am'
							);

							checkDateTime(date, {
								year: refDate.year,
								month: 1,
								date: 1,

								hours: refDate.hours,
								minutes: 0,
								seconds: 0,
								ms: 0
							});
						});
					});
				});
			});

			describe('minutes', () => {
				it('duplicated tokens', () => {
					expect(() => new DateTime(
						('' + now.getDate()) + '-' + now.getDate(),
						FormatToken.MinutesPadded + FormatToken.Minutes
					)).to.throws;
				});

				describe(FormatToken.Minutes, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.Minutes)).to.throws;
					});

					it('value === 0', () => {
						const refDate: DateTime = new DateTime({
							minutes: 0
						});

						const date: DateTime = new DateTime(
							'0',
							FormatToken.Minutes
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const refDate: DateTime = new DateTime({
							minutes: 5
						});

						const date: DateTime = new DateTime(
							'' + refDate.minutes,
							FormatToken.Minutes
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: refDate.minutes,
							seconds: 0,
							ms: 0
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							minutes: 13
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.minutes, 2),
							FormatToken.Minutes
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: refDate.minutes,
							seconds: 0,
							ms: 0
						});
					});

					it('value - round up', () => {
						const refDate: DateTime = new DateTime({
							minutes: 90
						});

						const date: DateTime = new DateTime(
							'90',
							FormatToken.Minutes
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 1,
							minutes: 30,
							seconds: 0,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const refDate: DateTime = new DateTime({
							minutes: 15
						});

						const date: DateTime = new DateTime(
							prefix + refDate.minutes + suffix,
							prefix + FormatToken.Minutes + suffix
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: refDate.minutes,
							seconds: 0,
							ms: 0
						});
					});
				});

				describe(FormatToken.MinutesPadded, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.Minutes)).to.throws;
					});

					it('invalid length', () => {
						expect(() => new DateTime(
							'0',
							FormatToken.MinutesPadded
						)).to.throws;
					});

					it('value === 0', () => {
						const refDate: DateTime = new DateTime({
							minutes: 0
						});

						const date: DateTime = new DateTime(
							'00',
							FormatToken.Minutes
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const refDate: DateTime = new DateTime({
							minutes: 5
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.minutes, 2),
							FormatToken.Minutes
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: refDate.minutes,
							seconds: 0,
							ms: 0
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							minutes: 13
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.minutes, 2),
							FormatToken.Minutes
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: refDate.minutes,
							seconds: 0,
							ms: 0
						});
					});

					it('value - round up', () => {
						const refDate: DateTime = new DateTime({
							minutes: 90
						});

						const date: DateTime = new DateTime(
							'90',
							FormatToken.Minutes
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 1,
							minutes: 30,
							seconds: 0,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const refDate: DateTime = new DateTime({
							minutes: 15
						});

						const date: DateTime = new DateTime(
							prefix + refDate.minutes + suffix,
							prefix + FormatToken.Minutes + suffix
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: refDate.minutes,
							seconds: 0,
							ms: 0
						});
					});
				});
			});

			describe('seconds', () => {
				it('duplicated tokens', () => {
					expect(() => new DateTime(
						('' + now.getDate()) + '-' + now.getDate(),
						FormatToken.Seconds + FormatToken.SecondsPadded
					)).to.throws;
				});

				describe(FormatToken.Seconds, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.Seconds)).to.throws;
					});

					it('value === 0', () => {
						const refDate: DateTime = new DateTime({
							seconds: 0
						});

						const date: DateTime = new DateTime(
							'0',
							FormatToken.Seconds
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const refDate: DateTime = new DateTime({
							seconds: 5
						});

						const date: DateTime = new DateTime(
							'' + refDate.seconds,
							FormatToken.Seconds
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: refDate.seconds,
							ms: 0
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							seconds: 13
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.seconds, 2),
							FormatToken.Seconds
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: refDate.seconds,
							ms: 0
						});
					});

					it('value - round up', () => {
						const refDate: DateTime = new DateTime({
							seconds: 80
						});

						const date: DateTime = new DateTime(
							'80',
							FormatToken.Seconds
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 1,
							seconds: 20,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const refDate: DateTime = new DateTime({
							seconds: 15
						});

						const date: DateTime = new DateTime(
							prefix + refDate.seconds + suffix,
							prefix + FormatToken.Seconds + suffix
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: refDate.seconds,
							ms: 0
						});
					});
				});

				describe(FormatToken.SecondsPadded, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.SecondsPadded)).to.throws;
					});

					it('invalid length', () => {
						expect(() => new DateTime(
							'0',
							FormatToken.SecondsPadded
						)).to.throws;
					});

					it('value === 0', () => {
						const refDate: DateTime = new DateTime({
							seconds: 0
						});

						const date: DateTime = new DateTime(
							'00',
							FormatToken.SecondsPadded
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const refDate: DateTime = new DateTime({
							seconds: 5
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.seconds, 2),
							FormatToken.SecondsPadded
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: refDate.seconds,
							ms: 0
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							seconds: 13
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.seconds, 2),
							FormatToken.SecondsPadded
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: refDate.seconds,
							ms: 0
						});
					});

					it('value - round up', () => {
						const refDate: DateTime = new DateTime({
							seconds: 80
						});

						const date: DateTime = new DateTime(
							'80',
							FormatToken.SecondsPadded
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 1,
							seconds: 20,
							ms: 0
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const refDate: DateTime = new DateTime({
							seconds: 15
						});

						const date: DateTime = new DateTime(
							prefix + refDate.seconds + suffix,
							prefix + FormatToken.SecondsPadded + suffix
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: refDate.seconds,
							ms: 0
						});
					});
				});
			});

			describe('ms', () => {
				it('duplicated tokens', () => {
					expect(() => new DateTime(
						('' + now.getDate()) + '-' + now.getDate(),
						FormatToken.MilliSeconds + FormatToken.MilliSecondsPadded2
					)).to.throws;
				});

				describe(FormatToken.MilliSeconds, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.MilliSeconds)).to.throws;
					});

					it('value === 0', () => {
						const refDate: DateTime = new DateTime({
							ms: 0
						});

						const date: DateTime = new DateTime(
							'0',
							FormatToken.MilliSeconds
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const refDate: DateTime = new DateTime({
							ms: 5
						});

						const date: DateTime = new DateTime(
							'' + refDate.ms,
							FormatToken.MilliSeconds
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: refDate.ms
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							ms: 13
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.ms, 2),
							FormatToken.MilliSeconds
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: refDate.ms
						});
					});

					it('simple - 3 digit', () => {
						const refDate: DateTime = new DateTime({
							ms: 133
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.ms, 3),
							FormatToken.MilliSeconds
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: refDate.ms
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const refDate: DateTime = new DateTime({
							ms: 15
						});

						const date: DateTime = new DateTime(
							prefix + refDate.ms + suffix,
							prefix + FormatToken.MilliSeconds + suffix
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: refDate.ms
						});
					});
				});

				describe(FormatToken.MilliSecondsPadded2, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.MilliSecondsPadded2)).to.throws;
					});

					it('invalid length', () => {
						expect(() => new DateTime(
							'0',
							FormatToken.MilliSecondsPadded2
						)).to.throws;
					});

					it('value === 0', () => {
						const refDate: DateTime = new DateTime({
							ms: 0
						});

						const date: DateTime = new DateTime(
							'00',
							FormatToken.MilliSecondsPadded2
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const refDate: DateTime = new DateTime({
							ms: 5
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.ms, 2),
							FormatToken.MilliSecondsPadded2
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: refDate.ms
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							ms: 13
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.ms, 2),
							FormatToken.MilliSecondsPadded2
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: refDate.ms
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const refDate: DateTime = new DateTime({
							ms: 15
						});

						const date: DateTime = new DateTime(
							prefix + refDate.ms + suffix,
							prefix + FormatToken.MilliSecondsPadded2 + suffix
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: refDate.ms
						});
					});
				});

				describe(FormatToken.MilliSecondsPadded3, () => {
					it('invalid value', () => {
						expect(() => new DateTime('', FormatToken.MilliSecondsPadded3)).to.throws;
					});

					it('invalid length', () => {
						expect(() => new DateTime(
							'0',
							FormatToken.MilliSecondsPadded3
						)).to.throws;
					});

					it('invalid length', () => {
						expect(() => new DateTime(
							'00',
							FormatToken.MilliSecondsPadded3
						)).to.throws;
					});

					it('value === 0', () => {
						const refDate: DateTime = new DateTime({
							ms: 0
						});

						const date: DateTime = new DateTime(
							'000',
							FormatToken.MilliSecondsPadded3
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: 0
						});
					});


					it('simple - 1 digit', () => {
						const refDate: DateTime = new DateTime({
							ms: 5
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.ms, 3),
							FormatToken.MilliSecondsPadded3
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: refDate.ms
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							ms: 13
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.ms, 3),
							FormatToken.MilliSecondsPadded3
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: refDate.ms
						});
					});

					it('simple - 2 digit', () => {
						const refDate: DateTime = new DateTime({
							ms: 131
						});

						const date: DateTime = new DateTime(
							padDigit(refDate.ms, 3),
							FormatToken.MilliSecondsPadded3
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: refDate.ms
						});
					});

					it('extract', () => {
						const prefix: string = '123-';
						const suffix: string = '-321';

						const refDate: DateTime = new DateTime({
							ms: 15
						});

						const date: DateTime = new DateTime(
							prefix + padDigit(refDate.ms, 3) + suffix,
							prefix + FormatToken.MilliSecondsPadded3 + suffix
						);

						checkDateTime(date, {
							year: refDate.year,
							month: 1,
							date: 1,

							hours: 0,
							minutes: 0,
							seconds: 0,
							ms: refDate.ms
						});
					});
				});
			});
		});
	});

	describe('with Date', () => {
		it('ok', () => {
			const now: Date = new Date();

			const newDate: Date = new Date(now);
			const newDateTime: DateTime = new DateTime(now);

			checkDateTime(newDateTime, {
				year: newDate.getFullYear(),
				month: newDate.getMonth() + 1,
				date: newDate.getDate(),

				hours: newDate.getHours(),
				minutes: newDate.getMinutes(),
				seconds: newDate.getSeconds(),
				ms: newDate.getMilliseconds()
			});
		});
	});

	describe('with number', () => {
		it('ok', () => {
			const now: Date = new Date();

			const newDate: DateTime = new DateTime(+now);

			checkDateTime(newDate, {
				year: now.getFullYear(),
				month: now.getMonth() + 1,
				date: now.getDate(),

				hours: now.getHours(),
				minutes: now.getMinutes(),
				seconds: now.getSeconds(),
				ms: now.getMilliseconds()
			});
		});
	});

	describe('with DateTime', () => {
		it('ok', () => {
			const now: Date = new Date();

			const newDateTime1: DateTime = new DateTime(now);
			const newDateTime2: DateTime = new DateTime(newDateTime1);

			checkDateTime(newDateTime2, {
				year: newDateTime1.year,
				month: newDateTime1.month,
				date: newDateTime1.date,

				hours: newDateTime1.hours,
				minutes: newDateTime1.minutes,
				seconds: newDateTime1.seconds,
				ms: newDateTime1.ms
			});
		});
	});

	describe('with DateTimeParam', () => {
		describe('each field', () => {
			DateTimeParamKeys.forEach((key: keyof DateTimeParam): void => {
				it(key, () => {
					const date: DateTime = new DateTime({
						[key]: key === DateTimeUnit.Year
							? 1975 // if 5, has some float error
							: 5
					});

					DateTimeParamKeys.forEach((checkKey: keyof DateTimeParam): void => {
						if (checkKey === key) {
							expect(date[checkKey]).to.be.eql(
								checkKey === DateTimeUnit.Year
									? 1975
									: 5
							);
						}
						else {
							expect(date[checkKey]).to.be.eql(DefaultValue[checkKey]);
						}
					});
				});
			});
		});

		it('all', () => {
			const now: Date = new Date();

			const newDate: DateTime = new DateTime({
				year: now.getFullYear(),
				month: now.getMonth() + 1,
				date: now.getDate(),

				hours: now.getHours(),
				minutes: now.getMinutes(),
				seconds: now.getSeconds(),
				ms: now.getMilliseconds()
			});

			checkDateTime(newDate, {
				year: now.getFullYear(),
				month: now.getMonth() + 1,
				date: now.getDate(),

				hours: now.getHours(),
				minutes: now.getMinutes(),
				seconds: now.getSeconds(),
				ms: now.getMilliseconds()
			});
		});

		describe('affect other field', () => {
			describe(DateTimeUnit.Month, () => {
				it('> 0, round up', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 13
					});

					checkDateTime(newDate, {
						year: 2021,
						month: 1,
						date: 1,

						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('=== 0, round down', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 0 // 1 step
					});

					checkDateTime(newDate, {
						year: 2019,
						month: 12,
						date: 1,

						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('< 0, round down', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: -5 // 6 steps
					});

					checkDateTime(newDate, {
						year: 2019,
						month: 7,
						date: 1,

						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('< 0, round down', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: -11 // 12 steps
					});

					checkDateTime(newDate, {
						year: 2019,
						month: 1,
						date: 1,

						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});
			});

			describe(DateTimeUnit.Date, () => {
				it('> 0, round up', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 5,
						date: 33
					});

					checkDateTime(newDate, {
						year: 2020,
						month: 6,
						date: 2,

						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('> 0, round up more', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 12,
						date: 33 // +2 steps
					});

					checkDateTime(newDate, {
						year: 2021,
						month: 1,
						date: 2,

						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('=== 0, round down', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 5,
						date: 0 // 1 step
					});

					checkDateTime(newDate, {
						year: 2020,
						month: 4,
						date: 30,

						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('< 0, round down', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 5,
						date: -5 // 1, 30, 29, 28, 27, 26, 25
					});

					checkDateTime(newDate, {
						year: 2020,
						month: 4,
						date: 25,

						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('< 0, round down more', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 1,
						date: -5 // 1, 31, 30, 29, 28, 27, 26
					});

					checkDateTime(newDate, {
						year: 2019,
						month: 12,
						date: 26,

						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});
			});

			describe(DateTimeUnit.Hours, () => {
				it('> 0, round up', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 5,
						date: 3,

						hours: 25
					});

					checkDateTime(newDate, {
						year: 2020,
						month: 5,
						date: 4,

						hours: 1,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('> 0, round up more', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 12,
						date: 31,

						hours: 36
					});

					checkDateTime(newDate, {
						year: 2021,
						month: 1,
						date: 1,

						hours: 12,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('< 0, round down', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 5,
						date: 2,

						hours: -1
					});

					checkDateTime(newDate, {
						year: 2020,
						month: 5,
						date: 1,

						hours: 23,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});

				it('< 0, round down more', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 1,
						date: 1,

						hours: -1
					});

					checkDateTime(newDate, {
						year: 2019,
						month: 12,
						date: 31,

						hours: 23,
						minutes: 0,
						seconds: 0,
						ms: 0
					});
				});
			});

			describe(DateTimeUnit.Minutes, () => {
				it('> 0, round up', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 5,
						date: 3,

						hours: 13,
						minutes: 80
					});

					checkDateTime(newDate, {
						year: 2020,
						month: 5,
						date: 3,

						hours: 14,
						minutes: 20,
						seconds: 0,
						ms: 0
					});
				});

				it('> 0, round up more', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 12,
						date: 31,

						hours: 23,
						minutes: 61
					});

					checkDateTime(newDate, {
						year: 2021,
						month: 1,
						date: 1,

						hours: 0,
						minutes: 1,
						seconds: 0,
						ms: 0
					});
				});

				it('< 0, round down', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 5,
						date: 2,

						hours: 3,
						minutes: -10
					});

					checkDateTime(newDate, {
						year: 2020,
						month: 5,
						date: 2,

						hours: 2,
						minutes: 50,
						seconds: 0,
						ms: 0
					});
				});

				it('< 0, round down more', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 1,
						date: 1,

						hours: 0,
						minutes: -10
					});

					checkDateTime(newDate, {
						year: 2019,
						month: 12,
						date: 31,

						hours: 23,
						minutes: 50,
						seconds: 0,
						ms: 0
					});
				});
			});

			describe(DateTimeUnit.Seconds, () => {
				it('> 0, round up', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 5,
						date: 3,

						hours: 13,
						minutes: 30,
						seconds: 70
					});

					checkDateTime(newDate, {
						year: 2020,
						month: 5,
						date: 3,

						hours: 13,
						minutes: 31,
						seconds: 10,
						ms: 0
					});
				});

				it('> 0, round up more', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 12,
						date: 31,

						hours: 23,
						minutes: 59,
						seconds: 90
					});

					checkDateTime(newDate, {
						year: 2021,
						month: 1,
						date: 1,

						hours: 0,
						minutes: 0,
						seconds: 30,
						ms: 0
					});
				});

				it('< 0, round down', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 5,
						date: 2,

						hours: 3,
						minutes: 3,
						seconds: -10
					});

					checkDateTime(newDate, {
						year: 2020,
						month: 5,
						date: 2,

						hours: 3,
						minutes: 2,
						seconds: 50,
						ms: 0
					});
				});

				it('< 0, round down more', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 1,
						date: 1,

						hours: 0,
						minutes: 0,
						seconds: -10
					});

					checkDateTime(newDate, {
						year: 2019,
						month: 12,
						date: 31,

						hours: 23,
						minutes: 59,
						seconds: 50,
						ms: 0
					});
				});
			});

			describe(DateTimeUnit.Ms, () => {
				it('> 0, round up', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 5,
						date: 3,

						hours: 13,
						minutes: 30,
						seconds: 30,
						ms: 1001
					});

					checkDateTime(newDate, {
						year: 2020,
						month: 5,
						date: 3,

						hours: 13,
						minutes: 30,
						seconds: 31,
						ms: 1
					});
				});

				it('> 0, round up more', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 12,
						date: 31,

						hours: 23,
						minutes: 59,
						seconds: 59,
						ms: 1010
					});

					checkDateTime(newDate, {
						year: 2021,
						month: 1,
						date: 1,

						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: 10
					});
				});

				it('< 0, round down', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 5,
						date: 2,

						hours: 3,
						minutes: 3,
						seconds: 3,
						ms: -50
					});

					checkDateTime(newDate, {
						year: 2020,
						month: 5,
						date: 2,

						hours: 3,
						minutes: 3,
						seconds: 2,
						ms: 950
					});
				});

				it('< 0, round down more', () => {
					const newDate: DateTime = new DateTime({
						year: 2020,
						month: 1,
						date: 1,

						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: -50
					});

					checkDateTime(newDate, {
						year: 2019,
						month: 12,
						date: 31,

						hours: 23,
						minutes: 59,
						seconds: 59,
						ms: 950
					});
				});
			});
		});
	});
};