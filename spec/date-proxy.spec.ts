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

	describe.only('getter', () => {
		describe('year', () => {
			it('ok', () => {
				const years : number[] = [2020, 2021, 2020];

				years.forEach(year => {
					expect(new DateEx({
						year
					}).year).to.be.eql(year);
				});
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

		describe('daysOfYear', () => {
			const targets : {
				param : DateTimeJson,
				days : number
			}[] = [{
				param : { year : 2020, month : 1, date : 1 },
				days : 1
			}, {
				param : { year : 2020, month : 1, date : 4 },
				days : 4
			}, {
				param : { year : 2020, month : 2, date : 1 },
				days : 32
			}, {
				param : { year : 2020, month : 12, date : 31 },
				days : 366
			}, {
				param : { year : 2021, month : 1, date : 1 },
				days : 1
			}];

			it('ok', () => {
				targets.forEach(target => {
					const date : DateEx = new DateEx(target.param);

					expect(date.dayOfYear).to.be.eql(target.days);
				});
			});
		});

		describe('maxDateOfMonth', () => {
			const targets : {
				param : DateTimeJson,
				days : number
			}[] = [{
				param : { year : 2020, month : 1 },
				days : 31
			}, {
				param : { year : 2020, month : 2 },
				days : 29
			}, {
				param : { year : 2020, month : 3 },
				days : 31
			}, {
				param : { year : 2020, month : 12 },
				days : 31
			}, {
				param : { year : 2021, month : 1 },
				days : 31
			}];

			it('ok', () => {
				targets.forEach(target => {
					const date : DateEx = new DateEx(target.param);

					expect(date.maxDateOfMonth).to.be.eql(target.days);
				});
			});
		});

		describe('date', () => {
			it('ok', () => {
				const dates : number[] = newArray<number>(31, i => {
					return i + 1; // 1 ~ 31
				});

				dates.forEach(date => {
					expect(new DateEx({
						year : 2020,
						month : 1,
						date
					}).date).to.be.eql(date);
				});
			});
		});

		describe('day', () => {
			it('ok', () => {
				const days : number[] = newArray<number>(7, i => {
					return i + 5; // 5 ~ 11
				});

				days.forEach((day, i) => {
					expect(new DateEx({
						year : 2020,
						month : 1,
						date : day
					}).day).to.be.eql(i);
				});
			});
		});

		describe('hours', () => {
			it('hours', () => {
				const hoursArr : number[] = newArray<number>(24, i => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach(hours => {
					expect(new DateEx({
						hours
					}).hours).to.be.eql(hours);
				});
			});

			it('hours24', () => {
				const hoursArr : number[] = newArray<number>(24, i => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach(hours => {
					expect(new DateEx({
						hours
					}).hours24).to.be.eql(hours);
				});
			});

			it('hours12', () => {
				const hoursArr : number[] = newArray<number>(24, i => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach(hours => {
					expect(new DateEx({
						hours
					}).hours12).to.be.eql(hours > 12 ? hours % 12 : hours);
				});
			});
		});

		describe('minutes', () => {
			it('ok', () => {
				const minutesArr : number[] = newArray<number>(60, i => {
					return i; // 0 ~ 59
				});

				minutesArr.forEach(minutes => {
					expect(new DateEx({
						minutes
					}).minutes).to.be.eql(minutes);
				});
			});
		});

		describe('seconds', () => {
			it('ok', () => {
				const secondsArr : number[] = newArray<number>(60, i => {
					return i; // 0 ~ 59
				});

				secondsArr.forEach(seconds => {
					expect(new DateEx({
						seconds
					}).seconds).to.be.eql(seconds);
				});
			});
		});

		describe('ms', () => {
			it('ok', () => {
				const msArr : number[] = newArray<number>(1000, i => {
					return i; // 0 ~ 999
				});

				msArr.forEach(ms => {
					expect(new DateEx({
						ms
					}).ms).to.be.eql(ms);
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
