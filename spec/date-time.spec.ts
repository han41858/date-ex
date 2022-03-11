import { expect } from 'chai';

import { DateTime } from '../src/date-time';
import { Duration } from '../src/duration';

import { DateTimeParamKeys, DateTimeUnit, DurationParamKeys } from '../src/constants';
import { durationUnitToDateTimeKey } from '../src/util';
import { AnyObject, DateTimeParam, DurationParam } from '../src/interfaces';

import { constructorSpec } from './DateTime/constructor.spec';
import { localeSpec } from './DateTime/locale.spec';
import { startOfEndOfSpec } from './DateTime/startOf-endOf.spec';
import { formatSpec } from './DateTime/format.spec';
import { compareSpec } from './DateTime/compare.spec';
import { calendarSpec } from './DateTime/calendar.spec';


describe('DateTime', () => {
	describe('constructor()', constructorSpec);

	describe('toDate()', () => {
		it('is Date', () => {
			expect(new DateTime().toDate()).to.be.instanceOf(Date);
		});
	});

	describe('toJson()', () => {
		it('ok', () => {
			const initParam: DateTimeParam = {
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

	describe('locale', localeSpec);

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
			const initParam: Required<DateTimeParam> = {
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
			const initParam: Required<DateTimeParam> = {
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
			const initParam: Required<DateTimeParam> = {
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
			const initParam: Required<DateTimeParam> = {
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
			const initParam: Required<DateTimeParam> = {
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

	describe('startOf(), endOf()', startOfEndOfSpec);

	describe('format()', formatSpec);

	describe('compare', compareSpec);

	describe('calendar', calendarSpec);
});
