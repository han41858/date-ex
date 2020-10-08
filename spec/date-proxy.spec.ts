import { expect } from 'chai';

import { DateEx } from '../src/date-ex';
import { Meridiem } from '../src/constants';
import { newArray } from '../src/util';
import { DateTimeSetParam } from '../src/interfaces';


describe('DateProxy', () => {
	describe('quarter', () => {
		const months : number[] = newArray(12, i => {
			return i + 1; // 1 ~ 12
		});

		it('ok', () => {
			months.forEach(month => {
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

		it('ok', () => {
			months.forEach(month => {
				const date : Date = new Date();
				date.setMonth(month);

				const dateEx : DateEx = new DateEx(date);

				expect(dateEx.toDate().getMonth()).to.be.eql(month); // 0 ~ 11
				expect(dateEx.month).to.be.eql(month + 1); // 1 ~ 12
			});
		});
	});

	describe('weekOfYear', () => {
		const targets : {
			param : DateTimeSetParam,
			week : number
		}[] = [{
			param : { year : 2020, month : 1, date : 1 },
			week : 1
		}, {
			param : { year : 2020, month : 1, date : 4 },
			week : 1
		}, {
			param : { year : 2020, month : 1, date : 5 },
			week : 2
		}, {
			param : { year : 2020, month : 1, date : 11 },
			week : 2
		}, {
			param : { year : 2020, month : 1, date : 18 },
			week : 3
		}, {
			param : { year : 2020, month : 1, date : 31 },
			week : 5
		}, {
			param : { year : 2020, month : 2, date : 1 },
			week : 5
		}, {
			param : { year : 2020, month : 12, date : 31 },
			week : 53
		}, {
			param : { year : 2021, month : 1, date : 1 },
			week : 1
		}];

		it('ok', () => {
			targets.forEach(target => {
				const date : DateEx = new DateEx(target.param);

				expect(date.weekOfYear).to.be.eql(target.week);
			});
		});
	});

	describe('weekOfMonth', () => {
		const targets : {
			param : DateTimeSetParam,
			week : number
		}[] = [{
			param : { year : 2020, month : 1, date : 1 },
			week : 1
		}, {
			param : { year : 2020, month : 1, date : 4 },
			week : 1
		}, {
			param : { year : 2020, month : 1, date : 5 },
			week : 2
		}, {
			param : { year : 2020, month : 1, date : 11 },
			week : 2
		}, {
			param : { year : 2020, month : 1, date : 18 },
			week : 3
		}, {
			param : { year : 2020, month : 1, date : 31 },
			week : 5
		}, {
			param : { year : 2020, month : 2, date : 1 },
			week : 1
		}, {
			param : { year : 2020, month : 12, date : 31 },
			week : 5
		}, {
			param : { year : 2021, month : 1, date : 1 },
			week : 1
		}];

		it('ok', () => {
			targets.forEach(target => {
				const date : DateEx = new DateEx(target.param);

				expect(date.weekOfMonth).to.be.eql(target.week);
			});
		});
	});

	describe('dayOfYear', () => {
		const targets : {
			param : DateTimeSetParam,
			day : number
		}[] = [{
			param : { year : 2020, month : 1, date : 1 },
			day : 1
		}, {
			param : { year : 2020, month : 1, date : 4 },
			day : 4
		}, {
			param : { year : 2020, month : 2, date : 1 },
			day : 32
		}, {
			param : { year : 2020, month : 12, date : 31 },
			day : 366
		}, {
			param : { year : 2021, month : 1, date : 1 },
			day : 1
		}];

		it('ok', () => {
			targets.forEach(target => {
				const date : DateEx = new DateEx(target.param);

				expect(date.dayOfYear).to.be.eql(target.day);
			});
		});
	});

	describe('meridiem', () => {
		const hoursArr : number[] = newArray(24, i => {
			return i; // 0 ~ 23
		});

		it('ok', () => {
			hoursArr.forEach(hours => {
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
