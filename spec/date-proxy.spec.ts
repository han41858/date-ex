import { expect } from 'chai';

import { DateEx } from '../src/date-ex';
import { Meridiem } from '../src/constants';
import { newArray } from '../src/util';


describe('DateProxy', () => {
	describe('quarter', () => {
		const months : number[] = newArray(12, i => {
			return i + 1; // 1 ~ 12
		});

		months.forEach(month => {
			it('' + month, () => {
				const date : DateEx = new DateEx({
					month
				});

				expect(date.month).to.be.eql(month);
			});
		});
	});

	describe('month', () => {
		const months : number[] = newArray(12, i => {
			return i; // 0 ~ 11
		});

		months.forEach(month => {
			it('' + month, () => {
				const date : Date = new Date();
				date.setMonth(month);

				const dateEx : DateEx = new DateEx(date);

				expect(dateEx.toDate().getMonth()).to.be.eql(month); // 0 ~ 11
				expect(dateEx.month).to.be.eql(month + 1); // 1 ~ 12
			});
		});
	});

	describe('meridiem', () => {
		const hoursArr : number[] = newArray(24, i => {
			return i; // 0 ~ 23
		});

		hoursArr.forEach(hours => {
			it('' + hours, () => {
				const date : DateEx = new DateEx({
					hours
				});

				if (hours < 13) {
					expect(date.meridiem).to.be.eql(Meridiem.Am);
				}
				else {
					expect(date.meridiem).to.be.eql(Meridiem.Pm);
				}
			});
		});
	});
});
