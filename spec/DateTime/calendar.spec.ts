import { expect } from 'chai';

import { DateTime } from '../../src/date-time';
import { MonthCalendar, YearCalendar } from '../../src/interfaces';
import { newArray } from '../../src/util';


export const calendarSpec = (): void => {
	describe('getYearCalendar()', () => {
		it('ok', () => {
			const today: DateTime = new DateTime();

			const calendar: YearCalendar = today.getYearCalendar();

			expect(calendar).to.be.ok;

			expect(calendar).to.have.property('year', today.year);

			expect(calendar).to.have.property('dates');
			expect(calendar.dates).to.be.instanceOf(Array);
			expect(calendar.dates).to.be.lengthOf(today.daysInYear);

			calendar.dates.forEach((calendarDate: DateTime, i: number) => {
				expect(calendarDate.year).to.be.eql(today.year, 'year');

				const date: DateTime = new DateTime({
					year: today.year,
					month: 1,
					date: i + 1
				});

				expect(calendarDate.month).to.be.eql(date.month, 'month');
				expect(calendarDate.date).to.be.eql(date.date, 'date');

				expect(calendarDate.hours).to.be.eql(0, 'hours');
				expect(calendarDate.minutes).to.be.eql(0, 'minutes');
				expect(calendarDate.seconds).to.be.eql(0, 'seconds');
				expect(calendarDate.ms).to.be.eql(0, 'ms');
			});
		});
	});

	describe('getMonthCalendar()', () => {
		it('ok', () => {
			const today: DateTime = new DateTime();

			const dates: DateTime[] = newArray<DateTime>(12, (i: number): DateTime => {
				return new DateTime({
					year: today.year,
					month: i + 1
				});
			});

			dates.forEach((date: DateTime): void => {
				const calendar: MonthCalendar = date.getMonthCalendar();

				expect(calendar).to.be.ok;

				expect(calendar).to.have.property('year', date.year);
				expect(calendar).to.have.property('month', date.month);

				expect(calendar).to.have.property('dates');
				expect(calendar.dates).to.be.instanceOf(Array);
				expect(calendar.dates).to.be.lengthOf(date.lastDate);

				calendar.dates.forEach((calendarDate: DateTime, i: number) => {
					expect(calendarDate.year).to.be.eql(date.year, 'year');
					expect(calendarDate.month).to.be.eql(date.month, 'month');
					expect(calendarDate.date).to.be.eql(i + 1, 'date');

					expect(calendarDate.hours).to.be.eql(0, 'hours');
					expect(calendarDate.minutes).to.be.eql(0, 'minutes');
					expect(calendarDate.seconds).to.be.eql(0, 'seconds');
					expect(calendarDate.ms).to.be.eql(0, 'ms');
				});
			});
		});
	});
};