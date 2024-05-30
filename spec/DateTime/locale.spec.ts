import { expect } from 'chai';

import { DateTime } from '../../src/date-time';
import { DefaultLocale } from '../../src/constants';
import { loadLocaleFile, padDigit, wait } from '../../src/util';
import { DateTimeParam, LocaleSet } from '../../src/interfaces';


export const localeSpec = (): void => {
	describe('locale()', () => {
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
					while (!DateTime.isLocaleLoaded) {
						await wait(10);
					}

					const date: DateTime = new DateTime();

					// not changed
					expect(date.locale()).to.be.eql(DefaultLocale);
				});

				it('with local setter', async () => {
					const date: DateTime = new DateTime();

					date.locale(invalidLocale);

					// wait for load
					while (!DateTime.isLocaleLoaded) {
						await wait(10);
					}

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
			while (!DateTime.isLocaleLoaded) {
				await wait(10);
			}

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
			while (!DateTime.isLocaleLoaded) {
				await wait(10);
			}

			expect(date1.locale()).to.be.eql(anotherLocale);

			const date2: DateTime = new DateTime();

			expect(date2.locale()).to.be.eql(DefaultLocale);

			// set globally
			DateTime.locale(anotherLocale);

			// wait for load
			while (!DateTime.isLocaleLoaded) {
				await wait(10);
			}

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
			while (!DateTime.isLocaleLoaded) {
				await wait(10);
			}

			const date: DateTime = new DateTime();
			expect(date.locale()).to.be.eql(anotherLocale);
		});

		it('called multiple - local', async () => {
			const date: DateTime = new DateTime();

			date.locale(anotherLocale);
			date.locale(DefaultLocale);
			date.locale(anotherLocale);

			// wait for load
			while (!DateTime.isLocaleLoaded) {
				await wait(10);
			}

			expect(date.locale()).to.be.eql(anotherLocale);
		});

		it('from DateTime', async () => {
			const date1: DateTime = new DateTime();
			date1.locale(anotherLocale);

			// wait for load
			while (!DateTime.isLocaleLoaded) {
				await wait(10);
			}

			const date2: DateTime = new DateTime(date1);

			expect(date2.locale()).to.be.eql(anotherLocale);
		});
	});

	// test with default locale
	describe('locale string', () => {
		let defaultLocaleSet: LocaleSet;

		const initParam: Required<DateTimeParam> = {
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
};
