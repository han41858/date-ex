import { describe, it } from 'mocha';
import { expect } from 'chai';

import { DateTime } from '../src/date-time';

import { TokenMatchResult } from '../src/interfaces';
import { parseValueWithFormat } from '../src/util';
import { FormatToken } from '../src/constants';


describe('util', () => {
	describe('parseValueWithFormat()', () => {
		it('no token', () => {
			expect(() => parseValueWithFormat(
				'abcde',
				FormatToken.DayOfMonth
			)).to.throws;
		});

		describe('simple', () => {
			it('1 digit', () => {
				const result : TokenMatchResult[] = parseValueWithFormat(
					'1',
					FormatToken.DayOfMonth
				);

				expect(result).to.be.instanceOf(Array);
				expect(result).to.be.lengthOf(1);

				expect(result[0]).to.have.property('token', FormatToken.DayOfMonth);
				expect(result[0]).to.have.property('value', 1);
			});

			it('2 digit', () => {
				const result : TokenMatchResult[] = parseValueWithFormat(
					'25',
					FormatToken.DayOfMonth
				);

				expect(result).to.be.instanceOf(Array);
				expect(result).to.be.lengthOf(1);

				expect(result[0]).to.have.property('token', FormatToken.DayOfMonth);
				expect(result[0]).to.have.property('value', 25);
			});

			it('3 digit', () => {
				const result : TokenMatchResult[] = parseValueWithFormat(
					'125',
					FormatToken.DayOfYear
				);

				expect(result).to.be.instanceOf(Array);
				expect(result).to.be.lengthOf(1);

				expect(result[0]).to.have.property('token', FormatToken.DayOfYear);
				expect(result[0]).to.have.property('value', 125);
			});
		});

		describe('extract', () => {
			it('prefix', () => {
				const result : TokenMatchResult[] = parseValueWithFormat(
					'123-45',
					`123-${ FormatToken.Minutes }`
				);

				expect(result).to.be.instanceOf(Array);
				expect(result).to.be.lengthOf(1);

				expect(result[0]).to.have.property('token', FormatToken.Minutes);
				expect(result[0]).to.have.property('value', 45);
			});

			it('between', () => {
				const result : TokenMatchResult[] = parseValueWithFormat(
					'1-23-45',
					`1-${ FormatToken.Minutes }-45`
				);

				expect(result).to.be.instanceOf(Array);
				expect(result).to.be.lengthOf(1);

				expect(result[0]).to.have.property('token', FormatToken.Minutes);
				expect(result[0]).to.have.property('value', 23);
			});

			it('suffix', () => {
				const result : TokenMatchResult[] = parseValueWithFormat(
					'12-345',
					`${ FormatToken.Minutes }-345`
				);

				expect(result).to.be.instanceOf(Array);
				expect(result).to.be.lengthOf(1);

				expect(result[0]).to.have.property('token', FormatToken.Minutes);
				expect(result[0]).to.have.property('value', 12);
			});

			it('each side', () => {
				const result : TokenMatchResult[] = parseValueWithFormat(
					'12-34-56',
					`${ FormatToken.Minutes }-34-${ FormatToken.Seconds }`
				);

				expect(result).to.be.instanceOf(Array);
				expect(result).to.be.lengthOf(2);

				expect(result[0]).to.have.property('token', FormatToken.Minutes);
				expect(result[0]).to.have.property('value', 12);

				expect(result[1]).to.have.property('token', FormatToken.Seconds);
				expect(result[1]).to.have.property('value', 56);
			});
		});

		describe('combination', () => {
			describe('fixed length', () => {
				it('without space', () => {
					const result : TokenMatchResult[] = parseValueWithFormat(
						'3553',
						FormatToken.MinutesPadded + FormatToken.SecondsPadded
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(2);

					expect(result[0]).to.have.property('token', FormatToken.MinutesPadded);
					expect(result[0]).to.have.property('value', 35);

					expect(result[1]).to.have.property('token', FormatToken.SecondsPadded);
					expect(result[1]).to.have.property('value', 53);
				});

				it('with space', () => {
					const result : TokenMatchResult[] = parseValueWithFormat(
						'35 53',
						FormatToken.MinutesPadded + ' ' + FormatToken.SecondsPadded
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(2);

					expect(result[0]).to.have.property('token', FormatToken.MinutesPadded);
					expect(result[0]).to.have.property('value', 35);

					expect(result[1]).to.have.property('token', FormatToken.SecondsPadded);
					expect(result[1]).to.have.property('value', 53);
				});
			});

			describe('variable length', () => {
				it('without space', () => {
					const result : TokenMatchResult[] = parseValueWithFormat(
						'3553',
						FormatToken.Minutes + FormatToken.Seconds
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(2);

					expect(result[0]).to.have.property('token', FormatToken.Minutes);
					expect(result[0]).to.have.property('value', 35);

					expect(result[1]).to.have.property('token', FormatToken.Seconds);
					expect(result[1]).to.have.property('value', 53);
				});

				it('with space', () => {
					const result : TokenMatchResult[] = parseValueWithFormat(
						'3 5',
						FormatToken.Minutes + ' ' + FormatToken.Seconds
					);

					expect(result).to.be.instanceOf(Array);
					expect(result).to.be.lengthOf(2);

					expect(result[0]).to.have.property('token', FormatToken.Minutes);
					expect(result[0]).to.have.property('value', 3);

					expect(result[1]).to.have.property('token', FormatToken.Seconds);
					expect(result[1]).to.have.property('value', 5);
				});
			});

			it('ISOString', () => {
				const now : DateTime = new DateTime();

				// find result is value of timezone removed
				const timezoneReduced : DateTime = new DateTime(now).add({
					hours : -now.timezoneOffsetInHours
				});

				const result : TokenMatchResult[] = parseValueWithFormat(
					now.toISOString(),
					'YYYY-MM-DDTHH:mm:ss.SSSZ'
				);

				expect(result).to.be.instanceOf(Array);
				expect(result).to.be.lengthOf(7);

				const defs : {
					token : FormatToken,
					value : number
				}[] = [
					{ token : FormatToken.Year, value : timezoneReduced.year },
					{ token : FormatToken.MonthPadded, value : timezoneReduced.month },
					{ token : FormatToken.DayOfMonthPadded, value : timezoneReduced.date },

					{ token : FormatToken.Hours24Padded, value : timezoneReduced.hours },
					{ token : FormatToken.MinutesPadded, value : timezoneReduced.minutes },
					{ token : FormatToken.SecondsPadded, value : timezoneReduced.seconds },
					{ token : FormatToken.MilliSecondsPadded3, value : timezoneReduced.ms }
				];

				defs.forEach(def => {
					const target : TokenMatchResult = result.find(one => {
						return one.token === def.token;
					});

					expect(target).to.be.ok;
					expect(target.value).to.be.eql(def.value);
				});
			});
		});
	});
});
