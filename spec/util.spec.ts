import { describe, it } from 'mocha';
import { expect } from 'chai';

import { DateTime } from '../src/date-time';

import { TokenMatchResult } from '../src/interfaces';
import { findTokens } from '../src/util';
import { FormatToken } from '../src/constants';


describe('util', () => {
	describe('findTokens()', () => {
		describe('without value string', () => {
			it('ok', () => {
				const result: TokenMatchResult[] = findTokens(FormatToken.MinutesPadded);

				expect(result).to.be.instanceOf(Array);
				expect(result).to.be.lengthOf(1);
				expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

				expect(result[0]).to.have.property('token');
				expect(result[0].token).to.be.eql(FormatToken.MinutesPadded);
				expect(result[0].value).to.be.undefined;
			});
		});

		describe('with value string', () => {
			it('no token', () => {
				expect(() => findTokens(
					FormatToken.DayOfMonth,
					'abcde'
				)).to.throws;
			});

			describe('simple', () => {
				it('1 digit', () => {
					const result: TokenMatchResult[] = findTokens(
						FormatToken.DayOfMonth,
						'1'
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(1);
					expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

					expect(result[0]).to.have.property('token', FormatToken.DayOfMonth);
					expect(result[0]).to.have.property('value', 1);
				});

				it('2 digit', () => {
					const result: TokenMatchResult[] = findTokens(
						FormatToken.DayOfMonth,
						'25'
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(1);
					expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

					expect(result[0]).to.have.property('token', FormatToken.DayOfMonth);
					expect(result[0]).to.have.property('value', 25);
				});

				it('3 digit', () => {
					const result: TokenMatchResult[] = findTokens(
						FormatToken.DayOfYear,
						'125'
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(1);
					expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

					expect(result[0]).to.have.property('token', FormatToken.DayOfYear);
					expect(result[0]).to.have.property('value', 125);
				});
			});

			describe('extract', () => {
				it('prefix', () => {
					const result: TokenMatchResult[] = findTokens(
						`123-${ FormatToken.Minutes }`,
						'123-45'
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(1);
					expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

					expect(result[0]).to.have.property('token', FormatToken.Minutes);
					expect(result[0]).to.have.property('value', 45);
				});

				it('between', () => {
					const result: TokenMatchResult[] = findTokens(
						`1-${ FormatToken.Minutes }-45`,
						'1-23-45'
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(1);
					expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

					expect(result[0]).to.have.property('token', FormatToken.Minutes);
					expect(result[0]).to.have.property('value', 23);
				});

				it('suffix', () => {
					const result: TokenMatchResult[] = findTokens(
						`${ FormatToken.Minutes }-345`,
						'12-345'
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(1);
					expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

					expect(result[0]).to.have.property('token', FormatToken.Minutes);
					expect(result[0]).to.have.property('value', 12);
				});

				it('each side', () => {
					const result: TokenMatchResult[] = findTokens(
						`${ FormatToken.Minutes }-34-${ FormatToken.Seconds }`,
						'12-34-56'
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(2);
					expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

					expect(result[0]).to.have.property('token', FormatToken.Minutes);
					expect(result[0]).to.have.property('value', 12);

					expect(result[1]).to.have.property('token', FormatToken.Seconds);
					expect(result[1]).to.have.property('value', 56);
				});
			});

			describe('combination', () => {
				describe('fixed length', () => {
					it('without space', () => {
						const result: TokenMatchResult[] = findTokens(
							FormatToken.MinutesPadded + FormatToken.SecondsPadded,
							'3553'
						);

						expect(result).to.be.instanceOf(Array);
						expect(result).to.be.lengthOf(2);
						expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

						expect(result[0]).to.have.property('token', FormatToken.MinutesPadded);
						expect(result[0]).to.have.property('value', 35);

						expect(result[1]).to.have.property('token', FormatToken.SecondsPadded);
						expect(result[1]).to.have.property('value', 53);
					});

					it('with space', () => {
						const result: TokenMatchResult[] = findTokens(
							FormatToken.MinutesPadded + ' ' + FormatToken.SecondsPadded,
							'35 53'
						);

						expect(result).to.be.instanceOf(Array);
						expect(result).to.be.lengthOf(2);
						expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

						expect(result[0]).to.have.property('token', FormatToken.MinutesPadded);
						expect(result[0]).to.have.property('value', 35);

						expect(result[1]).to.have.property('token', FormatToken.SecondsPadded);
						expect(result[1]).to.have.property('value', 53);
					});
				});

				describe('variable length', () => {
					it('without space', () => {
						const result: TokenMatchResult[] = findTokens(
							FormatToken.Minutes + FormatToken.Seconds,
							'3553'
						);

						expect(result).to.be.instanceOf(Array);
						expect(result).to.be.lengthOf(2);
						expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

						expect(result[0]).to.have.property('token', FormatToken.Minutes);
						expect(result[0]).to.have.property('value', 35);

						expect(result[1]).to.have.property('token', FormatToken.Seconds);
						expect(result[1]).to.have.property('value', 53);
					});

					it('with space', () => {
						const result: TokenMatchResult[] = findTokens(
							FormatToken.Minutes + ' ' + FormatToken.Seconds,
							'3 5'
						);

						expect(result).to.be.instanceOf(Array);
						expect(result).to.be.lengthOf(2);
						expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

						expect(result[0]).to.have.property('token', FormatToken.Minutes);
						expect(result[0]).to.have.property('value', 3);

						expect(result[1]).to.have.property('token', FormatToken.Seconds);
						expect(result[1]).to.have.property('value', 5);
					});
				});

				it('ISOString', () => {
					const now: DateTime = new DateTime();

					// find result is value of timezone removed
					const timezoneReduced: DateTime = new DateTime(now).add({
						hours: -now.timezoneOffsetInHours
					});

					const result: TokenMatchResult[] = findTokens(
						'YYYY-MM-DDTHH:mm:ss.SSSZ',
						now.toISOString()
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(7);
					expect(result.every((one: TokenMatchResult): boolean => typeof one === 'object')).to.be.true;

					interface Define {
						token: FormatToken;
						value: number;
					}

					const defs: Define[] = [
						{ token: FormatToken.Year, value: timezoneReduced.year },
						{ token: FormatToken.MonthPadded, value: timezoneReduced.month },
						{ token: FormatToken.DayOfMonthPadded, value: timezoneReduced.date },

						{ token: FormatToken.Hours24Padded, value: timezoneReduced.hours },
						{ token: FormatToken.MinutesPadded, value: timezoneReduced.minutes },
						{ token: FormatToken.SecondsPadded, value: timezoneReduced.seconds },
						{ token: FormatToken.MilliSecondsPadded3, value: timezoneReduced.ms }
					];

					defs.forEach((def: Define): void => {
						const target: TokenMatchResult | undefined = result.find((one: TokenMatchResult): boolean => {
							return one.token === def.token;
						});

						expect(target).to.be.ok;

						if (target) {
							expect(target.value).to.be.eql(def.value);
						}
					});
				});
			});
		});
	});
});
