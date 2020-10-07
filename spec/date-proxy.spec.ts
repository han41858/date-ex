import { expect } from 'chai';

import { DateEx } from '../src/date-ex';


describe('DateProxy', () => {
	describe('month', () => {
		const months : number[] = new Array(12)
			.fill(undefined)
			.map((nothing, i) => {
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

	describe('quarter', () => {
		const months : number[] = new Array(12)
			.fill(undefined)
			.map((nothing, i) => {
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
});
