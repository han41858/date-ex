import { expect } from 'chai';

import { DateTime } from '../src/date-time';
import { newArray } from '../src/util';
import { DateTimeParam } from '../src/interfaces';


describe('DateProxy', () => {
	describe('valid', () => {
		it('ok', () => {
			expect(new DateTime().valid).to.be.true;
		});

		it('invalid case - with invalid Date', () => {
			const date: Date = new Date(1000000, 1);

			expect(new DateTime(date).valid).to.be.false;
		});

		it('invalid case - with invalid years', () => {
			expect(new DateTime({
				year: -20000010
			}).valid).to.be.false;
		});

		it('invalid case - with invalid string', () => {
			expect(new DateTime('abc').valid).to.be.false;
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
				const years: number[] = [2020, 2021, 2020];

				years.forEach((year: number): void => {
					expect(new DateTime({
						year
					}).year).to.be.eql(year);
				});
			});
		});

		describe('quarter', () => {
			const months: number[] = newArray(12, (i: number): number => {
				return i + 1; // 1 ~ 12
			});

			it('ok', () => {
				months.forEach((month: number): void => {
					const date: DateTime = new DateTime({
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
			const months: number[] = newArray(12, (i: number): number => {
				return i; // 0 ~ 11
			});

			it('ok', () => {
				const now: Date = new Date();

				months.forEach((month: number): void => {
					const date: Date = new Date(now.getFullYear(), month, 1);

					const dateTime: DateTime = new DateTime(date);

					expect(dateTime.toDate().getMonth()).to.be.eql(month); // 0 ~ 11
					expect(dateTime.month).to.be.eql(month + 1); // 1 ~ 12
				});
			});
		});

		describe('weekOfYear', () => {
			interface Target {
				param: DateTimeParam;
				week: number;
			}

			const targets: Target[] = [{
				param: { year: 2020, month: 1, date: 1 },
				week: 1
			}, {
				param: { year: 2020, month: 1, date: 4 },
				week: 1
			}, {
				param: { year: 2020, month: 1, date: 5 },
				week: 2
			}, {
				param: { year: 2020, month: 1, date: 11 },
				week: 2
			}, {
				param: { year: 2020, month: 1, date: 18 },
				week: 3
			}, {
				param: { year: 2020, month: 1, date: 31 },
				week: 5
			}, {
				param: { year: 2020, month: 2, date: 1 },
				week: 5
			}, {
				param: { year: 2020, month: 12, date: 31 },
				week: 53
			}, {
				param: { year: 2021, month: 1, date: 1 },
				week: 1
			}, {
				param: { year: 2021, month: 1, date: 3 },
				week: 2
			}];

			it('ok', () => {
				targets.forEach((target: Target): void => {
					const date: DateTime = new DateTime(target.param);

					expect(date.weekOfYear).to.be.eql(target.week);
				});
			});
		});

		describe('weekOfMonth', () => {
			interface Target {
				param: DateTimeParam;
				week: number;
			}

			const targets: Target[] = [{
				param: { year: 2020, month: 1, date: 1 },
				week: 1
			}, {
				param: { year: 2020, month: 1, date: 4 },
				week: 1
			}, {
				param: { year: 2020, month: 1, date: 5 },
				week: 2
			}, {
				param: { year: 2020, month: 1, date: 11 },
				week: 2
			}, {
				param: { year: 2020, month: 1, date: 18 },
				week: 3
			}, {
				param: { year: 2020, month: 1, date: 31 },
				week: 5
			}, {
				param: { year: 2020, month: 2, date: 1 },
				week: 1
			}, {
				param: { year: 2020, month: 12, date: 31 },
				week: 5
			}, {
				param: { year: 2021, month: 1, date: 1 },
				week: 1
			}];

			it('ok', () => {
				targets.forEach((target: Target): void => {
					const date: DateTime = new DateTime(target.param);

					expect(date.weekOfMonth).to.be.eql(target.week);
				});
			});
		});

		describe('weeksInYear', () => {
			interface Target {
				year: number;
				weeks: number;
			}

			const targets: Target[] = [
				{ year: 2016, weeks: 53 },
				{ year: 2017, weeks: 53 },
				{ year: 2018, weeks: 53 },
				{ year: 2019, weeks: 53 },
				{ year: 2020, weeks: 53 }
			];

			it('ok', () => {
				targets.forEach((target: Target): void => {
					const date: DateTime = new DateTime({
						year: target.year
					});

					expect(date.weeksInYear).to.be.eql(target.weeks);
				});
			});
		});

		describe('weeksInMonth', () => {
			interface Target {
				param: DateTimeParam;
				weeks: number;
			}

			const targets: Target[] = [
				{ param: { year: 2015, month: 2 }, weeks: 4 },

				{ param: { year: 2020, month: 1 }, weeks: 5 },
				{ param: { year: 2020, month: 2 }, weeks: 5 },
				{ param: { year: 2020, month: 3 }, weeks: 5 },
				{ param: { year: 2020, month: 4 }, weeks: 5 },
				{ param: { year: 2020, month: 5 }, weeks: 6 },
				{ param: { year: 2020, month: 6 }, weeks: 5 },
				{ param: { year: 2020, month: 7 }, weeks: 5 },
				{ param: { year: 2020, month: 8 }, weeks: 6 },
				{ param: { year: 2020, month: 9 }, weeks: 5 },
				{ param: { year: 2020, month: 10 }, weeks: 5 },
				{ param: { year: 2020, month: 11 }, weeks: 5 },
				{ param: { year: 2020, month: 12 }, weeks: 5 }
			];

			it('ok', () => {
				targets.forEach((target: Target): void => {
					const date: DateTime = new DateTime(target.param);

					expect(date.weeksInMonth).to.be.eql(target.weeks);
				});
			});
		});

		describe('dayOfYear', () => {
			interface Target {
				param: DateTimeParam;
				days: number;
			}

			const targets: Target[] = [{
				param: { year: 2020, month: 1, date: 1 },
				days: 1
			}, {
				param: { year: 2020, month: 1, date: 4 },
				days: 4
			}, {
				param: { year: 2020, month: 2, date: 1 },
				days: 32
			}, {
				param: { year: 2020, month: 12, date: 31 },
				days: 366
			}, {
				param: { year: 2021, month: 1, date: 1 },
				days: 1
			}];

			it('ok', () => {
				targets.forEach((target: Target): void => {
					const date: DateTime = new DateTime(target.param);

					expect(date.dayOfYear).to.be.eql(target.days);
				});
			});
		});

		describe('daysInYear', () => {
			interface Target {
				year: number;
				days: number;
			}

			const targets: Target[] = [
				{ year: 2016, days: 366 },
				{ year: 2017, days: 365 },
				{ year: 2018, days: 365 },
				{ year: 2019, days: 365 },
				{ year: 2020, days: 366 }
			];

			it('ok', () => {
				targets.forEach((target: Target): void => {
					const date: DateTime = new DateTime({
						year: target.year
					});

					expect(date.daysInYear).to.be.eql(target.days);
				});
			});
		});

		describe('date', () => {
			it('ok', () => {
				const dates: number[] = newArray<number>(31, (i: number): number => {
					return i + 1; // 1 ~ 31
				});

				dates.forEach((date: number): void => {
					expect(new DateTime({
						year: 2020,
						month: 1,
						date
					}).date).to.be.eql(date);
				});
			});
		});

		describe.only('lastDate', () => {
			it('ok', () => {
				const year: number = 2022;

				newArray<number>(12, (i: number): number => i + 1)
					.forEach((month: number): void => {
						const date: DateTime = new DateTime({
							year,
							month
						});

						switch (month) {
							case 1:
							case 3:
							case 5:
							case 7:
							case 8:
							case 10:
							case 12:
								expect(date.lastDate).to.be.eql(31);
								break;

							case 2:
								expect(date.lastDate).to.be.eql(28);
								break;

							case 4:
							case 6:
							case 9:
							case 11:
								expect(date.lastDate).to.be.eql(30);
								break;
						}
					});
			});
		});

		describe('day', () => {
			it('ok', () => {
				const days: number[] = newArray<number>(7, (i: number): number => {
					return i + 5; // 5 ~ 11
				});

				days.forEach((day: number, i: number): void => {
					expect(new DateTime({
						year: 2020,
						month: 1,
						date: day
					}).day).to.be.eql(i);
				});
			});
		});

		describe('timezoneOffset', () => {
			it('ok', () => {
				const date: DateTime = new DateTime();

				expect(date.timezoneOffset).to.be.a('number');
			});
		});

		describe('timezoneOffsetInHours', () => {
			it('ok', () => {
				const date: DateTime = new DateTime();
				const timezoneOffset: number = date.timezoneOffset;

				expect(date.timezoneOffsetInHours).to.be.a('number');
				expect(date.timezoneOffsetInHours).to.be.eql(-timezoneOffset / 60);

				// WARN: in seoul
				expect(date.timezoneOffsetInHours).to.be.eql(9);
			});
		});

		describe('hours', () => {
			it('hours', () => {
				const hoursArr: number[] = newArray<number>(24, (i: number): number => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach((hours: number): void => {
					expect(new DateTime({
						hours
					}).hours).to.be.eql(hours);
				});
			});

			it('hours24', () => {
				const hoursArr: number[] = newArray<number>(24, (i: number): number => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach((hours: number): void => {
					expect(new DateTime({
						hours
					}).hours24).to.be.eql(hours);
				});
			});

			it('hours12', () => {
				const hoursArr: number[] = newArray<number>(24, (i: number): number => {
					return i; // 0 ~ 23
				});

				hoursArr.forEach((hours: number): void => {
					expect(new DateTime({
						hours
					}).hours12).to.be.eql(hours > 12 ? hours % 12 : hours);
				});
			});
		});

		describe('minutes', () => {
			it('ok', () => {
				const minutesArr: number[] = newArray<number>(60, (i: number): number => {
					return i; // 0 ~ 59
				});

				minutesArr.forEach((minutes: number): void => {
					expect(new DateTime({
						minutes
					}).minutes).to.be.eql(minutes);
				});
			});
		});

		describe('seconds', () => {
			it('ok', () => {
				const secondsArr: number[] = newArray<number>(60, (i: number): number => {
					return i; // 0 ~ 59
				});

				secondsArr.forEach((seconds: number): void => {
					expect(new DateTime({
						seconds
					}).seconds).to.be.eql(seconds);
				});
			});
		});

		describe('ms', () => {
			it('ok', () => {
				const msArr: number[] = newArray<number>(1000, (i: number): number => {
					return i; // 0 ~ 999
				});

				msArr.forEach((ms: number): void => {
					expect(new DateTime({
						ms
					}).ms).to.be.eql(ms);
				});
			});
		});

		describe('isAm', () => {
			const hoursArr: number[] = newArray(24, (i: number): number => {
				return i; // 0 ~ 23
			});

			it('ok', () => {
				hoursArr.forEach((hours: number): void => {
					const date: DateTime = new DateTime({
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
				const date: DateTime = new DateTime();

				date.year = 3000;

				expect(date.year).to.be.eql(3000);
				expect(date.toDate().getFullYear()).to.be.eql(3000);
			});
		});

		describe('month', () => {
			it('ok', () => {
				const date: DateTime = new DateTime();

				date.month = 5;

				expect(date.month).to.be.eql(5);
				expect(date.toDate().getMonth()).to.be.eql(4);
			});
		});

		describe('date', () => {
			it('ok', () => {
				const date: DateTime = new DateTime();

				date.date = 10;

				expect(date.date).to.be.eql(10);
				expect(date.toDate().getDate()).to.be.eql(10);
			});
		});

		describe('hours', () => {
			it('ok', () => {
				const date: DateTime = new DateTime();

				date.hours = 13;

				expect(date.hours).to.be.eql(13);
				expect(date.toDate().getHours()).to.be.eql(13);
			});
		});

		describe('minutes', () => {
			it('ok', () => {
				const date: DateTime = new DateTime();

				date.minutes = 59;

				expect(date.minutes).to.be.eql(59);
				expect(date.toDate().getMinutes()).to.be.eql(59);
			});
		});

		describe('seconds', () => {
			it('ok', () => {
				const date: DateTime = new DateTime();

				date.seconds = 30;

				expect(date.seconds).to.be.eql(30);
				expect(date.toDate().getSeconds()).to.be.eql(30);
			});
		});

		describe('ms', () => {
			it('ok', () => {
				const date: DateTime = new DateTime();

				date.ms = 133;

				expect(date.ms).to.be.eql(133);
				expect(date.toDate().getMilliseconds()).to.be.eql(133);
			});
		});
	});
});
