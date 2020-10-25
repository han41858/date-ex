import { expect } from 'chai';

import { DateEx } from '../src/date-ex';
import { newArray } from '../src/util';
import { DateTimeJson, InitDataFormat } from '../src/interfaces';
import { DateTimeDimension, DatetimeSetParamKeys } from '../src/constants';


describe('DateProxy', () => {
	describe('isValid()', () => {
		it('ok', () => {
			expect(new DateEx().isValid()).to.be.true;
		});

		it('invalid case - with invalid Date', () => {
			const date : Date = new Date(1000000, 1);

			expect(new DateEx(date).isValid()).to.be.false;
		});

		it('invalid case - with invalid years', () => {
			expect(new DateEx({
				year : -20000010
			}).isValid()).to.be.false;
		});

		it('invalid case - with invalid string', () => {
			expect(new DateEx('abc' as unknown).isValid()).to.be.false;
		});
	});

	describe('toDate()', () => {
		it('ok', () => {
			expect(new DateEx().toDate()).to.be.instanceOf(Date);
		});
	});

	describe('+valueOf()', () => {
		it('ok', () => {
			expect(new DateEx().valueOf()).to.be.a('number');
			expect(+new DateEx()).to.be.a('number');
		});
	});

	describe('toISOString()', () => {
		it('ok', () => {
			expect(new DateEx().toISOString()).to.be.a('string');
		});
	});

	describe('toUTCString()', () => {
		it('ok', () => {
			expect(new DateEx().toUTCString()).to.be.a('string');
		});
	});

	describe('quarter', () => {
		const months : number[] = newArray(12, i => {
			return i + 1; // 1 ~ 12
		});

		it('ok', () => {
			months.forEach(month => {
				const date : DateEx = new DateEx({
					month
				});

				switch (month) {
					case 1:
					case 2:
					case 3:
						expect(date.quarter).to.be.eql(1);
						break;

					case 4:
					case 5:
					case 6:
						expect(date.quarter).to.be.eql(2);
						break;

					case 7:
					case 8:
					case 9:
						expect(date.quarter).to.be.eql(3);
						break;

					case 10:
					case 11:
					case 12:
						expect(date.quarter).to.be.eql(4);
						break;

				}
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
			param : DateTimeJson,
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
			param : DateTimeJson,
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
			param : DateTimeJson,
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

	describe('isAm', () => {
		const hoursArr : number[] = newArray(24, i => {
			return i; // 0 ~ 23
		});

		it('ok', () => {
			hoursArr.forEach(hours => {
				const date : DateEx = new DateEx({
					hours
				});

				expect(date.isAm).to.be.eql(hours < 12);
			});
		});
	});

	// tested in Seoul +09:00
	describe('about UTC', () => {
		it('same date', () => {
			const initParam : InitDataFormat = {
				year : 2020, month : 8, date : 4,
				hours : 5, minutes : 3, seconds : 16, ms : 32
			};

			const date : Date = new Date(Date.UTC(
				initParam.year, initParam.month - 1, initParam.date,
				initParam.hours, initParam.minutes, initParam.seconds, initParam.ms
			));

			const dateEx : DateEx = new DateEx(date);

			const timezoneOffsetInHours : number = dateEx.timezoneOffset / 60;

			DatetimeSetParamKeys.forEach(key => {
				switch (key) {
					case DateTimeDimension.Hours:
						expect(dateEx.hours).to.be.eql(initParam.hours - timezoneOffsetInHours);
						expect(dateEx.hours12).to.be.eql((initParam.hours - timezoneOffsetInHours + 1) % 12 - 1);

						expect(dateEx.UTC.hours).to.be.eql(initParam.hours);
						expect(dateEx.UTC.hours12).to.be.eql((initParam.hours + 1) % 12 - 1);
						break;

					default:
						expect(dateEx[key]).to.be.eql(initParam[key]);
				}
			});
		});

		it('different date & day', () => {
			const initParam : InitDataFormat = {
				year : 2020, month : 8, date : 4,
				hours : 17, minutes : 3, seconds : 16, ms : 32
			};

			const date : Date = new Date(Date.UTC(
				initParam.year, initParam.month - 1, initParam.date,
				initParam.hours, initParam.minutes, initParam.seconds, initParam.ms
			));

			const dateEx : DateEx = new DateEx(date);

			DatetimeSetParamKeys.forEach(key => {
				switch (key) {
					case DateTimeDimension.Date:
						expect(dateEx.date).to.be.eql(initParam.date + 1);
						expect(dateEx.UTC.date).to.be.eql(initParam.date);

						expect(dateEx.UTC.day).to.be.eql(dateEx.day + 1);
						break;

					// skip hours
					case DateTimeDimension.Hours:
						break;

					default:
						expect(dateEx[key]).to.be.eql(initParam[key]);
				}
			});
		});

		it('different month', () => {
			const initParam : InitDataFormat = {
				year : 2020, month : 7, date : 31,
				hours : 15, minutes : 3, seconds : 16, ms : 32
			};

			const date : Date = new Date(Date.UTC(
				initParam.year, initParam.month - 1, initParam.date,
				initParam.hours, initParam.minutes, initParam.seconds, initParam.ms
			));

			const dateEx : DateEx = new DateEx(date);

			DatetimeSetParamKeys.forEach(key => {
				switch (key) {
					case DateTimeDimension.Month:
						expect(dateEx.date).to.be.eql(1);
						expect(dateEx.UTC.date).to.be.eql(initParam.date);

						expect(dateEx.month).to.be.eql(initParam.month + 1);
						expect(dateEx.UTC.month).to.be.eql(initParam.month);
						break;

					// skip of other specs
					case DateTimeDimension.Date:
					case DateTimeDimension.Hours:
						break;

					default:
						expect(dateEx[key]).to.be.eql(initParam[key]);
				}
			});
		});

		it('different quarter', () => {
			const initParam : InitDataFormat = {
				year : 2020, month : 6, date : 30,
				hours : 15, minutes : 3, seconds : 16, ms : 32
			};

			const date : Date = new Date(Date.UTC(
				initParam.year, initParam.month - 1, initParam.date,
				initParam.hours, initParam.minutes, initParam.seconds, initParam.ms
			));

			const dateEx : DateEx = new DateEx(date);

			DatetimeSetParamKeys.forEach(key => {
				switch (key) {
					// skip of other specs
					case DateTimeDimension.Month:
					case DateTimeDimension.Date:
					case DateTimeDimension.Hours:
						break;

					default:
						expect(dateEx[key]).to.be.eql(initParam[key]);
				}
			});

			expect(dateEx.month).to.be.eql(initParam.month + 1);
			expect(dateEx.UTC.month).to.be.eql(initParam.month);

			expect(dateEx.UTC.quarter).to.be.eql(dateEx.quarter - 1);
		});

		it('different year', () => {
			const initParam : InitDataFormat = {
				year : 2020, month : 12, date : 31,
				hours : 15, minutes : 3, seconds : 16, ms : 32
			};

			const date : Date = new Date(Date.UTC(
				initParam.year, initParam.month - 1, initParam.date,
				initParam.hours, initParam.minutes, initParam.seconds, initParam.ms
			));

			const dateEx : DateEx = new DateEx(date);

			DatetimeSetParamKeys.forEach(key => {
				switch (key) {
					case DateTimeDimension.Year:
						expect(dateEx.date).to.be.eql(1);
						expect(dateEx.UTC.date).to.be.eql(initParam.date);

						expect(dateEx.month).to.be.eql(1);
						expect(dateEx.UTC.month).to.be.eql(initParam.month);

						expect(dateEx.quarter).to.be.eql(1);
						expect(dateEx.UTC.quarter).to.be.eql(4);

						expect(dateEx.year).to.be.eql(initParam.year + 1);
						expect(dateEx.UTC.year).to.be.eql(initParam.year);
						break;

					// skip of other specs
					case DateTimeDimension.Month:
					case DateTimeDimension.Date:
					case DateTimeDimension.Hours:
						break;

					default:
						expect(dateEx[key]).to.be.eql(initParam[key]);
				}
			});
		});
	});
});
