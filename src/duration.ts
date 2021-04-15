import { DateTimeParam, DurationParam } from './interfaces';
import { DurationParamKeys, DurationUnit, Gregorian1Month } from './constants';
import { isDateTimeParam, isDurationParam } from './util';
import { DateTime } from './date-time';


export class Duration {

	private readonly values : DurationParam = {};


	constructor (initData? : string | Duration | DurationParam) {
		if (initData !== undefined && initData !== null) {
			if (typeof initData === 'string') {
				const regExp1 = /^P(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?$/; // PnYnMnDTnHnMnS
				const regExp2 = /^P\d+W$/; // PnW

				// P<date>T<time>
				// const regExp3 = /^P\d{8}T\d{4}$/; // PYYYYMMDDThhmmss
				// const regExp4 : RegExp = /^P\d{8}T\d{4}$/; // P[YYYY]-[MM]-[DD]T[hh]:[mm]:[ss]


				if (regExp1.test(initData)) {
					const execResult : RegExpExecArray | null = regExp1.exec(initData);

					if (execResult) {
						const [dateStr, timeStr] = initData // divide date & time for 'M'
							.replace('P', '') // remove starting 'P'
							.split('T');

						[
							{ key : 'years', value : /\d+Y/.exec(dateStr)?.[0]?.replace('Y', '') },
							{ key : 'months', value : /\d+M/.exec(dateStr)?.[0]?.replace('M', '') },
							{ key : 'dates', value : /\d+D/.exec(dateStr)?.[0]?.replace('D', '') },

							{ key : 'hours', value : /\d+H/.exec(timeStr)?.[0]?.replace('H', '') },
							{ key : 'minutes', value : /\d+M/.exec(timeStr)?.[0]?.replace('M', '') },
							{ key : 'seconds', value : /\d+S/.exec(timeStr)?.[0]?.replace('S', '') }
						].forEach((obj) => {
							const key : keyof DurationParam = obj.key as keyof DurationParam;
							const valueStr : string | undefined = obj.value;

							if (valueStr !== undefined) {
								this[key] = +valueStr;
							}

							this.rebalancing();
						});
					}
				}
				else if (regExp2.test(initData)) {
					const weeksStr : string = initData
						.replace(/^P/, '')
						.replace(/W$/, '');

					if (!isNaN(+weeksStr)) {
						this.dates = +weeksStr * 7;

						this.rebalancing();
					}
				}

			}
			else if (initData instanceof Duration) {
				this.values = {
					...initData.values
				};

				this.rebalancing();
			}
			else if (isDurationParam(initData)) {
				Object.entries(initData).forEach(([key, value] : [string, number]) => {
					if (value !== undefined && value !== null) {
						this.values[key as keyof DurationParam] = value;
					}
				});

				this.rebalancing();
			}
		}
	}

	get years () : number | undefined {
		return this.values.years;
	}

	set years (years : number | undefined) {
		this.values.years = years;

		this.rebalancing();
	}

	get months () : number | undefined {
		return this.values.months;
	}

	set months (months : number | undefined) {
		this.values.months = months;

		this.rebalancing();
	}

	get dates () : number | undefined {
		return this.values.dates;
	}

	set dates (dates : number | undefined) {
		this.values.dates = dates;

		this.rebalancing();
	}

	get hours () : number | undefined {
		return this.values.hours;
	}

	set hours (hours : number | undefined) {
		this.values.hours = hours;

		this.rebalancing();
	}

	get minutes () : number | undefined {
		return this.values.minutes;
	}

	set minutes (minutes : number | undefined) {
		this.values.minutes = minutes;

		this.rebalancing();
	}

	get seconds () : number | undefined {
		return this.values.seconds;
	}

	set seconds (seconds : number | undefined) {
		this.values.seconds = seconds;

		this.rebalancing();
	}

	get ms () : number | undefined {
		return this.values.ms;
	}

	set ms (ms : number | undefined) {
		this.values.ms = ms;

		this.rebalancing();
	}

	private rebalancing () : void {
		const repeatArr : [DurationUnit, number][] = [
			[DurationUnit.Ms, 1000],
			[DurationUnit.Seconds, 60],
			[DurationUnit.Minutes, 60],
			[DurationUnit.Hours, 24],

			[DurationUnit.Dates, Gregorian1Month],
			[DurationUnit.Months, 12],
			[DurationUnit.Years, 0] // 0 means nothing
		];

		repeatArr.forEach(([unit, divider] : [DurationUnit, number], i : number, arr) => {
			const key : keyof DurationParam = unit as keyof DurationParam;
			const value : number | undefined = this.values[key];

			if (value !== undefined && i < arr.length - 1) {
				const nextKey : keyof DurationParam = arr[i + 1][0] as keyof DurationParam;

				if (value < 0) {
					const nextDown : number = Math.ceil(-value / 1000);

					this.values[nextKey] = (this.values[nextKey] || 0) - nextDown;
					(this.values[key] as number) += nextDown * divider;
				}

				if (value >= divider) {
					const nextUp : number = Math.floor(value / divider);

					this.values[nextKey] = (this.values[nextKey] || 0) + nextUp;
					(this.values[key] as number) -= nextUp * divider;
				}
			}
		});

		// remove undefined field
		Object.entries(this.values).forEach(([key, value] : [string, number]) => {
			if (value === undefined || value === 0) {
				delete this.values[key as keyof DurationParam];
			}
		});

		// check net duration
		const firstKey : string | undefined = DurationParamKeys.find(key => {
			return !!this.values[key as keyof DurationParam];
		});

		if (firstKey) {
			const value : number | undefined = this.values[firstKey as keyof DurationParam];

			if (value !== undefined && value < 0) {
				throw new Error('net duration should be positive value');
			}
		}
	}

	add (param : Duration | DurationParam) : Duration;
	add (param : DateTime | DateTimeParam) : DateTime;
	add (param : Duration | DurationParam | DateTime | DateTimeParam) : Duration | DateTime {
		let result ! : Duration | DateTime;

		if (param instanceof Duration
			|| isDurationParam(param)) {
			const initDurationParam : DurationParam = {
				years : (this.years || 0) + (param.years || 0),
				months : (this.months || 0) + (param.months || 0),
				dates : (this.dates || 0) + (param.dates || 0),

				hours : (this.hours || 0) + (param.hours || 0),
				minutes : (this.minutes || 0) + (param.minutes || 0),
				seconds : (this.seconds || 0) + (param.seconds || 0),
				ms : (this.ms || 0) + (param.ms || 0)
			};

			result = new Duration(initDurationParam);
		}
		else if (param instanceof DateTime
			|| isDateTimeParam(param)) {
			const initDateTimeParam : DateTimeParam = {
				year : (param.year || 0) + (this.years || 0),
				month : (param.month || 0) + (this.months || 0),
				date : (param.date || 0) + (this.dates || 0),

				hours : (param.hours || 0) + (this.hours || 0),
				minutes : (param.minutes || 0) + (this.minutes || 0),
				seconds : (param.seconds || 0) + (this.seconds || 0),
				ms : (param.ms || 0) + (this.ms || 0)
			};

			result = new DateTime(initDateTimeParam);
		}

		return result;
	}

}
