import { expect } from 'chai';

import { DateEx } from '../src/date-ex';
import { padDigit } from '../src/util';


describe('constructor()', () => {
	it('empty initializer', () => {
		const MilliSecondsCloseTo : number = 10;

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


					expect(() => new DateEx(dateStr)).to.throw();
				});
			});

			// TODO:
			// --MM-DD
			// --MMDD[1]
		});

		xdescribe('by time string', () => {
			describe('no timezone', () => {
				// TODO:
				// hh:mm:ss.sss
				// Thhmmss.sss
				// hh:mm:ss
				// Thhmmss
				// hh:mm
				// Thhmm
				// Thh
			});

			describe('with timezone', () => {
				// TODO:
				// <time>Z
				// <time>±hh:mm
				// <time>±hhmm
				// <time>±hh

				it('YYYY-MM-DDTHH:mm:ssZ', () => {
					const now : Date = new Date();

					const newDate : Date = new Date(now);

					const dateStr : string = [
						newDate.getFullYear(),
						padDigit(newDate.getMonth() + 1, 2),
						padDigit(newDate.getDate(), 2)
					].join('-');

					const timeStr : string = [
						padDigit(newDate.getHours(), 2),
						padDigit(newDate.getMinutes(), 2),
						padDigit(newDate.getSeconds(), 2)
					].join(':');

					const newDateEx : DateEx = new DateEx(`${ dateStr }T${ timeStr }Z`);

					expect(newDateEx).to.be.ok;

					expect(newDateEx.year).to.be.eql(newDate.getFullYear());
					expect(newDateEx.month).to.be.eql(newDate.getMonth() + 1);
					expect(newDateEx.date).to.be.eql(newDate.getDate());

					expect(newDateEx.hours).to.be.eql(newDate.getHours());
					expect(newDateEx.minutes).to.be.eql(newDate.getMinutes());
					expect(newDateEx.seconds).to.be.eql(newDate.getSeconds());
					expect(newDateEx.ms).to.be.eql(newDate.getMilliseconds());
				});

				it('YYYY-MM-DDTHH:mm:ss.SSSZ', () => {
					const now : Date = new Date();

					const newDate : Date = new Date(now);

					const dateStr : string = [
						newDate.getFullYear(),
						padDigit(newDate.getMonth() + 1, 2),
						padDigit(newDate.getDate(), 2)
					].join('-');

					const timeStr : string = [
						padDigit(newDate.getHours(), 2),
						padDigit(newDate.getMinutes(), 2),
						padDigit(newDate.getSeconds(), 2)
					].join(':') + `.${ padDigit(newDate.getMilliseconds(), 3) }`;

					const newDateEx : DateEx = new DateEx(`${ dateStr }T${ timeStr }Z`);

					expect(newDateEx).to.be.ok;

					expect(newDateEx.year).to.be.eql(newDate.getFullYear());
					expect(newDateEx.month).to.be.eql(newDate.getMonth() + 1);
					expect(newDateEx.date).to.be.eql(newDate.getDate());

					expect(newDateEx.hours).to.be.eql(newDate.getHours());
					expect(newDateEx.minutes).to.be.eql(newDate.getMinutes());
					expect(newDateEx.seconds).to.be.eql(newDate.getSeconds());
					expect(newDateEx.ms).to.be.eql(newDate.getMilliseconds());
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
});

describe('toDate()', () => {
	it('is Date', () => {
		expect(new DateEx().toDate()).to.be.instanceOf(Date);
	});
});
