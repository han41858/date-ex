import { expect } from 'chai';

import { DateTime } from '../src/date-time';
import { newArray } from '../src/util';
import { DateTimeParam, InitDataFormat } from '../src/interfaces';
import { DatetimeSetParamKeys, DateTimeUnit } from '../src/constants';


describe('DateProxy', () => {
	describe('isValid()', () => {
		it('ok', () => {
			expect(new DateTime().isValid()).to.be.true;
		});

		it('invalid case - with invalid Date', () => {
			const date : Date = new Date(1000000, 1);

			expect(new DateTime(date).isValid()).to.be.false;
		});

		it('invalid case - with invalid years', () => {
			expect(new DateTime({
				year : -20000010
			}).isValid()).to.be.false;
		});

		it('invalid case - with invalid string', () => {
			expect(new DateTime('abc' as unknown).isValid()).to.be.false;
		});
	});

	describe('toDate()', () => {
		it('ok', () => {
			expect(new DateTime().toDate()).to.be.instanceOf(Date);
		});
	});

	describe('+valueOf()', () => {
		it('ok', () => {
			expect(new DateTime().valueOf()).to.be.a('number');
			expect(+new DateTime()).to.be.a('number');
		});
	});

	describe('toISOString()', () => {
		it('ok', () => {
			expect(new DateTime().toISOString()).to.be.a('string');
		});
	});

	describe('toUTCString()', () => {
		it('ok', () => {
			expect(new DateTime().toUTCString()).to.be.a('string');
		});
	});

	describe('getter', () => {
		describe('year', () => {
			it('ok', () => {
				const years : number[] = [2020, 2021, 2020];

				years.forEach(year => {
					expect(new DateTime({
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
					const date : DateTime = new DateTime({
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

					const dateTime : DateTime = new DateTime(date);

					expect(dateTime.toDate().getMonth()).to.be.eql(month); // 0 ~ 11
					expect(dateTime.month).to.be.eql(month + 1); // 1 ~ 12
				});
			});
		});

		describe('weekOfYear', () => {
			const targets : {
				param : DateTimeParam,
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
					const date : DateTime = new DateTime(target.param);

					expect(date.weekOfYear).to.be.eql(target.week);
				});
			});
		});

		describe('weekOfMonth', () => {
			const targets : {
				param : DateTimeParam,
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
					const date : DateTime = new DateTime(target.param);

					expect(date.weekOfMonth).to.be.eql(target.week);
				});
			});
		});

		describe('daysOfYear', () => {
			const targets : {
				param : DateTimeParam,
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
					const date : DateTime = new DateTime(target.param);

					expect(date.dayOfYear).to.be.eql(target.days);
				});
			});
		});

		describe('maxDateOfMonth', () => {
			const targets : {
				param : DateTimeParam,
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
					const date : DateTime = new DateTime(target.param);

					expect(date.lastDateOfMonth).to.be.eql(target.days);
				});
			});
		});

		describe('date', () => {
			it('ok', () => {
				const dates : number[] = newArray<number>(31, i => {
					return i + 1; // 1 ~ 31
				});

				dates.forEach(date => {
					expect(new DateTime({
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
					expect(new DateTime({
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
					expect(new DateTime({
						hours
					}).hours).to.be.eql(hours);
				});
			});

			it('hours24', () => {
				const hoursArr : number[] = newArray<number>(24, i => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach(hours => {
					expect(new DateTime({
						hours
					}).hours24).to.be.eql(hours);
				});
			});

			it('hours12', () => {
				const hoursArr : number[] = newArray<number>(24, i => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach(hours => {
					expect(new DateTime({
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
					expect(new DateTime({
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
					expect(new DateTime({
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
					expect(new DateTime({
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
					const date : DateTime = new DateTime({
						hours
					});

					expect(date.isAm).to.be.eql(hours < 12);
				});
			});
		});
	});

	describe('setter', () => {
		describe('year', () => {
			it('ok', () => {
				const date : DateTime = new DateTime();

				date.year = 3000;

				expect(date.year).to.be.eql(3000);
				expect(date.toDate().getFullYear()).to.be.eql(3000);
			});
		});

		describe('month', () => {
			it('ok', () => {
				const date : DateTime = new DateTime();

				date.month = 5;

				expect(date.month).to.be.eql(5);
				expect(date.toDate().getMonth()).to.be.eql(4);
			});
		});

		describe('date', () => {
			it('ok', () => {
				const date : DateTime = new DateTime();

				date.date = 10;

				expect(date.month).to.be.eql(10);
				expect(date.toDate().getDate()).to.be.eql(10);
			});
		});

		describe('hours', () => {
			it('ok', () => {
				const date : DateTime = new DateTime();

				date.hours = 13;

				expect(date.hours).to.be.eql(13);
				expect(date.toDate().getHours()).to.be.eql(13);
			});
		});

		describe('minutes', () => {
			it('ok', () => {
				const date : DateTime = new DateTime();

				date.minutes = 59;

				expect(date.minutes).to.be.eql(59);
				expect(date.toDate().getMinutes()).to.be.eql(59);
			});
		});

		describe('seconds', () => {
			it('ok', () => {
				const date : DateTime = new DateTime();

				date.seconds = 30;

				expect(date.seconds).to.be.eql(30);
				expect(date.toDate().getSeconds()).to.be.eql(30);
			});
		});

		describe('ms', () => {
			it('ok', () => {
				const date : DateTime = new DateTime();

				date.ms = 133;

				expect(date.ms).to.be.eql(133);
				expect(date.toDate().getMilliseconds()).to.be.eql(133);
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

			const dateTime : DateTime = new DateTime(date);

			const timezoneOffsetInHours : number = dateTime.timezoneOffset / 60;

			DatetimeSetParamKeys.forEach(key => {
				switch (key) {
					case DateTimeUnit.Hours:
						expect(dateTime.hours).to.be.eql(initParam.hours - timezoneOffsetInHours);
						expect(dateTime.hours12).to.be.eql((initParam.hours - timezoneOffsetInHours + 1) % 12 - 1);

						expect(dateTime.UTC.hours).to.be.eql(initParam.hours);
						expect(dateTime.UTC.hours12).to.be.eql((initParam.hours + 1) % 12 - 1);
						break;

					default:
						expect(dateTime[key]).to.be.eql(initParam[key]);
				}
				``;
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

			const dateTime : DateTime = new DateTime(date);

			DatetimeSetParamKeys.forEach(key => {
				switch (key) {
					case DateTimeUnit.Date:
						expect(dateTime.date).to.be.eql(initParam.date + 1);
						expect(dateTime.UTC.date).to.be.eql(initParam.date);

						expect(dateTime.UTC.day).to.be.eql(dateTime.day + 1);
						break;

					// skip hours
					case DateTimeUnit.Hours:
						break;

					default:
						expect(dateTime[key]).to.be.eql(initParam[key]);
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

			const dateTime : DateTime = new DateTime(date);

			DatetimeSetParamKeys.forEach(key => {
				switch (key) {
					case DateTimeUnit.Month:
						expect(dateTime.date).to.be.eql(1);
						expect(dateTime.UTC.date).to.be.eql(initParam.date);

						expect(dateTime.month).to.be.eql(initParam.month + 1);
						expect(dateTime.UTC.month).to.be.eql(initParam.month);
						break;

					// skip of other specs
					case DateTimeUnit.Date:
					case DateTimeUnit.Hours:
						break;

					default:
						expect(dateTime[key]).to.be.eql(initParam[key]);
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

			const dateTime : DateTime = new DateTime(date);

			DatetimeSetParamKeys.forEach(key => {
				switch (key) {
					// skip of other specs
					case DateTimeUnit.Month:
					case DateTimeUnit.Date:
					case DateTimeUnit.Hours:
						break;

					default:
						expect(dateTime[key]).to.be.eql(initParam[key]);
				}
			});

			expect(dateTime.month).to.be.eql(initParam.month + 1);
			expect(dateTime.UTC.month).to.be.eql(initParam.month);

			expect(dateTime.UTC.quarter).to.be.eql(dateTime.quarter - 1);
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

			const dateTime : DateTime = new DateTime(date);

			DatetimeSetParamKeys.forEach(key => {
				switch (key) {
					case DateTimeUnit.Year:
						expect(dateTime.date).to.be.eql(1);
						expect(dateTime.UTC.date).to.be.eql(initParam.date);

						expect(dateTime.month).to.be.eql(1);
						expect(dateTime.UTC.month).to.be.eql(initParam.month);

						expect(dateTime.quarter).to.be.eql(1);
						expect(dateTime.UTC.quarter).to.be.eql(4);

						expect(dateTime.year).to.be.eql(initParam.year + 1);
						expect(dateTime.UTC.year).to.be.eql(initParam.year);
						break;

					// skip of other specs
					case DateTimeUnit.Month:
					case DateTimeUnit.Date:
					case DateTimeUnit.Hours:
						break;

					default:
						expect(dateTime[key]).to.be.eql(initParam[key]);
				}
			});
		});
	});
});
