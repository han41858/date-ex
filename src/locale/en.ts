import { LocaleSet } from '../interfaces';
import { FormatToken } from '../constants';

const localeDateFormat = `${ FormatToken.Month }/${ FormatToken.DayOfMonth }/${ FormatToken.Year }`;
const localeTimeFormat = `${ FormatToken.Hours12 }:${ FormatToken.MinutesPadded }:${ FormatToken.SecondsPadded } ${ FormatToken.MeridiemCapital }`;

export const locale : LocaleSet = {
	MonthShort : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	MonthLong : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

	DayOfWeekShort : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
	DayOfWeekMiddle : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	DayOfWeekLong : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

	Meridiem : ['AM', 'PM'],

	LocaleDateTimeFormat : localeDateFormat + ', ' + localeTimeFormat,
	LocaleDateFormat : localeDateFormat,
	LocaleTimeFormat : localeTimeFormat
};
