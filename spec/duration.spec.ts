import { expect } from 'chai';

import { Duration } from '../src/duration';
import { DurationParamKeys, DurationUnit } from '../src/constants';


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

		// TODO: by string

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
			const DatesError : number = .5;

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
					const duration : Duration = new Duration({
						months : -3
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.eql(-3);
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
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
					const duration : Duration = new Duration({
						months : -25
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.eql(-2);
					expect(duration.months).to.be.eql(-1);
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
					const duration : Duration = new Duration({
						dates : -13
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.eql(-13);

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('> 0, rebalancing', () => {
					const duration : Duration = new Duration({
						dates : 38
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.eql(1);
					expect(duration.dates).to.be.closeTo(8, DatesError);

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
				});

				it('< 0, rebalancing', () => {
					const duration : Duration = new Duration({
						dates : -36
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.eql(-1);
					expect(duration.dates).to.be.closeTo(-6, DatesError);

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
					const duration : Duration = new Duration({
						hours : -13
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.eql(-13);
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
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
					const duration : Duration = new Duration({
						hours : -28
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.eql(-1);

					expect(duration.hours).to.be.eql(-4);
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
					const duration : Duration = new Duration({
						minutes : -50
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.eql(-50);
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.undefined;
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
					const duration : Duration = new Duration({
						minutes : -82
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.eql(-1);
					expect(duration.minutes).to.be.eql(-22);
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
					const duration : Duration = new Duration({
						seconds : -40
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.eql(-40);
					expect(duration.ms).to.be.undefined;
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
					const duration : Duration = new Duration({
						seconds : -82
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.eql(-1);
					expect(duration.seconds).to.be.eql(-22);
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
					const duration : Duration = new Duration({
						ms : -100
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.undefined;
					expect(duration.ms).to.be.eql(-100);
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
					const duration : Duration = new Duration({
						ms : -1002
					});

					expect(duration).to.be.instanceOf(Duration);

					expect(duration.years).to.be.undefined;
					expect(duration.months).to.be.undefined;
					expect(duration.dates).to.be.undefined;

					expect(duration.hours).to.be.undefined;
					expect(duration.minutes).to.be.undefined;
					expect(duration.seconds).to.be.eql(-1);
					expect(duration.ms).to.be.eql(-2);
				});
			});
		});
	});
});
