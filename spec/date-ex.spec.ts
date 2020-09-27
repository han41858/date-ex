import { expect } from 'chai';

import { DateEx } from '../src/date-ex';


describe('constructor()', () => {
	it('empty initializer', () => {
		const newDate : DateEx = new DateEx();

		expect(newDate).to.be.ok;

		const now : Date = new Date();

		expect(newDate.year).to.be.eql(now.getFullYear());
		expect(newDate.month).to.be.eql(now.getMonth() + 1);
		expect(newDate.date).to.be.eql(now.getDate());

		expect(newDate.hours).to.be.eql(now.getHours());
		expect(newDate.minutes).to.be.eql(now.getMinutes());
		expect(newDate.seconds).to.be.eql(now.getSeconds());
		expect(newDate.ms).to.be.closeTo(now.getMilliseconds(), 1000);
	});
});

describe('toDate()', () => {
	it('is Date', () => {
		expect(new DateEx().toDate()).to.be.instanceOf(Date);
	});
});
