import { LocaleSet, String12, String7 } from '../interfaces';
import { FormatToken } from '../constants';

const months : String12 = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

const weekDaysShort : String7 = ['일', '월', '화', '수', '목', '금', '토'];

const localeDateFormat : string = `${ FormatToken.Year }. ${ FormatToken.Month }. ${ FormatToken.DayOfMonth }.`;
const localeTimeFormat : string = `${ FormatToken.MeridiemCapital } ${ FormatToken.Hours12 }:${ FormatToken.MinutesPadded }:${ FormatToken.SecondsPadded }`;

export const locale : LocaleSet = {
	MonthShort : months,
	MonthLong : months,

	DayOfWeekShort : weekDaysShort,
	DayOfWeekMiddle : weekDaysShort,
	DayOfWeekLong : ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],

	Meridiem : ['오전', '오후'],

	LocaleDateTimeFormat : localeDateFormat + ' ' + localeTimeFormat,
	LocaleDateFormat : localeDateFormat,
	LocaleTimeFormat : localeTimeFormat
};
