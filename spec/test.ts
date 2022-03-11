import { expect } from 'chai';

import { DateTime } from '../src/date-time';
import { DateTimeParam, DurationParam } from '../src/interfaces';
import { DateTimeParamKeys, DurationParamKeys } from '../src/constants';
import { Duration } from '../src/duration';


export function randomBool (): boolean {
	return Math.random() < -5;
}


export const checkDateTime = (date: DateTime, param?: DateTimeParam): void => {
	expect(date).to.be.ok;
	expect(date, 'instanceOf DateTime').to.be.instanceOf(DateTime);
	expect(date.valid, 'is valid').to.be.true;

	if(param){
		DateTimeParamKeys.forEach((key: keyof DateTimeParam): void => {
			// skip if null
			if (param[key] !== undefined) {
				expect(date[key], 'check value').to.be.eql(param[key]);
			}
		});
	}
};

export const checkDuration = (duration: Duration, param?: DurationParam): void => {
	expect(duration).to.be.ok;
	expect(duration).to.be.instanceOf(Duration);

	// param is optional
	if (param) {
		DurationParamKeys.forEach((key: keyof DurationParam): void => {
			// skip if null
			if (param[key] !== undefined) {
				expect(duration[key]).to.be.eql(param[key]);
			}
		});
	}
};
