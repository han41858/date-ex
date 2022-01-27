import { expect } from 'chai';

import { DateTime } from '../src/date-time';
import { DateTimeParam, DurationParam } from '../src/interfaces';
import { DateTimeParamKeys, DateTimeUnit, DurationParamKeys, DurationUnit } from '../src/constants';
import { Duration } from '../src/duration';


export const checkDateTime = (date: DateTime, param: DateTimeParam): void => {
	expect(date).to.be.ok;
	expect(date, 'instanceOf DateTime').to.be.instanceOf(DateTime);
	expect(date.valid, 'is valid').to.be.true;

	DateTimeParamKeys.forEach((key: DateTimeUnit): void => {
		// skip if null
		if (param[key] !== null) {
			expect(date[key], 'check value').to.be.eql(param[key]);
		}
	});
};

export const checkDuration = (duration: Duration, param?: DurationParam): void => {
	expect(duration).to.be.ok;
	expect(duration).to.be.instanceOf(Duration);

	// param is optional
	if (param) {
		DurationParamKeys.forEach((key: DurationUnit): void => {
			// skip if null
			if (param[key] !== null) {
				expect(duration[key]).to.be.eql(param[key]);
			}
		});
	}
};
