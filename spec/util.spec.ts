import { expect } from 'chai';

import { getLastDateOfMonth } from '../src/util';


describe('util', () => {
	describe('getLastDateOfMonth()', () => {
		it('ok', () => {
			const targets : {
				year : number,
				month : number,

				expectDays : number
			}[] = [
				{ year : 2020, month : 2, expectDays : 29 },
				{ year : 2020, month : 6, expectDays : 30 },
				{ year : 2020, month : 7, expectDays : 31 },
				{ year : 2020, month : 8, expectDays : 31 },
				{ year : 2020, month : 9, expectDays : 30 },
				{ year : 2020, month : 10, expectDays : 31 },
				{ year : 2021, month : 1, expectDays : 31 }
			];

			targets.forEach(obj => {
				expect(getLastDateOfMonth(obj.year, obj.month)).to.be.eql(obj.expectDays);
			});
		});
	});
});
