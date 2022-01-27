import { expect } from 'chai';

import { DateTime } from '../src/date-time';
import { Duration } from '../src/duration';

import {
	DateTimeParamKeys,
	DateTimeUnit,
	DefaultLocale,
	DefaultValue,
	DurationParamKeys,
	FormatToken
} from '../src/constants';
import { durationUnitToDateTimeKey, loadLocaleFile, newArray, padDigit, wait } from '../src/util';
import {
	AnyObject,
	DateTimeParam,
	DurationParam,
	InitDataFormat,
	LocaleSet,
	MonthCalendar,
	YearCalendar
} from '../src/interfaces';
import { checkDateTime } from './test';


const MilliSecondsCloseTo: number = 10;


describe('DateTime', () => {
	describe('constructor()', () => {
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
	});

	describe('toDate()', () => {
		it('is Date', () => {
			expect(new DateTime().toDate()).to.be.instanceOf(Date);
		});
	});

	describe('toJson()', () => {
		it('ok', () => {
			const initParam: InitDataFormat = {
				year: 2020, month: 8, date: 4,
				hours: 13, minutes: 3, seconds: 16, ms: 32
			};

			const result: AnyObject<unknown> = new DateTime(initParam).toJson();

			expect(result).to.be.instanceOf(Object);

			DateTimeParamKeys.forEach((key: keyof DateTimeParam): void => {
				expect(result[key]).to.be.a('number');
				expect(result[key]).to.be.eql(initParam[key]);
			});
		});
	});

	describe('toString()', () => {
		it('ok', () => {
			const date: DateTime = new DateTime();

			expect(date.toString()).to.be.eql(date.toISOString());
		});
	});

	describe('locale', () => {
		const anotherLocale: string = 'ko-kr';

		beforeEach(async () => {
			// reset locale
			DateTime.locale(DefaultLocale);

			await wait();
		});

		describe('error', () => {
			// undefined is getter
			describe('invalid locale', () => {
				const invalidLocale: string = 'invalid-locale';

				it('with static setter', async () => {
					DateTime.locale(invalidLocale);

					// wait for load
					await wait();

					const date: DateTime = new DateTime();

					// not changed
					expect(date.locale()).to.be.eql(DefaultLocale);
				});

				it('with local setter', async () => {
					const date: DateTime = new DateTime();

					date.locale(invalidLocale);

					// wait for load
					await wait();

					// not changed
					expect(date.locale()).to.be.eql(DefaultLocale);
				});
			});

		});

		it('default locale', async () => {
			const date: DateTime = new DateTime();

			expect(date.locale()).to.be.eql(DefaultLocale);
		});

		it('start with another', async () => {
			DateTime.locale(anotherLocale);

			// wait for load
			await wait();

			const date1: DateTime = new DateTime();
			const date2: DateTime = new DateTime();

			expect(date1.locale()).to.be.eql(anotherLocale);
			expect(date2.locale()).to.be.eql(anotherLocale);
		});

		it('change to another', async () => {
			const date1: DateTime = new DateTime();

			// set locally
			date1.locale(anotherLocale);

			// wait for load
			await wait();

			expect(date1.locale()).to.be.eql(anotherLocale);

			const date2: DateTime = new DateTime();

			expect(date2.locale()).to.be.eql(DefaultLocale);

			// set globally
			DateTime.locale(anotherLocale);

			// wait for load
			await wait();

			const date3: DateTime = new DateTime();

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

			const date: DateTime = new DateTime();
			expect(date.locale()).to.be.eql(anotherLocale);
		});

		it('called multiple - local', async () => {
			const date: DateTime = new DateTime();

			date.locale(anotherLocale);
			date.locale(DefaultLocale);
			date.locale(anotherLocale);

			// wait for load
			await wait();

			expect(date.locale()).to.be.eql(anotherLocale);
		});

		it('from DateTime', async () => {
			const date1: DateTime = new DateTime();
			date1.locale(anotherLocale);

			// wait for load
			await wait();

			const date2: DateTime = new DateTime(date1);

			expect(date2.locale()).to.be.eql(anotherLocale);
		});
	});

	describe('set()', () => {
		let refDate: DateTime;

		before(() => {
			refDate = new DateTime();
		});

		it('ok', () => {
			DateTimeParamKeys.forEach((key: keyof DateTimeParam): void => {
				const now: Date = new Date();

				const newDate: DateTime = new DateTime(refDate);

				let changingValue: number | undefined;

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

				if (changingValue === undefined) {
					throw new Error('spec failed');
				}

				// set
				const setResult: DateTime = newDate.set({
					[key]: changingValue
				});

				expect(setResult).to.be.instanceOf(DateTime);

				// check
				DateTimeParamKeys.forEach((checkKey: keyof DateTimeParam): void => {
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
		let refDate: DateTime;

		before(() => {
			refDate = new DateTime().set({
				hours: 0
			});
		});

		describe('with DateTimeParam', () => {
			it('ok', () => {
				DateTimeParamKeys.forEach((key: keyof DateTimeParam): void => {
					const newDate: DateTime = new DateTime(refDate).add({
						[key]: 1
					});

					// check
					DateTimeParamKeys.forEach((checkKey: keyof DateTimeParam): void => {
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

		describe('with Duration', () => {
			it('ok', () => {
				DurationParamKeys.forEach((key: keyof DurationParam): void => {
					const newDate: DateTime = new DateTime(refDate);

					const duration: Duration = new Duration({
						[key]: 1
					});

					// add
					newDate.add(duration);

					// check
					DurationParamKeys.forEach((checkKey: keyof DurationParam): void => {
						const datetimeKey: keyof DateTimeParam = durationUnitToDateTimeKey(checkKey);

						if (checkKey === key) {
							expect(newDate[datetimeKey]).to.be.eql(refDate[datetimeKey] + 1);
						}
						else {
							expect(newDate[datetimeKey]).to.be.eql(refDate[datetimeKey]);
						}
					});
				});
			});
		});

		describe('with DurationParam', () => {
			it('ok', () => {
				DurationParamKeys.forEach((durationKey: keyof DurationParam): void => {
					const newDate: DateTime = new DateTime(refDate);

					// add
					const addResult: DateTime = newDate.add({
						[durationKey]: 1
					});

					expect(addResult).to.be.instanceOf(DateTime);

					// check
					const changedKey: keyof DateTimeParam = durationUnitToDateTimeKey(durationKey);

					DateTimeParamKeys.forEach((key: keyof DateTimeParam): void => {
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

	describe('UTC', () => {
		it('same date', () => {
			const initParam: Required<InitDataFormat> = {
				year: 2020, month: 8, date: 4,
				hours: 5, minutes: 3, seconds: 16, ms: 32
			};

			const date: Date = new Date(Date.UTC(
				initParam.year, initParam.month - 1, initParam.date,
				initParam.hours, initParam.minutes, initParam.seconds, initParam.ms
			));

			const dateTime: DateTime = new DateTime(date);

			const dateTimeByUTC: DateTime = new DateTime(Date.UTC(
				initParam.year, initParam.month - 1, initParam.date,
				initParam.hours, initParam.minutes, initParam.seconds, initParam.ms
			));

			expect(+dateTime).to.be.eql(+dateTimeByUTC);
		});

		it('different date & day', () => {
			const initParam: Required<InitDataFormat> = {
				year: 2020, month: 8, date: 4,
				hours: 17, minutes: 3, seconds: 16, ms: 32
			};

			const date: Date = new Date(Date.UTC(
				initParam.year, initParam.month - 1, initParam.date,
				initParam.hours, initParam.minutes, initParam.seconds, initParam.ms
			));

			const dateTime: DateTime = new DateTime(date);

			DateTimeParamKeys.forEach((key: keyof DateTimeParam): void => {
				switch (key) {
					case DateTimeUnit.Date:
						expect(dateTime.date).to.be.eql(initParam.date + 1);
						expect(dateTime.UTC.date).to.be.eql(initParam.date);

						expect(dateTime.UTC.day).to.be.eql(dateTime.day - 1);
						break;

					// skip hours
					case DateTimeUnit.Hours:
						break;

					default:
						expect(dateTime[key]).to.be.eql(initParam[key]);
				}
			});
		});

		it('different month', () => {
			const initParam: Required<InitDataFormat> = {
				year: 2020, month: 7, date: 31,
				hours: 15, minutes: 3, seconds: 16, ms: 32
			};

			const date: Date = new Date(Date.UTC(
				initParam.year, initParam.month - 1, initParam.date,
				initParam.hours, initParam.minutes, initParam.seconds, initParam.ms
			));

			const dateTime: DateTime = new DateTime(date);

			DateTimeParamKeys.forEach((key: keyof DateTimeParam): void => {
				switch (key) {
					case DateTimeUnit.Month:
						expect(dateTime.date).to.be.eql(1);
						expect(dateTime.UTC.date).to.be.eql(initParam.date);

						expect(dateTime.month).to.be.eql(initParam.month + 1);
						expect(dateTime.UTC.month).to.be.eql(initParam.month);
						break;

					// skip of other specs
					case DateTimeUnit.Date:
					case DateTimeUnit.Hours:
						break;

					default:
						expect(dateTime[key]).to.be.eql(initParam[key]);
				}
			});
		});

		it('different quarter', () => {
			const initParam: Required<InitDataFormat> = {
				year: 2020, month: 6, date: 30,
				hours: 15, minutes: 3, seconds: 16, ms: 32
			};

			const date: Date = new Date(Date.UTC(
				initParam.year, initParam.month - 1, initParam.date,
				initParam.hours, initParam.minutes, initParam.seconds, initParam.ms
			));

			const dateTime: DateTime = new DateTime(date);

			DateTimeParamKeys.forEach((key: keyof DateTimeParam): void => {
				switch (key) {
					// skip of other specs
					case DateTimeUnit.Month:
					case DateTimeUnit.Date:
					case DateTimeUnit.Hours:
						break;

					default:
						expect(dateTime[key]).to.be.eql(initParam[key]);
				}
			});

			expect(dateTime.month).to.be.eql(initParam.month + 1);
			expect(dateTime.UTC.month).to.be.eql(initParam.month);

			expect(dateTime.UTC.quarter).to.be.eql(dateTime.quarter - 1);
		});

		it('different year', () => {
			const initParam: Required<InitDataFormat> = {
				year: 2020, month: 12, date: 31,
				hours: 15, minutes: 3, seconds: 16, ms: 32
			};

			const date: Date = new Date(Date.UTC(
				initParam.year, initParam.month - 1, initParam.date,
				initParam.hours, initParam.minutes, initParam.seconds, initParam.ms
			));

			const dateTime: DateTime = new DateTime(date);

			DateTimeParamKeys.forEach((key: keyof DateTimeParam): void => {
				switch (key) {
					case DateTimeUnit.Year:
						expect(dateTime.date).to.be.eql(1);
						expect(dateTime.UTC.date).to.be.eql(initParam.date);

						expect(dateTime.month).to.be.eql(1);
						expect(dateTime.UTC.month).to.be.eql(initParam.month);

						expect(dateTime.quarter).to.be.eql(1);
						expect(dateTime.UTC.quarter).to.be.eql(4);

						expect(dateTime.year).to.be.eql(initParam.year + 1);
						expect(dateTime.UTC.year).to.be.eql(initParam.year);
						break;

					// skip of other specs
					case DateTimeUnit.Month:
					case DateTimeUnit.Date:
					case DateTimeUnit.Hours:
						break;

					default:
						expect(dateTime[key]).to.be.eql(initParam[key]);
				}
			});
		});
	});

	describe('startOf()', () => {
		const date: DateTime = new DateTime();

		DateTimeParamKeys.forEach((setKey, setKeyIndex) => {
			it(setKey, () => {
				const newDate: DateTime = date.startOf(setKey);

				DateTimeParamKeys.forEach((checkKey, checkKeyIndex) => {
					if (setKeyIndex >= checkKeyIndex) {
						// same value
						expect(newDate[checkKey]).to.be.eql(date[checkKey]);
					}
					else {
						// initial value
						switch (checkKey) {
							case DateTimeUnit.Month:
							case DateTimeUnit.Date:
								expect(newDate[checkKey]).to.be.eql(1);
								break;

							case DateTimeUnit.Hours:
								expect(newDate[checkKey]).to.be.eql(0);
								break;

							default:
								expect(newDate[checkKey]).to.be.eql(0);
						}
					}
				});
			});
		});

		it('string param', () => {
			const anotherDate: DateTime = new DateTime();

			expect(anotherDate.startOf('year')).to.be.ok;
		});
	});

	// check with UTC because of timezone
	describe('endOf()', () => {
		const date: DateTime = new DateTime();

		DateTimeParamKeys.forEach((setKey, setKeyIndex) => {
			it(setKey, () => {
				const newDate: DateTime = date.endOf(setKey);

				DateTimeParamKeys.forEach((checkKey, checkKeyIndex) => {
					if (setKeyIndex >= checkKeyIndex) {
						if (checkKey !== DateTimeUnit.Ms) {
							// same value
							expect(newDate[checkKey]).to.be.eql(date[checkKey]);
						}
						else {
							expect(newDate[checkKey]).to.be.eql(999);
						}

					}
					else {
						// last value
						switch (checkKey) {
							case DateTimeUnit.Month:
								expect(newDate[checkKey]).to.be.eql(12);
								break;

							case DateTimeUnit.Date:
								expect(newDate[checkKey]).to.be.eql(newDate.daysInMonth);
								break;

							case DateTimeUnit.Hours:
								expect(newDate[checkKey]).to.be.eql(23);
								break;

							case DateTimeUnit.Minutes:
								expect(newDate[checkKey]).to.be.eql(59);
								break;

							case DateTimeUnit.Seconds:
								expect(newDate[checkKey]).to.be.eql(59);
								break;
						}
					}
				});
			});
		});

		it('string param', () => {
			const anotherDate: DateTime = new DateTime();

			expect(anotherDate.endOf('year')).to.be.ok;
		});
	});

	describe('format()', () => {
		describe('year', () => {
			it(FormatToken.Year, () => {
				const years: number[] = newArray(20, (i: number): number => {
					return 2000 + i; // 2000 ~ 2019
				});

				years.forEach((year: number): void => {
					const date: DateTime = new DateTime({
						year
					});

					const result: string = date.format(FormatToken.Year);

					expect(result).to.be.lengthOf(4);
					expect(result).to.be.eql('' + year);
				});
			});

			it(FormatToken.YearShort, () => {
				const years: number[] = newArray(20, (i: number): number => {
					return 2000 + i; // 2000 ~ 2019
				});

				years.forEach((year: number): void => {
					const date: DateTime = new DateTime({
						year
					});

					const result: string = date.format(FormatToken.YearShort);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(('' + year).substr(2, 2));
				});
			});
		});

		describe('quarter', () => {
			it(FormatToken.Quarter, () => {
				const months: number[] = newArray(12, (i: number): number => {
					return i + 1; // 1 ~ 12
				});

				months.forEach((month: number): void => {
					const date: DateTime = new DateTime({
						month
					});

					const result: string = date.format(FormatToken.Quarter);

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
			let defaultLocaleSet: LocaleSet;

			before(async () => {
				defaultLocaleSet = await loadLocaleFile(DefaultLocale);
				DateTime.locale(DefaultLocale);

				await wait();
			});

			it(FormatToken.Month, () => {
				const months: number[] = newArray(12, (i: number): number => {
					return i + 1; // 1 ~ 12
				});

				months.forEach((month: number): void => {
					const date: DateTime = new DateTime({
						month
					});

					const result: string = date.format(FormatToken.Month);

					expect(result).to.be.lengthOf(month < 10 ? 1 : 2);
					expect(result).to.be.eql('' + month);
				});
			});

			it(FormatToken.MonthPadded, () => {
				const months: number[] = newArray(12, (i: number): number => {
					return i + 1; // 1 ~ 12
				});

				months.forEach((month: number): void => {
					const date: DateTime = new DateTime({
						month
					});

					const result: string = date.format(FormatToken.MonthPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(month, 2));
				});
			});

			it(FormatToken.MonthStringShort, () => {
				const months: number[] = newArray(12, (i: number): number => {
					return i + 1; // 1 ~ 12
				});

				months.forEach((month, i) => {
					const date: DateTime = new DateTime({
						month
					});

					const result: string = date.format(FormatToken.MonthStringShort);

					expect(result).to.be.eql(defaultLocaleSet.MonthShort[i]);
				});
			});

			it(FormatToken.MonthStringLong, () => {
				const months: number[] = newArray(12, (i: number): number => {
					return i + 1; // 1 ~ 12
				});

				months.forEach((month, i) => {
					const date: DateTime = new DateTime({
						month
					});

					const result: string = date.format(FormatToken.MonthStringLong);

					expect(result).to.be.eql(defaultLocaleSet.MonthLong[i]);
				});
			});
		});

		describe('week', () => {
			it(FormatToken.Week, () => {
				const dates: DateTime[] = newArray(43, (i: number): DateTime => {
					return new DateTime({ year: 2020, month: 1, date: i + 1 });
				});

				dates.forEach((date: DateTime): void => {
					const result: string = date.format(FormatToken.Week);

					expect(result).to.be.lengthOf(date.weekOfYear < 10 ? 1 : 2);
					expect(result).to.be.eql('' + date.weekOfYear);
				});
			});

			it(FormatToken.WeekPadded, () => {
				const dates: DateTime[] = newArray(43, (i: number): DateTime => {
					return new DateTime({ year: 2020, month: 1, date: i + 1 });
				});

				dates.forEach((date: DateTime): void => {
					const result: string = date.format(FormatToken.WeekPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(date.weekOfYear, 2));
				});
			});

			it(FormatToken.WeekPaddedWithPrefix, () => {
				const dates: DateTime[] = newArray(43, (i: number): DateTime => {
					return new DateTime({ year: 2020, month: 1, date: i + 1 });
				});

				dates.forEach((date: DateTime): void => {
					const result: string = date.format(FormatToken.WeekPaddedWithPrefix);

					expect(result).to.be.lengthOf(3);
					expect(result).to.be.eql('W' + padDigit(date.weekOfYear, 2));
				});
			});
		});

		describe('date', () => {
			it(FormatToken.DayOfYear, () => {
				const dates: number[] = newArray(100, (i: number): number => {
					return i + 1; // 1 ~ 100
				});

				dates.forEach((date: number): void => {
					const dateTime: DateTime = new DateTime({
						date
					});

					const result: string = dateTime.format(FormatToken.DayOfYear);

					expect(result).to.be.lengthOf(date < 10 ? 1 : (date < 100 ? 2 : 3));
					expect(result).to.be.eql('' + date);
				});
			});

			it(FormatToken.DayOfYearPadded, () => {
				const dates: number[] = newArray(100, (i: number): number => {
					return i + 1; // 1 ~ 100
				});

				dates.forEach((date: number): void => {
					const dateTime: DateTime = new DateTime({
						date
					});

					const result: string = dateTime.format(FormatToken.DayOfYearPadded);

					expect(result).to.be.lengthOf(3);
					expect(result).to.be.eql(padDigit(date, 3));
				});
			});

			it(FormatToken.DayOfMonth, () => {
				const dates: number[] = newArray(31, (i: number): number => {
					return i + 1; // 1 ~ 31
				});

				dates.forEach((date: number): void => {
					const dateTime: DateTime = new DateTime({
						date
					});

					const result: string = dateTime.format(FormatToken.DayOfMonth);

					expect(result).to.be.lengthOf(date < 10 ? 1 : 2);
					expect(result).to.be.eql('' + date);
				});
			});

			it(FormatToken.DayOfMonthPadded, () => {
				const dates: number[] = newArray(31, (i: number): number => {
					return i + 1; // 1 ~ 31
				});

				dates.forEach((date: number): void => {
					const dateTime: DateTime = new DateTime({
						date
					});

					const result: string = dateTime.format(FormatToken.DayOfMonthPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(date, 2));
				});
			});
		});

		describe('day', () => {
			let defaultLocaleSet: LocaleSet;

			before(async () => {
				defaultLocaleSet = await loadLocaleFile(DefaultLocale);
				DateTime.locale(DefaultLocale);

				await wait();
			});

			it(FormatToken.DayOfWeek, () => {
				const dates: DateTime[] = newArray(7, (i: number): DateTime => {
					return new DateTime({ year: 2020, month: 1, date: i });
				});

				dates.forEach((date: DateTime): void => {
					const result: string = date.format(FormatToken.DayOfWeek);

					expect(result).to.be.lengthOf(1);
					expect(result).to.be.eql('' + date.day);
				});
			});

			it(FormatToken.DayOfWeekStringShort, () => {
				const dates: DateTime[] = newArray(7, (i: number): DateTime => {
					return new DateTime({ year: 2020, month: 1, date: 5 + i }); // start with sunday (0)
				});

				dates.forEach((date, i) => {
					const result: string = date.format(FormatToken.DayOfWeekStringShort);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(defaultLocaleSet.DayOfWeekShort[i]);
				});
			});

			it(FormatToken.DayOfWeekStringMiddle, () => {
				const dates: DateTime[] = newArray(7, (i: number): DateTime => {
					return new DateTime({ year: 2020, month: 1, date: 5 + i }); // start with sunday (0)
				});

				dates.forEach((date, i) => {
					const result: string = date.format(FormatToken.DayOfWeekStringMiddle);

					expect(result).to.be.lengthOf(3);
					expect(result).to.be.eql(defaultLocaleSet.DayOfWeekMiddle[i]);
				});
			});

			it(FormatToken.DayOfWeekStringLong, () => {
				const dates: DateTime[] = newArray(7, (i: number): DateTime => {
					return new DateTime({ year: 2020, month: 1, date: 5 + i }); // start with sunday (0)
				});

				dates.forEach((date, i) => {
					const result: string = date.format(FormatToken.DayOfWeekStringLong);

					expect(result).to.be.eql(defaultLocaleSet.DayOfWeekLong[i]);
				});
			});
		});

		describe('meridiem', () => {
			let defaultLocaleSet: LocaleSet;

			before(async () => {
				defaultLocaleSet = await loadLocaleFile(DefaultLocale);
				DateTime.locale(DefaultLocale);

				await wait();
			});

			it(FormatToken.MeridiemLower, () => {
				const hoursArr: number[] = newArray(24, (i: number): number => i); // 0 ~ 23

				hoursArr.forEach((hours: number): void => {
					const date: DateTime = new DateTime({
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
				const hoursArr: number[] = newArray(24, (i: number): number => i); // 0 ~ 23

				hoursArr.forEach((hours: number): void => {
					const date: DateTime = new DateTime({
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
				const hoursArr: number[] = newArray(24, (i: number): number => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach((hours: number): void => {
					const date: DateTime = new DateTime({ hours });

					const result: string = date.format(FormatToken.Hours24);

					expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
					expect(result).to.be.eql('' + hours);
				});
			});


			it(FormatToken.Hours24Padded, () => {
				const hoursArr: number[] = newArray(24, (i: number): number => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach((hours: number): void => {
					const date: DateTime = new DateTime({ hours });

					const result: string = date.format(FormatToken.Hours24Padded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(hours, 2));
				});
			});

			it(FormatToken.Hours12, () => {
				const hoursArr: number[] = newArray(24, (i: number): number => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach((hours: number): void => {
					const date: DateTime = new DateTime({ hours });

					const result: string = date.format(FormatToken.Hours12);

					expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
					expect(result).to.be.eql('' + (hours > 12 ? hours % 12 : hours));
				});
			});

			it(FormatToken.Hours12Padded, () => {
				const hoursArr: number[] = newArray(24, (i: number): number => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach((hours: number): void => {
					const date: DateTime = new DateTime({ hours });

					const result: string = date.format(FormatToken.Hours12Padded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(hours > 12 ? hours % 12 : hours, 2));
				});
			});
		});

		describe('minutes', () => {
			it(FormatToken.Minutes, () => {
				const minutesArr: number[] = newArray(60, (i: number): number => {
					return i; // 0 ~ 59
				});

				minutesArr.forEach((minutes: number): void => {
					const date: DateTime = new DateTime({ minutes });

					const result: string = date.format(FormatToken.Minutes);

					expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
					expect(result).to.be.eql('' + minutes);
				});
			});


			it(FormatToken.MinutesPadded, () => {
				const minutesArr: number[] = newArray(60, (i: number): number => {
					return i; // 0 ~ 59
				});

				minutesArr.forEach((minutes: number): void => {
					const date: DateTime = new DateTime({ minutes });

					const result: string = date.format(FormatToken.MinutesPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(minutes, 2));
				});
			});
		});

		describe('seconds', () => {
			it(FormatToken.Seconds, () => {
				const secondsArr: number[] = newArray(60, (i: number): number => {
					return i; // 0 ~ 59
				});

				secondsArr.forEach((seconds: number): void => {
					const date: DateTime = new DateTime({ seconds });

					const result: string = date.format(FormatToken.Seconds);

					expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
					expect(result).to.be.eql('' + seconds);
				});
			});


			it(FormatToken.SecondsPadded, () => {
				const secondsArr: number[] = newArray(60, (i: number): number => {
					return i; // 0 ~ 59
				});

				secondsArr.forEach((seconds: number): void => {
					const date: DateTime = new DateTime({ seconds });

					const result: string = date.format(FormatToken.SecondsPadded);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(seconds, 2));
				});
			});
		});

		describe('ms', () => {
			it(FormatToken.MilliSeconds, () => {
				const msArr: number[] = newArray(999, (i: number): number => {
					return i; // 0 ~ 999
				});

				msArr.forEach((ms: number): void => {
					const date: DateTime = new DateTime({ ms });

					const result: string = date.format(FormatToken.MilliSeconds);

					expect(result).to.be.lengthOf(+result < 10 ? 1 : (+result < 100 ? 2 : 3));
					expect(result).to.be.eql('' + ms);
				});
			});


			it(FormatToken.MilliSecondsPadded2, () => {
				const msArr: number[] = newArray(999, (i: number): number => {
					return i; // 0 ~ 999
				});

				msArr.forEach((ms: number): void => {
					const date: DateTime = new DateTime({ ms });

					const result: string = date.format(FormatToken.MilliSecondsPadded2);

					expect(result).to.be.lengthOf(2);
					expect(result).to.be.eql(padDigit(ms < 100 ? ms : Math.floor(ms / 10), 2));
				});
			});

			it(FormatToken.MilliSecondsPadded3, () => {
				const msArr: number[] = newArray(999, (i: number): number => {
					return i; // 0 ~ 999
				});

				msArr.forEach((ms: number): void => {
					const date: DateTime = new DateTime({ ms });

					const result: string = date.format(FormatToken.MilliSecondsPadded3);

					expect(result).to.be.lengthOf(3);
					expect(result).to.be.eql(padDigit(ms, 3));
				});
			});
		});
	});

	// test with default locale
	describe('locale string', () => {
		let defaultLocaleSet: LocaleSet;

		const initParam: Required<InitDataFormat> = {
			year: 2020, month: 8, date: 4,
			hours: 13, minutes: 3, seconds: 16, ms: 32
		};

		before(async () => {
			defaultLocaleSet = await loadLocaleFile(DefaultLocale);

			await wait();
		});

		describe('toDateTimeLocale()', () => {
			it('ok', () => {
				const date: DateTime = new DateTime(initParam);

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
				const date: DateTime = new DateTime(initParam);

				expect(date.toLocaleDateString()).to.be.eql([
					initParam.month,
					initParam.date,
					initParam.year
				].join('/'));
			});
		});

		describe('toLocaleTimeString()', () => {
			it('ok', () => {
				const date: DateTime = new DateTime(initParam);

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
		it('string param', () => {
			const date1: DateTime = new DateTime();
			const date2: DateTime = new DateTime();

			expect(date1.diff(date2, 'year')).not.to.throw;
		});

		describe(DateTimeUnit.Year, () => {
			it('ok', () => {
				const date1: DateTime = new DateTime({
					year: 2020
				});

				const date2: DateTime = new DateTime({
					year: 2021
				});

				expect(date1.diff(date2, DateTimeUnit.Year)).to.be.eql(-1);
			});
		});

		describe(DateTimeUnit.Quarter, () => {
			it('same year', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 3
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 5
				});

				expect(date1.diff(date2, DateTimeUnit.Quarter)).to.be.eql(-1);
			});

			it('different year', () => {
				const date1: DateTime = new DateTime({
					year: 2021,
					month: 6,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 8
				});

				expect(date1.diff(date2, DateTimeUnit.Quarter)).to.be.eql(3);
			});
		});


		describe(DateTimeUnit.Month, () => {
			it('same year', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 3,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 5
				});

				expect(date1.diff(date2, DateTimeUnit.Month)).to.be.eql(-2);
			});

			it('different year', () => {
				const date1: DateTime = new DateTime({
					year: 2021,
					month: 3,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 5
				});

				expect(date1.diff(date2, DateTimeUnit.Month)).to.be.eql(10);
			});
		});

		describe(DateTimeUnit.Week, () => {
			it('same week', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 10
				});

				expect(date1.diff(date2, DateTimeUnit.Week)).to.be.eql(0);
			});

			it('different week', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 11
				});

				expect(date1.diff(date2, DateTimeUnit.Week)).to.be.eql(-1);
			});

			it('different month', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 3,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 11,
					date: 5
				});

				expect(date1.diff(date2, DateTimeUnit.Week)).to.be.eql(-5);
			});

			it('different year, but same week', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 12,
					date: 30,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2021,
					month: 1,
					date: 2
				});

				expect(date1.diff(date2, DateTimeUnit.Week)).to.be.eql(0);
			});

			it('different year, but different week', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 12,
					date: 30,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2021,
					month: 1,
					date: 3
				});

				expect(date1.diff(date2, DateTimeUnit.Week)).to.be.eql(-1);
			});
		});

		describe(DateTimeUnit.Date, () => {
			it('same month', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 13,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 20
				});

				expect(date1.diff(date2, DateTimeUnit.Date)).to.be.eql(-7);
			});

			it('different month', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 8,
					date: 5,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 7,
					date: 31
				});

				expect(date1.diff(date2, DateTimeUnit.Date)).to.be.eql(5);
			});

			it('different year', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 5,
					date: 5,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2021,
					month: 5,
					date: 6
				});

				expect(date1.diff(date2, DateTimeUnit.Date)).to.be.eql(-366);
			});
		});

		describe(DateTimeUnit.Hours, () => {
			it('same day', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					hours: 10,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					hours: 12
				});

				expect(date1.diff(date2, DateTimeUnit.Hours)).to.be.eql(-2);
			});

			it('different dates', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 3,
					hours: 5,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					hours: 5
				});

				expect(date1.diff(date2, DateTimeUnit.Hours)).to.be.eql(-2 * 24);
			});
		});

		describe(DateTimeUnit.Minutes, () => {
			it('same day', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					minutes: 10,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					minutes: 30
				});

				expect(date1.diff(date2, DateTimeUnit.Minutes)).to.be.eql(-20);
			});

			it('different dates', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 3,
					minutes: 5,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					minutes: 5
				});

				expect(date1.diff(date2, DateTimeUnit.Minutes)).to.be.eql(-2 * 24 * 60);
			});
		});

		describe(DateTimeUnit.Seconds, () => {
			it('same day', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					seconds: 10,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					seconds: 30
				});

				expect(date1.diff(date2, DateTimeUnit.Seconds)).to.be.eql(-20);
			});

			it('different minutes', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					minutes: 8,
					seconds: 10,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					minutes: 5,
					seconds: 30
				});

				expect(date1.diff(date2, DateTimeUnit.Seconds)).to.be.eql(160);
			});

			it('different day', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 3,
					seconds: 10,
					ms: 3 // margin
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 5,
					seconds: 30
				});

				expect(date1.diff(date2, DateTimeUnit.Seconds)).to.be.eql(-2 * 24 * 60 * 60 - 20);
			});
		});

		describe(DateTimeUnit.Ms, () => {
			it('same seconds', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 3,
					hours: 13,
					minutes: 53,
					seconds: 10,
					ms: 100
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 3,
					hours: 13,
					minutes: 53,
					seconds: 10,
					ms: 300
				});

				expect(date1.diff(date2, DateTimeUnit.Ms)).to.be.eql(date1.ms - date2.ms);
			});

			it('different seconds', () => {
				const date1: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 3,
					hours: 13,
					minutes: 53,
					seconds: 12,
					ms: 100
				});

				const date2: DateTime = new DateTime({
					year: 2020,
					month: 10,
					date: 3,
					hours: 13,
					minutes: 53,
					seconds: 10,
					ms: 300
				});

				expect(date1.diff(date2, DateTimeUnit.Ms)).to.be.eql(2 * 1000 + date1.ms - date2.ms);
			});
		});
	});

	describe('isEqual()', () => {
		it('string param', () => {
			const date1: DateTime = new DateTime();
			const date2: DateTime = new DateTime();

			expect(date1.isEqual(date2, 'year')).not.to.throw;
		});

		it('no unit param', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22,
				ms: 1
			});

			expect(date1.isEqual(date2)).to.be.false;
		});

		it('same date', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isEqual(date2, DateTimeUnit.Date)).to.be.true;
		});

		it('is before, but same with unit', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 21
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isEqual(date2, DateTimeUnit.Month)).to.be.true;
		});
	});

	describe('isBefore()', () => {
		it('string param', () => {
			const date1: DateTime = new DateTime();
			const date2: DateTime = new DateTime();

			expect(date1.isBefore(date2, 'year')).not.to.throw;
		});

		it('no unit param', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22,
				ms: 1
			});

			expect(date1.isBefore(date2)).to.be.true;
		});

		it('same date', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isBefore(date2, DateTimeUnit.Date)).to.be.false;
		});

		it('is before, but same with unit', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 21
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isBefore(date2, DateTimeUnit.Month)).to.be.false;
		});
	});

	describe('isBeforeOrEqual()', () => {
		it('string param', () => {
			const date1: DateTime = new DateTime();
			const date2: DateTime = new DateTime();

			expect(date1.isBeforeOrEqual(date2, 'year')).not.to.throw;
		});

		it('no unit param', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22,
				ms: 1
			});

			expect(date1.isBeforeOrEqual(date2)).to.be.true;
		});

		it('same date', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isBeforeOrEqual(date2, DateTimeUnit.Date)).to.be.true;
		});

		it('is before, but same with unit', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 21
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isBeforeOrEqual(date2, DateTimeUnit.Month)).to.be.true;
		});
	});

	describe('isAfter()', () => {
		it('string param', () => {
			const date1: DateTime = new DateTime();
			const date2: DateTime = new DateTime();

			expect(date1.isAfter(date2, 'year')).not.to.throw;
		});

		it('no unit param', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22,
				ms: 1
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isAfter(date2)).to.be.true;
		});

		it('same date', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isAfter(date2, DateTimeUnit.Date)).to.be.false;
		});

		it('is after, but same with unit', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 23
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isAfter(date2, DateTimeUnit.Month)).to.be.false;
		});
	});

	describe('isAfterOrEqual()', () => {
		it('string param', () => {
			const date1: DateTime = new DateTime();
			const date2: DateTime = new DateTime();

			expect(date1.isAfterOrEqual(date2, 'year')).not.to.throw;
		});

		it('no unit param', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22,
				ms: 1
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isAfterOrEqual(date2)).to.be.true;
		});

		it('same date', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isAfterOrEqual(date2, DateTimeUnit.Date)).to.be.true;
		});

		it('is after, but same with unit', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 23
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isAfterOrEqual(date2, DateTimeUnit.Month)).to.be.true;
		});
	});

	describe('isBetween()', () => {
		it('string param', () => {
			const date1: DateTime = new DateTime();
			const date2: DateTime = new DateTime();
			const date3: DateTime = new DateTime();

			expect(date1.isBetween(date2, date3, 'year')).not.to.throw;
		});

		it('different days', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 20
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date3: DateTime = new DateTime({
				year: 2020, month: 10, date: 24
			});

			expect(date1.isBetween(date2, date3)).to.be.false;
			expect(date1.isBetween(date3, date2)).to.be.false;

			expect(date2.isBetween(date1, date3)).to.be.true;
			expect(date2.isBetween(date3, date1)).to.be.true;

			expect(date3.isBetween(date1, date2)).to.be.false;
			expect(date3.isBetween(date2, date1)).to.be.false;
		});

		it('same day', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date3: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
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
		it('string param', () => {
			const date1: DateTime = new DateTime();
			const date2: DateTime = new DateTime();
			const date3: DateTime = new DateTime();

			expect(date1.isBetweenOrEqual(date2, date3, 'year')).not.to.throw;
		});

		it('different days', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 20
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date3: DateTime = new DateTime({
				year: 2020, month: 10, date: 24
			});

			expect(date1.isBetweenOrEqual(date2, date3)).to.be.false;
			expect(date1.isBetweenOrEqual(date3, date2)).to.be.false;

			expect(date2.isBetweenOrEqual(date1, date3)).to.be.true;
			expect(date2.isBetweenOrEqual(date3, date1)).to.be.true;

			expect(date3.isBetweenOrEqual(date1, date2)).to.be.false;
			expect(date3.isBetweenOrEqual(date2, date1)).to.be.false;
		});

		it('same day', () => {
			const date1: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date2: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			const date3: DateTime = new DateTime({
				year: 2020, month: 10, date: 22
			});

			expect(date1.isBetweenOrEqual(date2, date3)).to.be.true;
			expect(date1.isBetweenOrEqual(date3, date2)).to.be.true;

			expect(date2.isBetweenOrEqual(date1, date3)).to.be.true;
			expect(date2.isBetweenOrEqual(date3, date1)).to.be.true;

			expect(date3.isBetweenOrEqual(date1, date2)).to.be.true;
			expect(date3.isBetweenOrEqual(date2, date1)).to.be.true;
		});
	});

	describe('getYearCalendar()', () => {
		it('ok', () => {
			const today: DateTime = new DateTime();

			const calendar: YearCalendar = today.getYearCalendar();

			expect(calendar).to.be.ok;

			expect(calendar).to.have.property('year', today.year);

			expect(calendar).to.have.property('dates');
			expect(calendar.dates).to.be.instanceOf(Array);
			expect(calendar.dates).to.be.lengthOf(today.daysInYear);

			calendar.dates.forEach((calendarDate: DateTime, i: number) => {
				expect(calendarDate.year).to.be.eql(today.year, 'year');

				const date: DateTime = new DateTime({
					year: today.year,
					month: 1,
					date: i + 1
				});

				expect(calendarDate.month).to.be.eql(date.month, 'month');
				expect(calendarDate.date).to.be.eql(date.date, 'date');

				expect(calendarDate.hours).to.be.eql(0, 'hours');
				expect(calendarDate.minutes).to.be.eql(0, 'minutes');
				expect(calendarDate.seconds).to.be.eql(0, 'seconds');
				expect(calendarDate.ms).to.be.eql(0, 'ms');
			});
		});
	});

	describe('getMonthCalendar()', () => {
		it('ok', () => {
			const today: DateTime = new DateTime();

			const dates: DateTime[] = newArray<DateTime>(12, (i: number): DateTime => {
				return new DateTime({
					year: today.year,
					month: i + 1
				});
			});

			dates.forEach((date: DateTime): void => {
				const calendar: MonthCalendar = date.getMonthCalendar();

				expect(calendar).to.be.ok;

				expect(calendar).to.have.property('year', date.year);
				expect(calendar).to.have.property('month', date.month);

				expect(calendar).to.have.property('dates');
				expect(calendar.dates).to.be.instanceOf(Array);
				expect(calendar.dates).to.be.lengthOf(date.daysInMonth);

				calendar.dates.forEach((calendarDate: DateTime, i: number) => {
					expect(calendarDate.year).to.be.eql(date.year, 'year');
					expect(calendarDate.month).to.be.eql(date.month, 'month');
					expect(calendarDate.date).to.be.eql(i + 1, 'date');

					expect(calendarDate.hours).to.be.eql(0, 'hours');
					expect(calendarDate.minutes).to.be.eql(0, 'minutes');
					expect(calendarDate.seconds).to.be.eql(0, 'seconds');
					expect(calendarDate.ms).to.be.eql(0, 'ms');
				});
			});
		});
	});
});
