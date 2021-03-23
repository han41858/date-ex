![npm](https://img.shields.io/npm/v/@han41858/date-ex?logo=npm)

# date-ex

[한국어](https://github.com/han41858/date-ex/blob/master/README-KR.md)

Extensions for Date class.

This library is extensions for JavaScript `Date` class. If you use this library, you can modify `Date` class more easily
and represent Date in any format.

> `date-ex` is written by TypeScript, and published by JavaScript. So you can use this library in TypeScript code and JavaScript code also.

## Classes

### `DateTime`

Represent date and time.

`DataTime` instance is created with `new` keyword.

```TypeScript
const date : DateTime = new DateTime();
```

If you pass parameter to constructor, you can create instance with specific date. Parameter type supports for `number`
, `string`, `Date`, `DateTime`, [`json` type(`DateTimeParam`)](#DateTimeParam).

```TypeScript
const newDateByNumber : DateTime = new DateTime(1603722868252);

const newDateByString : DateTime = new DateTime('2020-10-26');

const newDateByDate : DateTime = new DateTime(new Date());

const newDateByDateTime : DateTime = new DateTime(new DateTime());

const newDateByDateTimeParam : DateTime = new DateTime({
	year : 2020,
	month : 10,
	date : 26
});
```

### `Duration`

Represents duration.

`Duration` instance is created with `new` keyword.

```TypeScript
const duration : Duration = new Duration();
```

If you pass parameter to constructor, you can create instance with specific duration. Parameter type supports
for `string`, `Duration`, [`json` type(`DurationParam`)](#DurationParam).

```TypeScript
const newDurationByString : Duration = new Duration('PY2');

const newDurationByDuration : Duration = new Duration(new Duration());

const newDurationByDurationParam : Duration = new Duration({
	years : 2
});
```

### `DateTimeParam`

Represent date, time value. This object consists with this fields.

| Field | Field Type | Value Range | Description |
|---|---|---|---|
| `year` | `number` | - | Represents year. |
| `month` | `number` | `1` ~ `12` | Represents month. |
| `date` | `number` | `1` ~ `31` | Represents date. |
| `hours` | `number` | `0` ~ `23` | Represents hours. |
| `minutes` | `number` | `0` ~ `59` | Represents minutes |
| `seconds` | `number` | `0` ~ `59` | Represents seconds |
| `ms` | `number` | `0` ~ `999` | Represents mlliseconds |

* `month` field range is not `0` ~ `11`. This field represent the real month value `1` ~ `12`

### `DateTimeUnit`

Represents date and time unit.

| Token | Field | Type | Description |
|---|---|---|---|
| `DateTimeUnit.Year` | `year` | `number` | Represents year. |
| `DateTimeUnit.Quarter` | `quarter` | `number` | Represents quarter. |
| `DateTimeUnit.Month` | `month` | `number` | Represents month. |
| `DateTimeUnit.Week` | `week` | `number` | Represents week number. |
| `DateTimeUnit.Date` | `date` | `number` | Represents date. |
| `DateTimeUnit.Hours` | `hours` | `number` | Represents hours. |
| `DateTimeUnit.Minutes` | `minutes` | `number` | Represents minutes. |
| `DateTimeUnit.Seconds` | `seconds` | `number` | Represents seconds. |
| `DateTimeUnit.Ms` | `ms` | `number` | Represents milliseconds. |

## Getter

### Basic fields

| Getter | Return type | Value Range | Description | `Date` methods |
|---|---|---|---|---|
| `year` | `number` | - | Returns year. | `Date.getFullYear()` |
| `month` | `number` | `1` ~ `12` | Returns month. | `Date.getMonth()` |
| `date` | `number` | `1` ~ `31` | Returns date. | `Date.getDate()` |
| `day` | `number` | `0` ~ `6` | Returns number of day. | `Date.getDay()` |
| `hours` | `number` | `0` ~ `23` | Returns hours. | `Date.getHours()` |
| `minutes` | `number` | `0` ~ `59` | Returns minutes. | `Date.getMinutes()` |
| `seconds` | `number` | `0` ~ `59` | Returns seconds. | `Date.getSeconds()` |
| `ms` | `number` | `0` ~ `999` | Returns milliseconds. | `Date.getMilliseconds()` |
| `timezoneOffset` | `timezone` | - | Returns timezone offset in minutes unit. | `Date.getTimezoneOffset()` |

* Compared to the `Date` class, `get-` prefix has been omitted for better convenience, uses the getter method not the
  function execution form. For the same reason, `getMilliseconds()` methods is provided as `ms`.

* `month` field range is not `0` ~ `11`. This field represent the real month value `1` ~ `12`

### Extended fields

| Getter | Return type | Value Range | Description |
|---|---|---|---|
| `quarter` | `number` | `1` ~ `4` | Returns quarter of the date. |
| `weekOfYear` | `number` | `1` ~ `53` | Returns the number of week of the date in the year. |
| `weekOfMonth` | `number` | `1` ~ `5` | Returns the number of week of the date in the month. |
| `weeksOfYear` | `number` | `52` ~ `53` | Returns the number of week in year. |
| `weeksOfMonth` | `number` | `4` ~ `6` | Returns the number of week in month. |
| `dayOfYear` | `number` | `1` ~ `365` | Returns the number of day in the year. |
| `daysOfYear` | `number` | `1` ~ `366` | Returns the max number of days in the year. |
| `daysOfMonth` | `number` | `28` ~ `31` | Returns the max number of days in the month. |
| `timezoneOffsetInHours` | `number` | `-12` ~ `14` | Returns the timezone offset in hours unit. |
| `isAm` | `boolean` | `true`/`false` | Returns `true` for the morning and `false` for the afternoon. |
| `hours24` | `number` | `0` ~ `23` | Returns hours in 24 format. Same with `hours`. |
| `hours12` | `number` | `0` ~ `12` | Returns hours in 12 format. |

### UTC fields

Returns date and time in UTC(Coordinated Universal Time). The year, month, date and time may change depending on the
timezone. The minutes, seconds and milliseconds is not affected.

The `timezoneOffset` value in UTC is same with `timezoneOffset` value in `DateTime` instance.

```TypeScript
const date : DateTime = new DateTime();
const utcDate : DateTime = date.UTC;
```

### With another type

| Getter | Return Type | Description |
|---|---|---|
| `valueOf()` | `number` | Returns with Unix timestamp. Same with `+new Date()` and `+new DateTime()` |
| `toDate()` | `Date` | Returns `Date` type. |
| `toISOString()` | `string` | Returns with ISO string. Same with `Date.toISOString()`. |
| `toUTCString()` | `string` | Returns with UTC string. Same with `Date.toUTCString()`. |
| `toJson()` | `object` | Returns with [`DateTimeParam`](#DateTimeParam). |

## Setter

### Basic fields

| Setter | Value Type | Description | `Date` Methods |
|---|---|---|---|
| `year` | `number` | Set year. | `Date.setFullYear()` |
| `month` | `number` | Set month. | `Date.setMonth()` |
| `date` | `number` | Set date. | `Date.setDate()` |
| `hours` | `number` | Set hours. | `Date.setHours()` |
| `minutes` | `number` | Set minutes. | `Date.setMinutes()` |
| `seconds` | `number` | Set seconds. | `Date.setSeconds()` |
| `ms` | `number` | Set milliseconds. | `Date.setMilliseconds()` |

* Compared to the `Date` class, `set-` prefix has been omitted for better convenience, uses the setter method not the
  function execution form. For the same reason, `getMilliseconds()` methods is provided as `ms`.

* If you don't change the year, `month` setter value range is not `0` ~ `11`, but `1` ~ `12`.

### `set(): DateTime`

Set date and time with [`DateTimeParam`](#DateTimeParam). Each field can be omitted.

```typescript
const date : DateTime = new DateTime();

// set with 27-Oct-2020
date.set({
	year : 2020,
	month : 10,
	date : 27
});
```

* If you don't change the year, `month` setter value range is not `0` ~ `11`, but `1` ~ `12`.

### `add(param: DateTimeParam | Duration | DurationParam): DateTime`

> `DateTime` type is not supported.

#### with `DateTimeParam`

Set to a specific date and time. If a value less than 0 is used, the previous date and time are set.

```typescript
const date : DateTime = new DateTime();

// set to after 11 months.
date.add({
	year : 1,
	month : -1
});
```

#### with `Duration`

Set to the date and time moved by the duration.

```typescript
const date : DateTime = new DateTime();
const duration : Duration = new Duration({
	months : 11
});

// set to after 11 months.
date.add(duration);
```

#### with `DurationParam`

Set to the date and time moved by the duration. If a value less than 0 is used, the previous date and time are set.

```typescript
const date : DateTime = new DateTime();

// set to after 11 months.
date.add({
	months : 11
});
```

## `startOf(unit): DateTime`, `endOf(unit): DateTime`

Returns the start/end date and time based on the unit passed as a factor.

```typescript
const date : DateTime = new DateTime();

console.log(date.startOf('year').toISOString()); // 2020-01-01T00:00:00.000Z
console.log(date.endOf('year').toISOString()); // 2020-12-31T23:59:59.999Z
```

## `format(): string`

Returns string with the format.

| Token | Token string | Getter | Description | Value range |
|---|---|---|---|---|
| `FormatToken.YearShort` | `YY` | - | Converts to a 2-digit year. | `00` ~ `20`, ... |
| `FormatToken.Year` | `YYYY` | `year` | Converts to a 4-digit year. | `1970` ~ `2020`, ... |
| `FormatToken.Quarter` | `Q` | `quarter` | Converts to a quarter. | `1` ~ `4` |
| `FormatToken.Month` | `M` | `month` | Converts to a month. | `1` ~ `12` |
| `FormatToken.MonthPadded` | `MM` | - | Converts to a month with 2-digit. | `01` ~ `12` |
| `FormatToken.MonthStringShort` | `MMM` | - | Converts to a short name month. | `Jan` ~ `Dec` |
| `FormatToken.MonthStringLong` | `MMMM` | - | Converts to a long name month. | `January` ~ `December` |
| `FormatToken.Week` | `W` | `weekOfYear` | Converts to a number of the week in year. | `1` ~ `53` |
| `FormatToken.WeekPadded` | `WW` | - | Converts to a number of the week in year in 2-digit. | `01` ~ `53` |
| `FormatToken.WeekPaddedWithPrefix` | `Www` | - | Converts to a number of the week in year in 2-digit with prefix `W`. | `W01` ~ `W53` |
| `FormatToken.DayOfYear` | `DDD` | `dayOfYear` | Converts to a numbef of the day in year. | `1` ~ `365` |
| `FormatToken.DayOfYearPadded` | `DDDD` | - | Converts to a number of the day in year in 3-digit. | `001` ~ `365` |
| `FormatToken.DayOfMonth` | `D` | `dayOfMonth` | Converts to a number of the day in month. | `1` ~ `31` |
| `FormatToken.DayOfMonthPadded` | `DD` | - | Converts to a number of the day in month in 2-digit. | `01` ~ `31` |
| `FormatToken.DayOfWeek` | `d` | `day` | Converts to a number of day. | `0` ~ `6` |
| `FormatToken.DayOfWeekStringShort` | `dd` | - | Converts to a short name day. | `Su` ~ `Sa` |
| `FormatToken.DayOfWeekStringMiddle` | `ddd` | - | Converts to a middle name day. | `Sun` ~ `Sat` |
| `FormatToken.DayOfWeekStringLong` | `dddd` | - | Converts to a long name day. | `Sunday` ~ `Saturday` |
| `FormatToken.MeridiemLower` | `a` | - | Converts to am/pm in lower case. | `am`, `pm` |
| `FormatToken.MeridiemCapital` | `A` | - | Converts to am/pm in upper case. | `AM`, `PM` |
| `FormatToken.Hours24` | `H` | `hours`, `hours24` | Converts to a hours in 24 format. | `0` ~ `23` |
| `FormatToken.Hours24Padded` | `HH` | - | Converts to a hours in 24 format in 2-digit. | `00` ~ `23` |
| `FormatToken.Hours12` | `h` | `hours12` | Converts to a hours in 12 format. | `0` ~ `12` |
| `FormatToken.Hours12Padded` | `hh` | - | Converts to a hours in 12 format in 2-digit. | `00` ~ `12` |
| `FormatToken.Minutes` | `m` | `minutes` | Converts to a minutes. | `0` ~ `59` |
| `FormatToken.MinutesPadded` | `mm` | - | Converts to a minutes in 2-digit. | `00` ~ `59` |
| `FormatToken.Seconds` | `s` | `seconds` | Converts to a seconds. | `0` ~ `59` |
| `FormatToken.SecondsPadded` | `ss` | - | Converts to a seconds in 2-digit. | `00` ~ `59` |
| `FormatToken.MilliSeconds` | `S` | `ms` | Converts to a milliseconds. | `0` ~ `999` |
| `FormatToken.MilliSecondsPadded2` | `SS` | - | Converts to a milliseconds in 2-digit. | `00` ~ `99` |
| `FormatToken.MilliSecondsPadded3` | `SSS` | - | Converts to a milliseconds in 3-digit. | `000` ~ `999`  |

## Internationalization

You can set i18n in global context or each instance. If the setting in global and local is different, i18n is working
with local setting.

If you set i18n value globally, new instances are set with that value.

```typescript
console.log(DateTime.locale()); // 'en'

const date1 : DateTime = new DateTime();
console.log(date1.locale()); // 'en'

DateTime.locale('ko-kr'); // set globally
console.log(DateTime.locale()); // 'ko-kr'

const date2 : DateTime = new DateTime();
console.log(date2.locale()); // 'ko-kr'

const date3 : DateTime = new DateTime();
date3.locale('en'); // set i18n locally
console.log(date3.locale()); // 'en'

```

Global `DateTime.locale()` and `locale()` methods in each instance without parameter returns current i18n value. If you
want to set i18n value, pass language code to `locale()` methods.

Default value is `en`..

### Warning

`locale()` methods uses ES6 `import` function. `import` function is working as `Promise`, so you should wait JavaScript
1 cycle after called `locale()` to load i18n file.

If the language code is invalid or the language file load fails after 1 cycle, the previous value will be restored.

### `DateTime.locale(): string`

Set language in globally.

### `locale(): string`

Set language in locally.

### Language supports

| Language code | Name |
|---|---|
| `en` | English |
| `ko-kr` | Korean (Korea) |

## Compare methods

All compare methods can be received `DateTimeUnit`. The accuracy of the calculation is based on this unit, and if the
unit is omitted, it is calculated in milliseconds.

| Methods | Return type | Description |
|---|---|---|
| `diff()` | `number` | Returns the difference value. |
| `isEqual()` | `boolean` | Returns `true` if the date is same with the parameter. |
| `isBefore()` | `boolean` | Returns `true` if the date is before than parameter. |
| `isBeforeOrEqual()` | `boolean` | Returns `true` if the date is before than or equal with parameter. |
| `isAfter()` | `boolean` | Returns `true` if the date is after than parameter. |
| `isAfterOrEqual()` | `boolean` | Returns `true` if the date is after than or equal with parameter. |
| `isBetween()` | `boolean` | Returns `true` if the date is between with 2 parameters. |
| `isAfterOrEqual()` | `boolean` | Returns `true` if the date is between with 2 parameters or same with one parameter. |

```typescript
const date1 : DateTime = new DateTime({
	year : 2020,
	month : 10,
	date : 20
});

const date2 : DateTime = new DateTime({
	year : 2020,
	month : 10,
	date : 27
});

console.log(date1.diff(date2, 'date')); // -7

console.log(date1.isEqual(date2, 'month')); // true

console.log(date1.isBefore(date2, 'date')); // true
console.log(date1.isBeforeOrEqual(date2, 'month')); // true

console.log(date1.isAfter(date2, 'date')); // false
console.log(date1.isBeforeOrEqual(date2, 'month')); // true

const date3 : DateTime = new DateTime({
	year : 2020,
	month : 10,
	date : 27
});

console.log(date2.isBetween(date1, date3, 'date')); // true
console.log(date2.isBetweenOrEqual(date1, date2, 'date')); // true
```

## Calendar

### `DateTime.getCalendar(): Calendar`

Returns the calendar for the year and month. Time fields are set to `0`.
