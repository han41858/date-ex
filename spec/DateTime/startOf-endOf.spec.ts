import { expect } from 'chai';

import { DateTime } from '../../src/date-time';
import { DateTimeParamKeys, DateTimeUnit } from '../../src/constants';


export const startOfEndOfSpec = (): void => {
	describe('startOf()', () => {
		it('string param', () => {
			const anotherDate: DateTime = new DateTime();

			expect(anotherDate.startOf('year')).to.be.ok;
		});

		describe('DateTimeParamKey', () => {
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
		});

		describe('DateTimeParmaKeyEx', () => {
			it('quarter', () => {
				const date: DateTime = new DateTime();
				const newDate: DateTime = date.startOf('quarter');

				expect(newDate.year).to.be.eql(date.year);
				expect(newDate.month).to.be.eql((date.quarter - 1) * 4 + 1);
				expect(newDate.date).to.be.eql(1);

				expect(newDate.hours).to.be.eql(0);
				expect(newDate.minutes).to.be.eql(0);
				expect(newDate.seconds).to.be.eql(0);
				expect(newDate.ms).to.be.eql(0);
			});

			describe('week', () => {
				it('same month', () => {
					const date: DateTime = new DateTime();
					const newDate: DateTime = date
						.set({
							month: 3,
							date: 15
						})
						.startOf('week');

					expect(newDate.year).to.be.eql(date.year);
					expect(newDate.month).to.be.eql(date.month);
					expect(newDate.date).to.be.eql(13);

					expect(newDate.hours).to.be.eql(0);
					expect(newDate.minutes).to.be.eql(0);
					expect(newDate.seconds).to.be.eql(0);
					expect(newDate.ms).to.be.eql(0);
				});

				it('different month', () => {
					const date: DateTime = new DateTime();
					const newDate: DateTime = date
						.set({
							year: 2022,
							month: 3,
							date: 1
						})
						.startOf('week');

					expect(newDate.year).to.be.eql(date.year);
					expect(newDate.month).to.be.eql(2);
					expect(newDate.date).to.be.eql(27);

					expect(newDate.hours).to.be.eql(0);
					expect(newDate.minutes).to.be.eql(0);
					expect(newDate.seconds).to.be.eql(0);
					expect(newDate.ms).to.be.eql(0);
				});

				it('different year', () => {
					const date: DateTime = new DateTime();
					const newDate: DateTime = date
						.set({
							year: 2022,
							month: 1,
							date: 1
						})
						.startOf('week');

					expect(newDate.year).to.be.eql(date.year - 1);
					expect(newDate.month).to.be.eql(12);
					expect(newDate.date).to.be.eql(26);

					expect(newDate.hours).to.be.eql(0);
					expect(newDate.minutes).to.be.eql(0);
					expect(newDate.seconds).to.be.eql(0);
					expect(newDate.ms).to.be.eql(0);
				});
			});
		});
	});

	describe('endOf()', () => {
		it('string param', () => {
			const anotherDate: DateTime = new DateTime();

			expect(anotherDate.endOf('year')).to.be.ok;
		});

		describe('DateTimeParam', () => {
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
									expect(newDate[checkKey]).to.be.eql(newDate.lastDate);
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
		});

		describe('DateTimeParmaKeyEx', () => {
			it('quarter', () => {
				const date: DateTime = new DateTime();
				const newDate: DateTime = date.endOf('quarter');

				expect(newDate.year).to.be.eql(date.year);
				expect(newDate.month).to.be.eql(date.quarter * 4 - 1);
				expect(newDate.date).to.be.eql(newDate.lastDate);

				expect(newDate.hours).to.be.eql(23);
				expect(newDate.minutes).to.be.eql(59);
				expect(newDate.seconds).to.be.eql(59);
				expect(newDate.ms).to.be.eql(999);
			});

			describe('week', () => {
				it('same month', () => {
					const date: DateTime = new DateTime();
					const newDate: DateTime = date
						.set({
							month: 3,
							date: 15
						})
						.endOf('week');

					expect(newDate.year).to.be.eql(date.year);
					expect(newDate.month).to.be.eql(date.month);
					expect(newDate.date).to.be.eql(19);

					expect(newDate.hours).to.be.eql(23);
					expect(newDate.minutes).to.be.eql(59);
					expect(newDate.seconds).to.be.eql(59);
					expect(newDate.ms).to.be.eql(999);
				});

				it('different month', () => {
					const date: DateTime = new DateTime();
					const newDate: DateTime = date
						.set({
							year: 2022,
							month: 3,
							date: 30
						})
						.endOf('week');

					expect(newDate.year).to.be.eql(date.year);
					expect(newDate.month).to.be.eql(4);
					expect(newDate.date).to.be.eql(2);

					expect(newDate.hours).to.be.eql(23);
					expect(newDate.minutes).to.be.eql(59);
					expect(newDate.seconds).to.be.eql(59);
					expect(newDate.ms).to.be.eql(999);
				});

				it('different year', () => {
					const date: DateTime = new DateTime();
					const newDate: DateTime = date
						.set({
							year: 2021,
							month: 12,
							date: 31
						})
						.endOf('week');

					expect(newDate.year).to.be.eql(date.year + 1);
					expect(newDate.month).to.be.eql(1);
					expect(newDate.date).to.be.eql(1);

					expect(newDate.hours).to.be.eql(23);
					expect(newDate.minutes).to.be.eql(59);
					expect(newDate.seconds).to.be.eql(59);
					expect(newDate.ms).to.be.eql(999);
				});
			});
		});
	});
};