import { expect } from 'chai';

import { DateTime } from '../../src/date-time';
import { DateTimeUnit } from '../../src/constants';

export const compareSpec = (): void => {
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
};