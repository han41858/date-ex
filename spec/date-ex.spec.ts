import { expect } from 'chai';

import { DateEx } from '../src/date-ex';


describe('constructor()', () => {
	it('empty initializer', () => {
		expect(new DateEx()).to.be.ok;
	});
});
