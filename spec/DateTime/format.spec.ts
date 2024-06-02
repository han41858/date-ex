import { expect } from 'chai';

import { DefaultLocale, FormatToken } from '../../src/constants';
import { loadLocaleFile, newArray, padDigit, wait } from '../../src/util';
import { DateTime } from '../../src/date-time';
import { LocaleSet } from '../../src/interfaces';

export const formatSpec = (): void => {
	describe('year', () => {
		it(FormatToken.Year, () => {
			const years: number[] = newArray(20, (i: number): number => {
				return 2000 + i; // 2000 ~ 2019
			});

			years.forEach((year: number): void => {
				const date: DateTime = new DateTime({
					year
				});

				const result: string = date.format(FormatToken.Year);

				expect(result).to.be.lengthOf(4);
				expect(result).to.be.eql('' + year);
			});
		});

		it(FormatToken.YearShort, () => {
			const years: number[] = newArray(20, (i: number): number => {
				return 2000 + i; // 2000 ~ 2019
			});

			years.forEach((year: number): void => {
				const date: DateTime = new DateTime({
					year
				});

				const result: string = date.format(FormatToken.YearShort);

				expect(result).to.be.lengthOf(2);
				expect(result).to.be.eql(('' + year).substring(2));
			});
		});
	});

	describe('quarter', () => {
		it(FormatToken.Quarter, () => {
			const months: number[] = newArray(12, (i: number): number => {
				return i + 1; // 1 ~ 12
			});

			months.forEach((month: number): void => {
				const date: DateTime = new DateTime({
					month
				});

				const result: string = date.format(FormatToken.Quarter);

				expect(result).to.be.lengthOf(1);

				switch (month) {
					case 1:
					case 2:
					case 3:
						expect(result).to.be.eql('1');
						break;

					case 4:
					case 5:
					case 6:
						expect(result).to.be.eql('2');
						break;

					case 7:
					case 8:
					case 9:
						expect(result).to.be.eql('3');
						break;

					case 10:
					case 11:
					case 12:
						expect(result).to.be.eql('4');
						break;
				}
			});
		});
	});

	describe('month', () => {
		let defaultLocaleSet: LocaleSet;

		before(async () => {
			defaultLocaleSet = await loadLocaleFile(DefaultLocale);
			DateTime.locale(DefaultLocale);

			await wait();
		});

		it(FormatToken.Month, () => {
			const months: number[] = newArray(12, (i: number): number => {
				return i + 1; // 1 ~ 12
			});

			months.forEach((month: number): void => {
				const date: DateTime = new DateTime({
					month
				});

				const result: string = date.format(FormatToken.Month);

				expect(result).to.be.lengthOf(month < 10 ? 1 : 2);
				expect(result).to.be.eql('' + month);
			});
		});

		it(FormatToken.MonthPadded, () => {
			const months: number[] = newArray(12, (i: number): number => {
				return i + 1; // 1 ~ 12
			});

			months.forEach((month: number): void => {
				const date: DateTime = new DateTime({
					month
				});

				const result: string = date.format(FormatToken.MonthPadded);

				expect(result).to.be.lengthOf(2);
				expect(result).to.be.eql(padDigit(month, 2));
			});
		});

		it(FormatToken.MonthStringShort, () => {
			const months: number[] = newArray(12, (i: number): number => {
				return i + 1; // 1 ~ 12
			});

			months.forEach((month, i) => {
				const date: DateTime = new DateTime({
					month
				});

				const result: string = date.format(FormatToken.MonthStringShort);

				expect(result).to.be.eql(defaultLocaleSet.MonthShort[i]);
			});
		});

		it(FormatToken.MonthStringLong, () => {
			const months: number[] = newArray(12, (i: number): number => {
				return i + 1; // 1 ~ 12
			});

			months.forEach((month, i) => {
				const date: DateTime = new DateTime({
					month
				});

				const result: string = date.format(FormatToken.MonthStringLong);

				expect(result).to.be.eql(defaultLocaleSet.MonthLong[i]);
			});
		});
	});

	describe('week', () => {
		it(FormatToken.Week, () => {
			const dates: DateTime[] = newArray(43, (i: number): DateTime => {
				return new DateTime({ year: 2020, month: 1, date: i + 1 });
			});

			dates.forEach((date: DateTime): void => {
				const result: string = date.format(FormatToken.Week);

				expect(result).to.be.lengthOf(date.weekOfYear < 10 ? 1 : 2);
				expect(result).to.be.eql('' + date.weekOfYear);
			});
		});

		it(FormatToken.WeekPadded, () => {
			const dates: DateTime[] = newArray(43, (i: number): DateTime => {
				return new DateTime({ year: 2020, month: 1, date: i + 1 });
			});

			dates.forEach((date: DateTime): void => {
				const result: string = date.format(FormatToken.WeekPadded);

				expect(result).to.be.lengthOf(2);
				expect(result).to.be.eql(padDigit(date.weekOfYear, 2));
			});
		});

		it(FormatToken.WeekPaddedWithPrefix, () => {
			const dates: DateTime[] = newArray(43, (i: number): DateTime => {
				return new DateTime({ year: 2020, month: 1, date: i + 1 });
			});

			dates.forEach((date: DateTime): void => {
				const result: string = date.format(FormatToken.WeekPaddedWithPrefix);

				expect(result).to.be.lengthOf(3);
				expect(result).to.be.eql('W' + padDigit(date.weekOfYear, 2));
			});
		});
	});

	describe('date', () => {
		it(FormatToken.DayOfYear, () => {
			const dates: number[] = newArray(100, (i: number): number => {
				return i + 1; // 1 ~ 100
			});

			dates.forEach((date: number): void => {
				const dateTime: DateTime = new DateTime({
					date
				});

				const result: string = dateTime.format(FormatToken.DayOfYear);

				expect(result).to.be.lengthOf(date < 10 ? 1 : (date < 100 ? 2 : 3));
				expect(result).to.be.eql('' + date);
			});
		});

		it(FormatToken.DayOfYearPadded, () => {
			const dates: number[] = newArray(100, (i: number): number => {
				return i + 1; // 1 ~ 100
			});

			dates.forEach((date: number): void => {
				const dateTime: DateTime = new DateTime({
					date
				});

				const result: string = dateTime.format(FormatToken.DayOfYearPadded);

				expect(result).to.be.lengthOf(3);
				expect(result).to.be.eql(padDigit(date, 3));
			});
		});

		it(FormatToken.DayOfMonth, () => {
			const dates: number[] = newArray(31, (i: number): number => {
				return i + 1; // 1 ~ 31
			});

			dates.forEach((date: number): void => {
				const dateTime: DateTime = new DateTime({
					date
				});

				const result: string = dateTime.format(FormatToken.DayOfMonth);

				expect(result).to.be.lengthOf(date < 10 ? 1 : 2);
				expect(result).to.be.eql('' + date);
			});
		});

		it(FormatToken.DayOfMonthPadded, () => {
			const dates: number[] = newArray(31, (i: number): number => {
				return i + 1; // 1 ~ 31
			});

			dates.forEach((date: number): void => {
				const dateTime: DateTime = new DateTime({
					date
				});

				const result: string = dateTime.format(FormatToken.DayOfMonthPadded);

				expect(result).to.be.lengthOf(2);
				expect(result).to.be.eql(padDigit(date, 2));
			});
		});
	});

	describe('day', () => {
		let defaultLocaleSet: LocaleSet;

		before(async () => {
			defaultLocaleSet = await loadLocaleFile(DefaultLocale);
			DateTime.locale(DefaultLocale);

			await wait();
		});

		it(FormatToken.DayOfWeek, () => {
			const dates: DateTime[] = newArray(7, (i: number): DateTime => {
				return new DateTime({ year: 2020, month: 1, date: i });
			});

			dates.forEach((date: DateTime): void => {
				const result: string = date.format(FormatToken.DayOfWeek);

				expect(result).to.be.lengthOf(1);
				expect(result).to.be.eql('' + date.day);
			});
		});

		it(FormatToken.DayOfWeekStringShort, () => {
			const dates: DateTime[] = newArray(7, (i: number): DateTime => {
				return new DateTime({ year: 2020, month: 1, date: 5 + i }); // start with sunday (0)
			});

			dates.forEach((date, i) => {
				const result: string = date.format(FormatToken.DayOfWeekStringShort);

				expect(result).to.be.lengthOf(2);
				expect(result).to.be.eql(defaultLocaleSet.DayOfWeekShort[i]);
			});
		});

		it(FormatToken.DayOfWeekStringMiddle, () => {
			const dates: DateTime[] = newArray(7, (i: number): DateTime => {
				return new DateTime({ year: 2020, month: 1, date: 5 + i }); // start with sunday (0)
			});

			dates.forEach((date, i) => {
				const result: string = date.format(FormatToken.DayOfWeekStringMiddle);

				expect(result).to.be.lengthOf(3);
				expect(result).to.be.eql(defaultLocaleSet.DayOfWeekMiddle[i]);
			});
		});

		it(FormatToken.DayOfWeekStringLong, () => {
			const dates: DateTime[] = newArray(7, (i: number): DateTime => {
				return new DateTime({ year: 2020, month: 1, date: 5 + i }); // start with sunday (0)
			});

			dates.forEach((date, i) => {
				const result: string = date.format(FormatToken.DayOfWeekStringLong);

				expect(result).to.be.eql(defaultLocaleSet.DayOfWeekLong[i]);
			});
		});
	});

	describe('meridiem', () => {
		let defaultLocaleSet: LocaleSet;

		before(async () => {
			defaultLocaleSet = await loadLocaleFile(DefaultLocale);
			DateTime.locale(DefaultLocale);

			await wait();
		});

		it(FormatToken.MeridiemLower, () => {
			const hoursArr: number[] = newArray(24, (i: number): number => i); // 0 ~ 23

			hoursArr.forEach((hours: number): void => {
				const date: DateTime = new DateTime({
					hours
				});

				expect(date.format(FormatToken.MeridiemLower)).to.be.eql(
					hours < 12
						? defaultLocaleSet.Meridiem[0].toLowerCase()
						: defaultLocaleSet.Meridiem[1].toLowerCase()
				);
			});
		});

		it(FormatToken.MeridiemCapital, () => {
			const hoursArr: number[] = newArray(24, (i: number): number => i); // 0 ~ 23

			hoursArr.forEach((hours: number): void => {
				const date: DateTime = new DateTime({
					hours
				});

				expect(date.format(FormatToken.MeridiemCapital)).to.be.eql(
					hours < 12
						? defaultLocaleSet.Meridiem[0].toUpperCase()
						: defaultLocaleSet.Meridiem[1].toUpperCase()
				);
			});
		});
	});

	describe('hours', () => {
		it(FormatToken.Hours24, () => {
			const hoursArr: number[] = newArray(24, (i: number): number => {
				return i; // 0 ~ 23
			});

			hoursArr.forEach((hours: number): void => {
				const date: DateTime = new DateTime({ hours });

				const result: string = date.format(FormatToken.Hours24);

				expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
				expect(result).to.be.eql('' + hours);
			});
		});


		it(FormatToken.Hours24Padded, () => {
			const hoursArr: number[] = newArray(24, (i: number): number => {
				return i; // 0 ~ 23
			});

			hoursArr.forEach((hours: number): void => {
				const date: DateTime = new DateTime({ hours });

				const result: string = date.format(FormatToken.Hours24Padded);

				expect(result).to.be.lengthOf(2);
				expect(result).to.be.eql(padDigit(hours, 2));
			});
		});

		it(FormatToken.Hours12, () => {
			const hoursArr: number[] = newArray(24, (i: number): number => {
				return i; // 0 ~ 23
			});

			hoursArr.forEach((hours: number): void => {
				const date: DateTime = new DateTime({ hours });

				const result: string = date.format(FormatToken.Hours12);

				expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
				expect(result).to.be.eql('' + (hours > 12 ? hours % 12 : hours));
			});
		});

		it(FormatToken.Hours12Padded, () => {
			const hoursArr: number[] = newArray(24, (i: number): number => {
				return i; // 0 ~ 23
			});

			hoursArr.forEach((hours: number): void => {
				const date: DateTime = new DateTime({ hours });

				const result: string = date.format(FormatToken.Hours12Padded);

				expect(result).to.be.lengthOf(2);
				expect(result).to.be.eql(padDigit(hours > 12 ? hours % 12 : hours, 2));
			});
		});
	});

	describe('minutes', () => {
		it(FormatToken.Minutes, () => {
			const minutesArr: number[] = newArray(60, (i: number): number => {
				return i; // 0 ~ 59
			});

			minutesArr.forEach((minutes: number): void => {
				const date: DateTime = new DateTime({ minutes });

				const result: string = date.format(FormatToken.Minutes);

				expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
				expect(result).to.be.eql('' + minutes);
			});
		});


		it(FormatToken.MinutesPadded, () => {
			const minutesArr: number[] = newArray(60, (i: number): number => {
				return i; // 0 ~ 59
			});

			minutesArr.forEach((minutes: number): void => {
				const date: DateTime = new DateTime({ minutes });

				const result: string = date.format(FormatToken.MinutesPadded);

				expect(result).to.be.lengthOf(2);
				expect(result).to.be.eql(padDigit(minutes, 2));
			});
		});
	});

	describe('seconds', () => {
		it(FormatToken.Seconds, () => {
			const secondsArr: number[] = newArray(60, (i: number): number => {
				return i; // 0 ~ 59
			});

			secondsArr.forEach((seconds: number): void => {
				const date: DateTime = new DateTime({ seconds });

				const result: string = date.format(FormatToken.Seconds);

				expect(result).to.be.lengthOf(+result < 10 ? 1 : 2);
				expect(result).to.be.eql('' + seconds);
			});
		});


		it(FormatToken.SecondsPadded, () => {
			const secondsArr: number[] = newArray(60, (i: number): number => {
				return i; // 0 ~ 59
			});

			secondsArr.forEach((seconds: number): void => {
				const date: DateTime = new DateTime({ seconds });

				const result: string = date.format(FormatToken.SecondsPadded);

				expect(result).to.be.lengthOf(2);
				expect(result).to.be.eql(padDigit(seconds, 2));
			});
		});
	});

	describe('ms', () => {
		it(FormatToken.MilliSeconds, () => {
			const msArr: number[] = newArray(999, (i: number): number => {
				return i; // 0 ~ 999
			});

			msArr.forEach((ms: number): void => {
				const date: DateTime = new DateTime({ ms });

				const result: string = date.format(FormatToken.MilliSeconds);

				expect(result).to.be.lengthOf(+result < 10 ? 1 : (+result < 100 ? 2 : 3));
				expect(result).to.be.eql('' + ms);
			});
		});


		it(FormatToken.MilliSecondsPadded2, () => {
			const msArr: number[] = newArray(999, (i: number): number => {
				return i; // 0 ~ 999
			});

			msArr.forEach((ms: number): void => {
				const date: DateTime = new DateTime({ ms });

				const result: string = date.format(FormatToken.MilliSecondsPadded2);

				expect(result).to.be.lengthOf(2);
				expect(result).to.be.eql(padDigit(ms < 100 ? ms : Math.floor(ms / 10), 2));
			});
		});

		it(FormatToken.MilliSecondsPadded3, () => {
			const msArr: number[] = newArray(999, (i: number): number => {
				return i; // 0 ~ 999
			});

			msArr.forEach((ms: number): void => {
				const date: DateTime = new DateTime({ ms });

				const result: string = date.format(FormatToken.MilliSecondsPadded3);

				expect(result).to.be.lengthOf(3);
				expect(result).to.be.eql(padDigit(ms, 3));
			});
		});
	});
};
