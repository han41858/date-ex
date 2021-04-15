import { expect } from 'chai';

import { DateTime } from '../src/date-time';
import { DateTimeParam } from '../src/interfaces';
import { DateTimeParamKeys } from '../src/constants';


export const checkDateTime = (date : DateTime, param : DateTimeParam) : void => {
	expect(date).to.be.ok;
	expect(date).to.be.instanceOf(DateTime);
	expect(date.valid).to.be.true;

	DateTimeParamKeys.forEach(key => {
		if (param[key] !== undefined) {
			expect(date[key]).to.be.eql(param[key]);
		}
	});
};
