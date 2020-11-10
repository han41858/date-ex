import { DurationParam } from './interfaces';
import { Gregorian1Month } from './constants';
import { isDurationParam } from './util';


export class Duration {

	private readonly values : DurationParam = {};


	constructor (initData? : string | Duration | DurationParam) {
		if (initData !== undefined && initData !== null) {
			if (typeof initData === 'string') {
				const regExp1 : RegExp = /^P(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?$/; // PnYnMnDTnHnMnS
				const regExp2 : RegExp = /^P\d+W$/; // PnW

				// P<date>T<time>
				const regExp3 : RegExp = /^P\d{8}T\d{4}$/; // PYYYYMMDDThhmmss
				// const regExp4 : RegExp = /^P\d{8}T\d{4}$/; // P[YYYY]-[MM]-[DD]T[hh]:[mm]:[ss]


				if (regExp1.test(initData)) {
					const execResult : RegExpExecArray | null = regExp1.exec(initData);

					if (!!execResult) {
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
							const key : keyof Duration = obj.key as keyof Duration;
							const valueStr : string | undefined = obj.value;

							if (valueStr !== undefined) {
								this[key] = +valueStr;
							}

							this.rebalancing();
						});
					}
				}
				// else if(regExp2.test(initData)){
				//
				// }

			}
			else if (initData instanceof Duration) {
				this.values = {
					...initData.values
				};
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
		// DurationSetParamKeys.reverse().forEach((key, i) => {
		// 	if (this.values[key] !== undefined) {
		// 		const value : number = this.values[key] as number;
		//
		// 		if (value < 0) {
		// 			const upperDown : number = Math.floor(-value / CalcMatrix[key][key + i]);
		// 		}
		// 	}
		// });

		if (this.values.ms !== undefined) {
			if (this.values.ms < 0) {
				const secondsDown : number = Math.floor(-this.values.ms / 1000);

				this.values.seconds = (this.values.seconds || 0) - secondsDown;
				this.values.ms += secondsDown * 1000;
			}

			if (this.values.ms >= 1000) {
				const secondsUp : number = Math.floor(this.values.ms / 1000);

				this.values.seconds = (this.values.seconds || 0) + secondsUp;
				this.values.ms -= secondsUp * 1000;
			}
		}

		if (this.values.seconds !== undefined) {
			if (this.values.seconds < 0) {
				const minutesDown : number = Math.floor(-this.values.seconds / 60);

				this.values.minutes = (this.values.minutes || 0) - minutesDown;
				this.values.seconds += minutesDown * 60;
			}

			if (this.values.seconds >= 60) {
				const minutesUp : number = Math.floor(this.values.seconds / 60);

				this.values.minutes = (this.values.minutes || 0) + minutesUp;
				this.values.seconds -= minutesUp * 60;
			}
		}

		if (this.values.minutes !== undefined) {
			if (this.values.minutes < 0) {
				const hoursDown : number = Math.floor(-this.values.minutes / 60);

				this.values.hours = (this.values.hours || 0) - hoursDown;
				this.values.minutes += hoursDown * 60;
			}

			if (this.values.minutes >= 60) {
				const hoursUp : number = Math.floor(this.values.minutes / 60);

				this.values.hours = (this.values.hours || 0) + hoursUp;
				this.values.minutes -= hoursUp * 60;
			}
		}

		if (this.values.hours !== undefined) {
			if (this.values.hours < 0) {
				const datesDown : number = Math.floor(-this.values.hours / 24);

				this.values.dates = (this.values.dates || 0) - datesDown;
				this.values.hours += datesDown * 24;
			}

			if (this.values.hours >= 24) {
				const datesUp : number = Math.floor(this.values.hours / 24);

				this.values.dates = (this.values.dates || 0) + datesUp;
				this.values.hours -= datesUp * 24;
			}
		}

		if (this.values.dates !== undefined) {
			const datesToMonth : number = Gregorian1Month;

			if (this.values.dates < 0) {
				const monthsDown : number = Math.floor(-this.values.dates / datesToMonth);

				this.values.months = (this.values.months || 0) - monthsDown;
				this.values.dates += monthsDown * datesToMonth;
			}

			if (this.values.dates >= 24) {
				const monthsUp : number = Math.floor(this.values.dates / datesToMonth);

				this.values.months = (this.values.months || 0) + monthsUp;
				this.values.dates -= monthsUp * datesToMonth;
			}
		}

		if (this.values.months !== undefined) {
			if (this.values.months < 0) {
				const yearsDown : number = Math.floor(-this.values.months / 12);

				this.values.years = (this.values.years || 0) - yearsDown;
				this.values.months += yearsDown * 12;
			}

			if (this.values.months >= 12) {
				const yearsUp : number = Math.floor(this.values.months / 12);

				this.values.years = (this.values.years || 0) + yearsUp;
				this.values.months -= yearsUp * 12;
			}
		}

		Object.entries(this.values).forEach(([key, value] : [string, number]) => {
			if (value === undefined || value === 0) {
				delete this.values[key as keyof DurationParam];
			}
		});
	}

}
