import { expect } from 'chai';

import { Duration } from '../src/duration';
import { DurationParamKeys, DurationUnit, Gregorian1Month, Gregorian1Year } from '../src/constants';
import { DurationParam } from '../src/interfaces';
import { DateTime } from '../src/date-time';
import { checkDateTime, checkDuration } from './test';


describe('Duration', () => {
	describe('constructor', () => {
		it('no init data', () => {
			const duration: Duration = new Duration();

			checkDuration(duration);
		});

		describe('by string', () => {
			describe('PnYnMnDTnHnMnS', () => {
				describe('all', () => {
					it('all', () => {
						const duration: Duration = new Duration('P1Y2M3DT4H5M6S');

						checkDuration(duration, {
							years: 1,
							months: 2,
							dates: 3,

							hours: 4,
							minutes: 5,
							seconds: 6
						});
					});

					it('dates', () => {
						const duration: Duration = new Duration('P1Y2M3D');

						checkDuration(duration, {
							years: 1,
							months: 2,
							dates: 3
						});
					});

					it('hours', () => {
						const duration: Duration = new Duration('PT4H5M6S');

						checkDuration(duration, {
							hours: 4,
							minutes: 5,
							seconds: 6
						});
					});
				});

				describe(DurationUnit.Years, () => {
					it('ok', () => {
						const duration: Duration = new Duration('P2Y');

						checkDuration(duration, {
							years: 2
						});
					});
				});

				describe(DurationUnit.Months, () => {
					it('ok', () => {
						const duration: Duration = new Duration('P2M');

						checkDuration(duration, {
							months: 2
						});
					});

					it('round up', () => {
						const duration: Duration = new Duration('P14M');

						checkDuration(duration, {
							years: 1,
							months: 2
						});
					});
				});

				describe(DurationUnit.Dates, () => {
					it('ok', () => {
						const duration: Duration = new Duration('P2D');

						checkDuration(duration, {
							dates: 2
						});
					});

					it('round up', () => {
						const duration: Duration = new Duration('P40D');

						checkDuration(duration, {
							months: 1,
							dates: 40 - Gregorian1Month
						});
					});
				});

				describe(DurationUnit.Hours, () => {
					it('ok', () => {
						const duration: Duration = new Duration('PT2H');

						checkDuration(duration, {
							hours: 2
						});
					});

					it('round up', () => {
						const duration: Duration = new Duration('PT26H');

						checkDuration(duration, {
							dates: 1,

							hours: 2
						});
					});
				});

				describe(DurationUnit.Minutes, () => {
					it('ok', () => {
						const duration: Duration = new Duration('PT2M');

						checkDuration(duration, {
							minutes: 2
						});
					});

					it('round up', () => {
						const duration: Duration = new Duration('PT66M');

						checkDuration(duration, {
							hours: 1,
							minutes: 6
						});
					});
				});

				describe(DurationUnit.Seconds, () => {
					it('ok', () => {
						const duration: Duration = new Duration('PT2S');

						checkDuration(duration, {
							seconds: 2
						});
					});

					it('round up', () => {
						const duration: Duration = new Duration('PT68S');

						checkDuration(duration, {
							minutes: 1,
							seconds: 8
						});
					});
				});
			});

			describe('PnW', () => {
				it('ok', () => {
					const duration: Duration = new Duration('P2W');

					checkDuration(duration, {
						dates: 14
					});
				});

				it('round up', () => {
					const week: number = 8; // 56 days

					const duration: Duration = new Duration(`P${ week }W`);

					checkDuration(duration, {
						months: 1,
						dates: week * 7 - Gregorian1Month
					});
				});

				it('round up more', () => {
					const week: number = 53;

					const duration: Duration = new Duration(`P${ week }W`);

					checkDuration(duration, {
						years: 1,

						dates: undefined // skip
					});

					expect(duration.dates).to.be.closeTo(53 * 7 - Gregorian1Year, 1);
				});
			});
		});

		describe('by Duration', () => {
			it('ok', () => {
				DurationParamKeys.forEach((key: keyof DurationParam): void => {
					const refDuration: Duration = new Duration({
						[key]: 1
					});

					const newDuration: Duration = new Duration(refDuration);

					DurationParamKeys.forEach((checkKey: keyof DurationParam): void => {
						expect(newDuration[checkKey]).to.be.eql(refDuration[checkKey]);
					});
				});
			});
		});

		describe('by DurationParam', () => {
			describe(DurationUnit.Years, () => {
				it('ok', () => {
					const duration: Duration = new Duration({
						years: 100
					});

					checkDuration(duration, {
						years: 100
					});
				});

				it('< 0', () => {
					expect(() => new Duration({
						years: -1
					})).to.throws;
				});
			});

			// TODO: Quarters

			describe(DurationUnit.Months, () => {
				it('> 0', () => {
					const duration: Duration = new Duration({
						months: 7
					});

					checkDuration(duration, {
						months: 7
					});
				});

				it('< 0', () => {
					expect(() => new Duration({
						months: -3
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration: Duration = new Duration({
						months: 38
					});

					checkDuration(duration, {
						years: 3,
						months: 2
					});
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						months: -25
					})).to.throws;
				});

				it('fall', () => {
					const duration: Duration = new Duration({
						years: 1,
						months: -1
					});

					checkDuration(duration, {
						months: 11
					});
				});

				it('not fall', () => {
					const duration: Duration = new Duration({
						years: 1,
						months: 1
					});

					checkDuration(duration, {
						years: 1,
						months: 1
					});
				});
			});

			// TODO: Weeks

			describe(DurationUnit.Dates, () => {
				it('> 0', () => {
					const duration: Duration = new Duration({
						dates: 13
					});

					checkDuration(duration, {
						dates: 13
					});
				});

				it('< 0', () => {
					expect(() => new Duration({
						dates: -13
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration: Duration = new Duration({
						dates: 38
					});

					checkDuration(duration, {
						months: 1,
						dates: 38 - Gregorian1Month
					});
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						dates: -36
					})).to.throws;
				});

				it('fall', () => {
					const duration: Duration = new Duration({
						months: 1,
						dates: -1
					});

					checkDuration(duration, {
						dates: Gregorian1Month - 1
					});
				});

				it('not fall', () => {
					const duration: Duration = new Duration({
						months: 1,
						dates: 1
					});

					checkDuration(duration, {
						months: 1,
						dates: 1
					});
				});
			});

			describe(DurationUnit.Hours, () => {
				it('> 0', () => {
					const duration: Duration = new Duration({
						hours: 13
					});

					checkDuration(duration, {
						hours: 13
					});
				});

				it('< 0', () => {
					expect(() => new Duration({
						hours: -13
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration: Duration = new Duration({
						hours: 27
					});

					checkDuration(duration, {
						dates: 1,

						hours: 3
					});
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						hours: -28
					})).to.throws;
				});

				it('fall', () => {
					const duration: Duration = new Duration({
						dates: 2,
						hours: -1
					});

					checkDuration(duration, {
						dates: 1,

						hours: 23
					});
				});

				it('not fall', () => {
					const duration: Duration = new Duration({
						dates: 1,
						hours: 1
					});

					checkDuration(duration, {
						dates: 1,

						hours: 1
					});
				});
			});

			describe(DurationUnit.Minutes, () => {
				it('> 0', () => {
					const duration: Duration = new Duration({
						minutes: 40
					});

					checkDuration(duration, {
						minutes: 40
					});
				});

				it('< 0', () => {
					expect(() => new Duration({
						minutes: -50
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration: Duration = new Duration({
						minutes: 80
					});

					checkDuration(duration, {
						hours: 1,
						minutes: 20
					});
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						minutes: -82
					})).to.throws;
				});

				it('fall', () => {
					const duration: Duration = new Duration({
						hours: 1,
						minutes: -1
					});

					checkDuration(duration, {
						minutes: 59
					});
				});

				it('not fall', () => {
					const duration: Duration = new Duration({
						hours: 1,
						minutes: 1
					});

					checkDuration(duration, {
						hours: 1,
						minutes: 1
					});
				});
			});

			describe(DurationUnit.Seconds, () => {
				it('> 0', () => {
					const duration: Duration = new Duration({
						seconds: 30
					});

					checkDuration(duration, {
						seconds: 30
					});
				});

				it('< 0', () => {
					expect(() => new Duration({
						seconds: -40
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration: Duration = new Duration({
						seconds: 80
					});

					checkDuration(duration, {
						minutes: 1,
						seconds: 20
					});
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						seconds: -82
					})).to.be.throws;
				});

				it('fall', () => {
					const duration: Duration = new Duration({
						minutes: 1,
						seconds: -1
					});

					checkDuration(duration, {
						seconds: 59
					});
				});

				it('not fall', () => {
					const duration: Duration = new Duration({
						minutes: 1,
						seconds: 1
					});

					checkDuration(duration, {
						minutes: 1,
						seconds: 1
					});
				});
			});

			describe(DurationUnit.Ms, () => {
				it('> 0', () => {
					const duration: Duration = new Duration({
						ms: 100
					});

					checkDuration(duration, {
						ms: 100
					});
				});

				it('< 0', () => {
					expect(() => new Duration({
						ms: -100
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration: Duration = new Duration({
						ms: 1002
					});

					checkDuration(duration, {
						seconds: 1,
						ms: 2
					});
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						ms: -1002
					})).to.throws;
				});

				it('fall', () => {
					const duration: Duration = new Duration({
						seconds: 1,
						ms: -1
					});

					checkDuration(duration, {
						ms: 999
					});
				});

				it('not fall', () => {
					const duration: Duration = new Duration({
						seconds: 1,
						ms: 1
					});

					checkDuration(duration, {
						seconds: 1,
						ms: 1
					});
				});
			});
		});
	});

	describe('valueOf()', () => {
		it('ms', () => {
			const value = 88;

			const valueOf: number = +new Duration({
				ms: value
			});

			expect(valueOf).to.be.eql(value);
		});

		it('seconds', () => {
			const value = 35;

			const valueOf: number = +new Duration({
				seconds: value
			});

			expect(valueOf).to.be.eql(value * 1000);
		});

		it('minutes', () => {
			const value = 53;

			const valueOf: number = +new Duration({
				minutes: value
			});

			expect(valueOf).to.be.eql(value * 60 * 1000);
		});

		it('hours', () => {
			const value = 10;

			const valueOf: number = +new Duration({
				hours: value
			});

			expect(valueOf).to.be.eql(value * 60 * 60 * 1000);
		});

		it('dates', () => {
			const value = 10;

			const valueOf: number = +new Duration({
				dates: value
			});

			expect(valueOf).to.be.eql(value * 24 * 60 * 60 * 1000);
		});

		it('months', () => {
			const value = 3;

			const valueOf: number = +new Duration({
				months: value
			});

			expect(valueOf).to.be.eql(value * Gregorian1Month * 24 * 60 * 60 * 1000);
		});

		it('years', () => {
			const value = 3;

			const valueOf: number = +new Duration({
				years: value
			});

			expect(valueOf).to.be.eql(value * 12 * Gregorian1Month * 24 * 60 * 60 * 1000);
		});
	});

	describe('add()', () => {
		describe('with Duration', () => {
			it('ok - simple', () => {
				const initData1: DurationParam = {
					minutes: 1
				};

				const duration1: Duration = new Duration(initData1);


				const initData2: DurationParam = {
					minutes: 3
				};

				const duration2: Duration = new Duration(initData2);

				const result: Duration = duration1.add(duration2);


				checkDuration(result, {
					minutes: (initData1.minutes as number) + (initData2.minutes as number)
				});
			});

			// no round up
			it('ok - full', () => {
				const initData1: Required<DurationParam> = {
					years: 5,
					months: 1,
					dates: 10,

					hours: 3,
					minutes: 1,
					seconds: 14,
					ms: 123
				};

				const duration1: Duration = new Duration(initData1);

				const initData2: Required<DurationParam> = {
					years: 1,
					months: 5,
					dates: 10,

					hours: 6,
					minutes: 40,
					seconds: 2,
					ms: 52
				};

				const duration2: Duration = new Duration(initData2);

				const result: Duration = duration1.add(duration2);

				checkDuration(result, {
					years: initData1.years + initData2.years,
					months: initData1.months + initData2.months,
					dates: initData1.dates + initData2.dates,

					hours: initData1.hours + initData2.hours,
					minutes: initData1.minutes + initData2.minutes,
					seconds: initData1.seconds + initData2.seconds,
					ms: initData1.ms + initData2.ms
				});
			});
		});

		describe('with DurationParam', () => {
			it('ok - simple', () => {
				const initData1: DurationParam = {
					minutes: 1
				};

				const duration1: Duration = new Duration(initData1);


				const initData2: DurationParam = {
					minutes: 3
				};

				const result: Duration = duration1.add(initData2);

				checkDuration(result, {
					minutes: (initData1.minutes as number) + (initData2.minutes as number)
				});
			});

			// no round up
			it('ok - full', () => {
				const initData1: Required<DurationParam> = {
					years: 5,
					months: 1,
					dates: 10,

					hours: 3,
					minutes: 1,
					seconds: 14,
					ms: 123
				};

				const duration1: Duration = new Duration(initData1);

				const initData2: Required<DurationParam> = {
					years: 1,
					months: 5,
					dates: 10,

					hours: 6,
					minutes: 40,
					seconds: 2,
					ms: 52
				};

				const result: Duration = duration1.add(initData2);

				checkDuration(result, {
					years: initData1.years + initData2.years,
					months: initData1.months + initData2.months,
					dates: initData1.dates + initData2.dates,

					hours: initData1.hours + initData2.hours,
					minutes: initData1.minutes + initData2.minutes,
					seconds: initData1.seconds + initData2.seconds,
					ms: initData1.ms + initData2.ms
				});
			});
		});

		describe('with DateTime', () => {
			// no round up
			it('ok', () => {
				const durationData: Required<DurationParam> = {
					years: 5,
					months: 1,
					dates: 10,

					hours: 3,
					minutes: 1,
					seconds: 14,
					ms: 123
				};

				const duration: Duration = new Duration(durationData);

				const date: DateTime = new DateTime({
					year: 2021,
					month: 4,
					date: 15,

					hours: 20,
					minutes: 10,
					seconds: 5,
					ms: 20
				});

				const result: DateTime = duration.add(date);

				checkDateTime(result, {
					year: date.year + durationData.years,
					month: date.month + durationData.months,
					date: date.date + durationData.dates,

					hours: date.hours + durationData.hours,
					minutes: date.minutes + durationData.minutes,
					seconds: date.seconds + durationData.seconds,
					ms: date.ms + durationData.ms
				});
			});
		});
	});

	describe('divide()', () => {
		it('ok', () => {
			const totalDuration = 1000;
			const count = 4;

			const duration: Duration = new Duration({
				ms: totalDuration
			});

			const divideResult: Duration[] = duration.divide(count);

			expect(divideResult).to.be.instanceOf(Array);
			expect(divideResult).to.be.lengthOf(count);
			expect(divideResult.every((one: Duration): boolean => {
				return +one === totalDuration / count;
			})).to.be.true;
		});

		it('ok - with rebalancing', () => {
			const totalDuration = 2000;
			const count = 2;

			const duration: Duration = new Duration({
				ms: totalDuration
			});

			const divideResult: Duration[] = duration.divide(count);

			expect(divideResult).to.be.instanceOf(Array);
			expect(divideResult).to.be.lengthOf(count);
			expect(divideResult.every((one: Duration): boolean => {
				return +one === totalDuration / count;
			})).to.be.true;

			expect(divideResult.every((one: Duration): boolean => {
				return one.seconds === totalDuration / count / 1000
					&& one.ms === undefined;
			})).to.be.true;
		});
	});
});
