import { expect } from 'chai';

import { Duration } from '../src/duration';
import { DurationParamKeys, DurationUnit, Gregorian1Month, Gregorian1Year } from '../src/constants';
import { DurationParam } from '../src/interfaces';
import { DateTime } from '../src/date-time';
import { checkDateTime } from '../spec/test';


describe('Duration', () => {
	describe('constructor', () => {
		it('no init data', () => {
			const duration : Duration = new Duration();

			expect(duration).to.be.instanceOf(Duration);

			expect(duration.years).to.be.undefined;
			expect(duration.months).to.be.undefined;
			expect(duration.dates).to.be.undefined;

			expect(duration.hours).to.be.undefined;
			expect(duration.minutes).to.be.undefined;
			expect(duration.seconds).to.be.undefined;
			expect(duration.ms).to.be.undefined;
		});

		describe('by string', () => {
			describe('PnYnMnDTnHnMnS', () => {
				describe('all', () => {
					it('all', () => {
						const duration : Duration = new Duration('P1Y2M3DT4H5M6S');

						expect(duration.years).to.be.eql(1);
						expect(duration.months).to.be.eql(2);
						expect(duration.dates).to.be.eql(3);

						expect(duration.hours).to.be.eql(4);
						expect(duration.minutes).to.be.eql(5);
						expect(duration.seconds).to.be.eql(6);
						expect(duration.ms).to.be.undefined;
					});

					it('dates', () => {
						const duration : Duration = new Duration('P1Y2M3D');

						expect(duration.years).to.be.eql(1);
						expect(duration.months).to.be.eql(2);
						expect(duration.dates).to.be.eql(3);

						expect(duration.hours).to.be.undefined;
						expect(duration.minutes).to.be.undefined;
						expect(duration.seconds).to.be.undefined;
						expect(duration.ms).to.be.undefined;
					});

					it('hours', () => {
						const duration : Duration = new Duration('PT4H5M6S');

						expect(duration.years).to.be.undefined;
						expect(duration.months).to.be.undefined;
						expect(duration.dates).to.be.undefined;

						expect(duration.hours).to.be.eql(4);
						expect(duration.minutes).to.be.eql(5);
						expect(duration.seconds).to.be.eql(6);
						expect(duration.ms).to.be.undefined;
					});
				});

				describe(DurationUnit.Years, () => {
					it('ok', () => {
						const duration : Duration = new Duration('P2Y');

						expect(duration.years).to.be.eql(2);
						expect(duration.months).to.be.undefined;
						expect(duration.dates).to.be.undefined;

						expect(duration.hours).to.be.undefined;
						expect(duration.minutes).to.be.undefined;
						expect(duration.seconds).to.be.undefined;
						expect(duration.ms).to.be.undefined;
					});
				});

				describe(DurationUnit.Months, () => {
					it('ok', () => {
						const duration : Duration = new Duration('P2M');

						expect(duration.years).to.be.undefined;
						expect(duration.months).to.be.eql(2);
						expect(duration.dates).to.be.undefined;

						expect(duration.hours).to.be.undefined;
						expect(duration.minutes).to.be.undefined;
						expect(duration.seconds).to.be.undefined;
						expect(duration.ms).to.be.undefined;
					});

					it('round up', () => {
						const duration : Duration = new Duration('P14M');

						expect(duration.years).to.be.eql(1);
						expect(duration.months).to.be.eql(2);
						expect(duration.dates).to.be.undefined;

						expect(duration.hours).to.be.undefined;
						expect(duration.minutes).to.be.undefined;
						expect(duration.seconds).to.be.undefined;
						expect(duration.ms).to.be.undefined;
					});
				});

				describe(DurationUnit.Dates, () => {
					it('ok', () => {
						const duration : Duration = new Duration('P2D');

						expect(duration.years).to.be.undefined;
						expect(duration.months).to.be.undefined;
						expect(duration.dates).to.be.eql(2);

						expect(duration.hours).to.be.undefined;
						expect(duration.minutes).to.be.undefined;
						expect(duration.seconds).to.be.undefined;
						expect(duration.ms).to.be.undefined;
					});

					it('round up', () => {
						const duration : Duration = new Duration('P40D');

						expect(duration.years).to.be.undefined;
						expect(duration.months).to.be.eql(1);
						expect(duration.dates).to.be.eql(40 - Gregorian1Month);

						expect(duration.hours).to.be.undefined;
						expect(duration.minutes).to.be.undefined;
						expect(duration.seconds).to.be.undefined;
						expect(duration.ms).to.be.undefined;
					});
				});

				describe(DurationUnit.Hours, () => {
					it('ok', () => {
						const duration : Duration = new Duration('PT2H');

						expect(duration.years).to.be.undefined;
						expect(duration.months).to.be.undefined;
						expect(duration.dates).to.be.undefined;

						expect(duration.hours).to.be.eql(2);
						expect(duration.minutes).to.be.undefined;
						expect(duration.seconds).to.be.undefined;
						expect(duration.ms).to.be.undefined;
					});

					it('round up', () => {
						const duration : Duration = new Duration('PT26H');

						expect(duration.years).to.be.undefined;
						expect(duration.months).to.be.undefined;
						expect(duration.dates).to.be.eql(1);

						expect(duration.hours).to.be.eql(2);
						expect(duration.minutes).to.be.undefined;
						expect(duration.seconds).to.be.undefined;
						expect(duration.ms).to.be.undefined;
					});
				});

				describe(DurationUnit.Minutes, () => {
					it('ok', () => {
						const duration : Duration = new Duration('PT2M');

						expect(duration.years).to.be.undefined;
						expect(duration.months).to.be.undefined;
						expect(duration.dates).to.be.undefined;

						expect(duration.hours).to.be.undefined;
						expect(duration.minutes).to.be.eql(2);
						expect(duration.seconds).to.be.undefined;
						expect(duration.ms).to.be.undefined;
					});

					it('round up', () => {
						const duration : Duration = new Duration('PT66M');

						expect(duration.years).to.be.undefined;
						expect(duration.months).to.be.undefined;
						expect(duration.dates).to.be.undefined;

						expect(duration.hours).to.be.eql(1);
						expect(duration.minutes).to.be.eql(6);
						expect(duration.seconds).to.be.undefined;
						expect(duration.ms).to.be.undefined;
					});
				});

				describe(DurationUnit.Seconds, () => {
					it('ok', () => {
						const duration : Duration = new Duration('PT2S');

						expect(duration.years).to.be.undefined;
						expect(duration.months).to.be.undefined;
						expect(duration.dates).to.be.undefined;

						expect(duration.hours).to.be.undefined;
						expect(duration.minutes).to.be.undefined;
						expect(duration.seconds).to.be.eql(2);
						expect(duration.ms).to.be.undefined;
					});

					it('round up', () => {
						const duration : Duration = new Duration('PT68S');

						expect(duration.years).to.be.undefined;
						expect(duration.months).to.be.undefined;
						expect(duration.dates).to.be.undefined;

						expect(duration.hours).to.be.undefined;
						expect(duration.minutes).to.be.eql(1);
						expect(duration.seconds).to.be.eql(8);
						expect(duration.ms).to.be.undefined;
					});
				});
			});

			describe('PnW', () => {
				it('ok', () => {
					const duration : Duration = new Duration('P2W');

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.eql(14);

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('round up', () => {
					const week : number = 8; // 56 days

					const duration : Duration = new Duration(`P${ week }W`);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.eql(1);
					expect(duration.dates).to.be.eql(week * 7 - Gregorian1Month);

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('round up more', () => {
					const week : number = 53;

					const duration : Duration = new Duration(`P${ week }W`);

					expect(duration.years).to.be.eql(1);
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.closeTo(53 * 7 - Gregorian1Year, 1);

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});
			});
		});

		describe('by Duration', () => {
			it('ok', () => {
				DurationParamKeys.forEach(key => {
					const refDuration : Duration = new Duration({
						[key] : 1
					});

					const newDuration : Duration = new Duration(refDuration);

					DurationParamKeys.forEach(checkKey => {
						expect(newDuration[checkKey]).to.be.eql(refDuration[checkKey]);
					});
				});
			});
		});

		describe('by DurationParam', () => {
			describe(DurationUnit.Years, () => {
				it('ok', () => {
					const duration : Duration = new Duration({
						years : 100
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.eql(100);
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('< 0', () => {
					expect(() => new Duration({
						years : -1
					})).to.throws;
				});
			});

			// TODO: Quarters

			describe(DurationUnit.Months, () => {
				it('> 0', () => {
					const duration : Duration = new Duration({
						months : 7
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.eql(7);
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('< 0', () => {
					expect(() => new Duration({
						months : -3
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration : Duration = new Duration({
						months : 38
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.eql(3);
					expect(duration.months).to.be.eql(2);
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						months : -25
					})).to.throws;
				});

				it('fall', () => {
					const duration : Duration = new Duration({
						years : 1,
						months : -1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.eql(11);
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('not fall', () => {
					const duration : Duration = new Duration({
						years : 1,
						months : 1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.eql(1);
					expect(duration.months).to.be.eql(1);
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});
			});

			// TODO: Weeks

			describe(DurationUnit.Dates, () => {
				it('> 0', () => {
					const duration : Duration = new Duration({
						dates : 13
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.eql(13);

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('< 0', () => {
					expect(() => new Duration({
						dates : -13
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration : Duration = new Duration({
						dates : 38
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.eql(1);
					expect(duration.dates).to.be.eql(38 - Gregorian1Month);

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						dates : -36
					})).to.throws;
				});

				it('fall', () => {
					const duration : Duration = new Duration({
						months : 1,
						dates : -1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.eql(Gregorian1Month - 1);

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('not fall', () => {
					const duration : Duration = new Duration({
						months : 1,
						dates : 1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.eql(1);
					expect(duration.dates).to.be.eql(1);

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});
			});

			describe(DurationUnit.Hours, () => {
				it('> 0', () => {
					const duration : Duration = new Duration({
						hours : 13
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.eql(13);
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('< 0', () => {
					expect(() => new Duration({
						hours : -13
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration : Duration = new Duration({
						hours : 27
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.eql(1);

					expect(duration.hours).to.be.eql(3);
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						hours : -28
					})).to.throws;
				});

				it('fall', () => {
					const duration : Duration = new Duration({
						dates : 2,
						hours : -1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.eql(1);

					expect(duration.hours).to.be.eql(23);
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('not fall', () => {
					const duration : Duration = new Duration({
						dates : 1,
						hours : 1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.eql(1);

					expect(duration.hours).to.be.eql(1);
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});
			});

			describe(DurationUnit.Minutes, () => {
				it('> 0', () => {
					const duration : Duration = new Duration({
						minutes : 40
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.eql(40);
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('< 0', () => {
					expect(() => new Duration({
						minutes : -50
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration : Duration = new Duration({
						minutes : 80
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.eql(1);
					expect(duration.minutes).to.be.eql(20);
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						minutes : -82
					})).to.throws;
				});

				it('fall', () => {
					const duration : Duration = new Duration({
						hours : 1,
						minutes : -1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.eql(59);
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('not fall', () => {
					const duration : Duration = new Duration({
						hours : 1,
						minutes : 1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.eql(1);
					expect(duration.minutes).to.be.eql(1);
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});
			});

			describe(DurationUnit.Seconds, () => {
				it('> 0', () => {
					const duration : Duration = new Duration({
						seconds : 30
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.eql(30);
					expect(duration.ms).to.be.undefined;
				});

				it('< 0', () => {
					expect(() => new Duration({
						seconds : -40
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration : Duration = new Duration({
						seconds : 80
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.eql(1);
					expect(duration.seconds).to.be.eql(20);
					expect(duration.ms).to.be.undefined;
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						seconds : -82
					})).to.be.throws;
				});

				it('fall', () => {
					const duration : Duration = new Duration({
						minutes : 1,
						seconds : -1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.eql(59);
					expect(duration.ms).to.be.undefined;
				});

				it('not fall', () => {
					const duration : Duration = new Duration({
						minutes : 1,
						seconds : 1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.eql(1);
					expect(duration.seconds).to.be.eql(1);
					expect(duration.ms).to.be.undefined;
				});
			});

			describe(DurationUnit.Ms, () => {
				it('> 0', () => {
					const duration : Duration = new Duration({
						ms : 100
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.eql(100);
				});

				it('< 0', () => {
					expect(() => new Duration({
						ms : -100
					})).to.throws;
				});

				it('> 0, rebalancing', () => {
					const duration : Duration = new Duration({
						ms : 1002
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.eql(1);
					expect(duration.ms).to.be.eql(2);
				});

				it('< 0, rebalancing', () => {
					expect(() => new Duration({
						ms : -1002
					})).to.throws;
				});

				it('fall', () => {
					const duration : Duration = new Duration({
						seconds : 1,
						ms : -1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.eql(999);
				});

				it('not fall', () => {
					const duration : Duration = new Duration({
						seconds : 1,
						ms : 1
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.eql(1);
					expect(duration.ms).to.be.eql(1);
				});
			});
		});
	});

	describe('add()', () => {
		describe('with Duration', () => {
			it('ok - simple', () => {
				const initData1 : DurationParam = {
					minutes : 1
				};

				const duration1 : Duration = new Duration(initData1);


				const initData2 : DurationParam = {
					minutes : 3
				};

				const duration2 : Duration = new Duration(initData2);

				const result : Duration = duration1.add(duration2);

				expect(result).to.be.instanceOf(Duration);

				expect(result.minutes).to.be.eql(initData1.minutes + initData2.minutes);
			});

			// no round up
			it('ok - full', () => {
				const initData1 : DurationParam = {
					years : 5,
					months : 1,
					dates : 10,

					hours : 3,
					minutes : 1,
					seconds : 14,
					ms : 123
				};

				const duration1 : Duration = new Duration(initData1);

				const initData2 : DurationParam = {
					years : 1,
					months : 5,
					dates : 10,

					hours : 6,
					minutes : 40,
					seconds : 2,
					ms : 52
				};

				const duration2 : Duration = new Duration(initData2);

				const result : Duration = duration1.add(duration2);

				expect(result).to.be.instanceOf(Duration);

				expect(result.years).to.be.eql(initData1.years + initData2.years);
				expect(result.months).to.be.eql(initData1.months + initData2.months);
				expect(result.dates).to.be.eql(initData1.dates + initData2.dates);

				expect(result.hours).to.be.eql(initData1.hours + initData2.hours);
				expect(result.minutes).to.be.eql(initData1.minutes + initData2.minutes);
				expect(result.seconds).to.be.eql(initData1.seconds + initData2.seconds);
				expect(result.ms).to.be.eql(initData1.ms + initData2.ms);
			});
		});

		describe('with DurationParam', () => {
			it('ok - simple', () => {
				const initData1 : DurationParam = {
					minutes : 1
				};

				const duration1 : Duration = new Duration(initData1);


				const initData2 : DurationParam = {
					minutes : 3
				};

				const result : Duration = duration1.add(initData2);

				expect(result).to.be.instanceOf(Duration);

				expect(result.minutes).to.be.eql(initData1.minutes + initData2.minutes);
			});

			// no round up
			it('ok - full', () => {
				const initData1 : DurationParam = {
					years : 5,
					months : 1,
					dates : 10,

					hours : 3,
					minutes : 1,
					seconds : 14,
					ms : 123
				};

				const duration1 : Duration = new Duration(initData1);

				const initData2 : DurationParam = {
					years : 1,
					months : 5,
					dates : 10,

					hours : 6,
					minutes : 40,
					seconds : 2,
					ms : 52
				};

				const result : Duration = duration1.add(initData2);

				expect(result).to.be.instanceOf(Duration);

				expect(result.years).to.be.eql(initData1.years + initData2.years);
				expect(result.months).to.be.eql(initData1.months + initData2.months);
				expect(result.dates).to.be.eql(initData1.dates + initData2.dates);

				expect(result.hours).to.be.eql(initData1.hours + initData2.hours);
				expect(result.minutes).to.be.eql(initData1.minutes + initData2.minutes);
				expect(result.seconds).to.be.eql(initData1.seconds + initData2.seconds);
				expect(result.ms).to.be.eql(initData1.ms + initData2.ms);
			});
		});

		describe('with DateTime', () => {
			it('ok - simple', () => {
				const durationData : DurationParam = {
					minutes : 1
				};

				const duration : Duration = new Duration(durationData);


				const date : DateTime = new DateTime({
					year : 2021,
					month : 4,
					date : 15,

					hours : 1,
					minutes : 2,
					seconds : 3,
					ms : 4
				});

				const result : DateTime = duration.add(date);

				expect(result).to.be.instanceOf(DateTime);

				expect(result.minutes).to.be.eql(durationData.minutes + date.minutes);
			});

			// no round up
			it('ok - full', () => {
				const durationData : DurationParam = {
					years : 5,
					months : 1,
					dates : 10,

					hours : 3,
					minutes : 1,
					seconds : 14,
					ms : 123
				};

				const duration : Duration = new Duration(durationData);

				const date : DateTime = new DateTime({
					year : 2021,
					month : 4,
					date : 15,

					hours : 20,
					minutes : 10,
					seconds : 5,
					ms : 20
				});

				const result : DateTime = duration.add(date);

				checkDateTime(result, {
					year : date.year + durationData.years,
					month : date.month + durationData.months,
					date : date.date + durationData.dates,

					hours : date.hours + durationData.hours,
					minutes : date.minutes + durationData.minutes,
					seconds : date.seconds + durationData.seconds,
					ms : date.ms + durationData.ms
				});
			});
		});
	});
});
