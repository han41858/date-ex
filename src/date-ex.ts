import { DateTimeSetParam } from './interfaces';

export class DateEx {

	// private date : Date;
	// private dateFormat : string;


	constructor(initData? : string | number | Date | DateEx) {
	}

	set(param : DateTimeSetParam) : DateEx {
		return this;
	}

	format(format : string) : string {
		return '';
	}

	toString() : string {
		// return this.format(this.dateFormat || ISO8601Format.DateTimeUTC);
		return '';
	}

}
