![npm](https://img.shields.io/npm/v/@han41858/date-ex?logo=npm)

# DateEx

Date 클래스 확장 패키지

이 라이브러리는 `JavaScript` `Date` 객체를 확장한 것입니다. 이 라이브러리를 활용하면 날짜 객체를 원하는 형식으로 표현할 수 있으며, `Date` 객체를 보다 쉽고 자유롭게 사용할 수 있습니다.

> `date-ex` 는 TypeScript로 작성되었으며 JavaScript 코드로 컴파일되어 배포됩니다. 따라서 TypeScript 문법으로 사용할 수도 있고 JavaScript 문법으로 사용할 수도 있습니다.


<!-- ## 목록 -->

## `DateTime`

일자와 시각을 표현합니다.

`DateTime` 객체는 `new` 생성자로 생성합니다.

```TypeScript
const date: DateTime = new DateTime();
```

생성자에 인자를 전달하면 원하는 날짜를 지정하며 인스턴스를 생성할 수 있습니다. 이 때 인자는 `undefined`, `null`, `number`, `string`, `Date`, `DateTime`
, [`json` 타입(`DateTimeParam`)](#DateTimeParam)을 지원합니다.

```TypeScript
const newDateByNumber: DateTime = new DateTime(1603722868252);

const newDateByString: DateTime = new DateTime('2020-10-26');

const newDateByDate: DateTime = new DateTime(new Date());

const newDateByDateTime: DateTime = new DateTime(new DateTime());

const newDateByDateTimeParam: DateTime = new DateTime({
	year: 2020,
	month: 10,
	date: 26
});
```

### 값 가져오기 - 기본 필드

| 게터 | 반환 타입 | 값 범위 | 설명 | `Date` 함수 |
|---|---|---|---|---|
| `year` | `number` | - | 연도를 반환합니다. | `Date.getFullYear()` |
| `month` | `number` | `1` ~ `12` | 월을 반환합니다. | `Date.getMonth()` |
| `date` | `number` | `1` ~ `31` | 일자를 반환합니다. | `Date.getDate()` |
| `day` | `number` | `0` ~ `6` | 요일에 해당하는 숫자를 반환합니다. | `Date.getDay()` |
| `hours` | `number` | `0` ~ `23` | 시각을 반환합니다. | `Date.getHours()` |
| `minutes` | `number` | `0` ~ `59` | 분을 반환합니다. | `Date.getMinutes()` |
| `seconds` | `number` | `0` ~ `59` | 초를 반환합니다. | `Date.getSeconds()` |
| `ms` | `number` | `0` ~ `999` | 밀리초를 반환합니다. | `Date.getMilliseconds()` |
| `timezoneOffset` | `timezone` | - | 타임존 오프셋을 분 단위로 반환합니다. | `Date.getTimezoneOffset()` |

* `Date` 객체와 비교해보면 편의성을 위해 `get-` 접두사를 생략했으며 함수 실행 형태가 아니라 getter 방식을 사용합니다. 같은 이유로 `getMilliseconds()`는 `ms`로 제공합니다.

* `month` 게터는 `0` ~ `11` 값을 반환하지 않습니다. 이 필드는 실제 월 값 `1` ~ `12`를 반환합니다.

### 값 가져오기 - 확장 필드

| 게터                      | 반환 타입 | 값 범위 | 설명                                 |
|-------------------------|---|---|------------------------------------|
| `quarter`               | `number` | `1` ~ `4` | 분기를 반환합니다.                         |
| `weekOfYear`            | `number` | `1` ~ `53` | 해당 연도를 기준으로 몇주차인지 반환합니다.           |
| `weekOfMonth`           | `number` | `1` ~ `5` | 해당 월을 기준으로 몇주차인지 반환합니다.            |
| `weeksOfYear`           | `number` | `52` ~ `53` | 해당 연도의 최대 주차수를 반환합니다.              |
| `weeksOfMonth`          | `number` | `4` ~ `6` | 해당 월의 최대 주차수를 반환합니다.               |
| `dayOfYear`             | `number` | `1` ~ `365` | 해당 연도를 기준으로 몇일차인지 반환합니다.           |
| `daysOfYear`            | `number` | `1` ~ `366` | 해당 연도의 일자 개수를 반환합니다.               |
| `lastDate`              | `number` | `28` ~ `31` | 해당 월의 마지막 일자를 반환합니다.          |
| `timezoneOffsetInHours` | `number` | `-12` ~ `14` | 타임존 오프셋을 시각 단위로 반환합니다.             |
| `isAm`                  | `boolean` | `true`/`false` | 오전이면 `true`, 오후이면 `false`를 반환합니다.  |
| `hours24`               | `number` | `0` ~ `23` | 24시 기준으로 시각을 반환합니다. `hours`와 같습니다. |
| `hours12`               | `number` | `0` ~ `12` | 12시 기준으로 시각을 반환합니다.                |

### UTC 필드

일자, 시각을 UTC(협정 세계표준시, Coordinated Universal Time)로 변환한 `DateTime`를 반환합니다. 타임존에 따라 연도, 월, 일자, 시각이 변경될 수 있습니다. 분, 초, 밀리초는
영향을 받지 않습니다.

UTC로 받은 객체의 `timezoneOffset`은 기존 `DateTime` 객체의 `timezoneOffset` 값과 같습니다.

```TypeScript
const date: DateTime = new DateTime();
const utcDate: DateTime = date.UTC;
```

### 변환 함수

| 게터 | 반환 타입 | 설명 |
|---|---|---|
| `valueOf()` | `number` | 유닉스 타임스탬프를 반환합니다. `+new Date()`와 같으며 `+new DateTime()`로 사용할 수 있습니다. |
| `toDate()` | `Date` | `Date` 형식을 반환합니다. |
| `toISOString()` | `string` | ISO 문자열 형식을 반환합니다. `Date.toISOString()`과 같습니다. |
| `toUTCString()` | `string` | UTC 문자열 형식을 반환합니다. `Date.toUTCString()`과 같습니다. |
| `toJson()` | `object` | [`DateTimeParam`](#DateTimeParam) 형식을 반환합니다. |

### 값 설정하기 - 개별 필드

| 세터 | 인자 타입 | 설명 | `Date` 함수 |
|---|---|---|---|
| `year` | `number` | 연도를 설정합니다. | `Date.setFullYear()` |
| `month` | `number` | 월을 설정합니다. | `Date.setMonth()` |
| `date` | `number` | 일자를 설정합니다. | `Date.setDate()` |
| `hours` | `number` | 시각을 설정니다. | `Date.setHours()` |
| `minutes` | `number` | 분을 설정합니다. | `Date.setMinutes()` |
| `seconds` | `number` | 초를 설정합니다. | `Date.setSeconds()` |
| `ms` | `number` | 밀리초를 설정합니다. | `Date.setMilliseconds()` |

* `Date` 객체와 비교해보면 편의성을 위해 `set-` 접두사를 생략했으며 함수 실행 형태가 아니라 setter 타입을 사용합니다. 같은 이유로 `setMilliseconds()`는 `ms`로 제공합니다.

* 연도를 변경하지 않는다면 `month` 세터는 `0` ~ `11` 값이 아니라 실제 월 값 `1` ~ `12`로 지정합니다.

### `set(): DateTime`

[`DateTimeParam`](#DateTimeParam) 형식으로 일자, 시각을 설정합니다. 각 필드는 생략할 수 있습니다.

```typescript
const date: DateTime = new DateTime();

// 2020년 10월 27일로 설정합니다.
date.set({
	year: 2020,
	month: 10,
	date: 27
});
```

* 연도를 변경하지 않는다면 `month` 세터는 `0` ~ `11` 값이 아니라 실제 월 값 `1` ~ `12`로 지정합니다.

### `add(param: DateTimeParam | Duration | DurationParam): DateTime`

> `DateTime` 타입은 사용할 수 없습니다.

#### `DateTimeParam`을 사용할 때

특정 일자, 시각으로 설정합니다. 0보다 작은 값을 사용하면 이전 일자, 시각으로 설정합니다.

```typescript
const date: DateTime = new DateTime();

// 11개월 뒤로 일자를 설정합니다.
date.add({
	year: 1,
	month: -1
});
```

#### `Duration`을 사용할 때

기간만큼 이동한 일자, 시각으로 설정합니다. 0보다 작은 값을 사용하면 이전 일자, 시각으로 설정합니다.

```typescript
const date: DateTime = new DateTime();
const duration: Duration = new Duration({
	months: 11
});

// 11개월 뒤로 일자를 설정합니다.
date.add(duration);
```

#### `DurationParam`을 사용할 때

기간만큼 이동한 일자, 시각으로 설정합니다. 0보다 작은 값을 사용하면 이전 일자, 시각으로 설정합니다.

```typescript
const date: DateTime = new DateTime();

// 11개월 뒤로 일자를 설정합니다.
date.add({
	months: 11
});
```

### `startOf(unit): DateTime`, `endOf(unit): DateTime`

인자로 전달한 단위 기준으로 처음/끝 시각을 반환합니다.

unit: `year`, `quarter`, `month`, `week`, `date`, `hours`, `minutes`, `seconds`, `ms`

```typescript
const date: DateTime = new DateTime();

console.log(date.startOf('year').toISOString()); // 2020-01-01T00:00:00.000Z
console.log(date.endOf('year').toISOString()); // 2020-12-31T23:59:59.999Z
```

### `format(): string`

주어진 형식으로 문자열을 구성합니다.

| 토큰 | 토큰 문자열 | 게터 | 설명 | 값 범위 |
|---|---|---|---|---|
| `FormatToken.YearShort` | `YY` | - | 2자리 연도로 변환합니다. | `00` ~ `20`, ... |
| `FormatToken.Year` | `YYYY` | `year` | 4자리 연도로 변환합니다. | `1970` ~ `2020`, ... |
| `FormatToken.Quarter` | `Q` | `quarter` | 분기로 변환합니다. | `1` ~ `4` |
| `FormatToken.Month` | `M` | `month` | 월로 변환합니다. | `1` ~ `12` |
| `FormatToken.MonthPadded` | `MM` | - | 2자리를 채운 월로 변환합니다. | `01` ~ `12` |
| `FormatToken.MonthStringShort` | `MMM` | - | 짧은 이름 월로 변환합니다. | `Jan` ~ `Dec` |
| `FormatToken.MonthStringLong` | `MMMM` | - | 긴 이름 월로 변환합니다. | `January` ~ `December` |
| `FormatToken.Week` | `W` | `weekOfYear` | 연기준 주차를 반환합니다. | `1` ~ `53` |
| `FormatToken.WeekPadded` | `WW` | - | 2자리를 채운 연기준 주차를 반환합니다. | `01` ~ `53` |
| `FormatToken.WeekPaddedWithPrefix` | `Www` | - | 2자리를 채운 연기준 주차에 접두사 `W`를 붙여서 반환합니다. | `W01` ~ `W53` |
| `FormatToken.DayOfYear` | `DDD` | `dayOfYear` | 연기준 일차수로 변환합니다. | `1` ~ `365` |
| `FormatToken.DayOfYearPadded` | `DDDD` | - | 3자리를 채운 연기준 일차수로 변환합니다. | `001` ~ `365` |
| `FormatToken.DayOfMonth` | `D` | `dayOfMonth` | 월기준 일차수로 변환합니다. | `1` ~ `31` |
| `FormatToken.DayOfMonthPadded` | `DD` | - | 2자리를 채운 월기준 일차수로 변환합니다. | `01` ~ `31` |
| `FormatToken.DayOfWeek` | `d` | `day` | 요일에 해당하는 숫자로 변환합니다. | `0` ~ `6` |
| `FormatToken.DayOfWeekStringShort` | `dd` | - | 짧은 이름 요일로 변환합니다. | `Su` ~ `Sa` |
| `FormatToken.DayOfWeekStringMiddle` | `ddd` | - | 중간 이름 요일로 변환합니다. | `Sun` ~ `Sat` |
| `FormatToken.DayOfWeekStringLong` | `dddd` | - | 긴 이름 요일로 변환합니다. | `Sunday` ~ `Saturday` |
| `FormatToken.MeridiemLower` | `a` | - | 오전/오후를 소문자로 변환합니다. | `am`, `pm` |
| `FormatToken.MeridiemCapital` | `A` | - | 오전/오후를 대문자로 변환합니다. | `AM`, `PM` |
| `FormatToken.Hours24` | `H` | `hours`, `hours24` | 24시 기준 시각으로 변환합니다. | `0` ~ `23` |
| `FormatToken.Hours24Padded` | `HH` | - | 2자리를 채운 24시 기준 시각으로 변환합니다. | `00` ~ `23` |
| `FormatToken.Hours12` | `h` | `hours12` | 12시 기준 시각으로 변환합니다. | `0` ~ `12` |
| `FormatToken.Hours12Padded` | `hh` | - | 2자리를 채운 12시 기준 시각으로 변환합니다. | `00` ~ `12` |
| `FormatToken.Minutes` | `m` | `minutes` | 분으로 변환합니다. | `0` ~ `59` |
| `FormatToken.MinutesPadded` | `mm` | - | 2자리를 채운 분으로 변환합니다. | `00` ~ `59` |
| `FormatToken.Seconds` | `s` | `seconds` | 초로 변환합니다. | `0` ~ `59` |
| `FormatToken.SecondsPadded` | `ss` | - | 2자리를 채운 초로 변환합니다. | `00` ~ `59` |
| `FormatToken.MilliSeconds` | `S` | `ms` | 밀리초로 변환합니다. | `0` ~ `999` |
| `FormatToken.MilliSecondsPadded2` | `SS` | - | 2자리를 채운 밀리초로 변환합니다. | `00` ~ `99` |
| `FormatToken.MilliSecondsPadded3` | `SSS` | - | 3자리를 채운 밀리초로 변환합니다. | `000` ~ `999`  |

### 다국어

`DateTime`의 다국어 설정은 전역으로 설정할 수 있으며, 개별 객체에 설정할 수도 있습니다. 전역에 설정된 다국어와 개별 객체에 설정된 다국어가 다르면 개별 객체에 설정된 다국어를 기준으로 동작합니다.

전역 설정으로 다국어를 변경한 이후 생성하는 `DateTime` 객체에는 전역 설정값이 적용됩니다.

```typescript
console.log(DateTime.locale()); // 'en'

const date1: DateTime = new DateTime();
console.log(date1.locale()); // 'en'

DateTime.locale('ko-kr'); // 전역 다국어 설정
console.log(DateTime.locale()); // 'ko-kr'

const date2: DateTime = new DateTime();
console.log(date2.locale()); // 'ko-kr'

const date3: DateTime = new DateTime();
date3.locale('en'); // 객체 다국어 설정
console.log(date3.locale()); // 'en'

```

전역 함수 `DateTime.locale()`과 `DateTime` 클래스 함수 `locale()`을 인자없이 사용하면 현재 설정된 다국어 코드를 반환합니다. 그리고 전역/객체의 다국어를
변경하려면 `locale()` 함수에 다국어 코드를 전달하면 됩니다.

기본 설정은 `en` 입니다.

#### 주의

`locale()` 함수는 ES6 `import` 함수를 사용합니다. 이 함수는 `Promise` 방식으로 동작하기 때문에 `locale()`을 실행한 후에는 JavaScript 1 싸이클을 기다려야 다국어 파일이
로드됩니다.
다국어 파일 로드가 끝났는지 확인하려면 `isLocaleLoaded` 값을 확인하세요.

다국어 코드가 유효하지 않거나 다국어 파일 로드를 실패하면 이전값으로 원복됩니다.

### `DateTime.locale(): string`

전역 변수로 다국어를 설정합니다.

### `locale(): string`

객체에 다국어를 설정합니다.

### 다국어 지원 목록

| 언어 코드 | 이름 |
|---|---|
| `en` | English |
| `ko-kr` | Korean (Korea) |

### 비교 함수

모든 비교 함수는 `DateTimeUnit` 단위를 인자로 받을 수 있습니다. 계산의 정확도는 이 단위를 기준으로 하며, 단위를 생략하면 밀리초 단위로 계산합니다.

| 함수 | 반환 타입 | 설명 |
|---|---|---|
| `diff()` | `number` | 차이값을 반환합니다. |
| `isEqual()` | `boolean` | 인자로 전달한 일자와 같으면 `true`를 반환합니다. |
| `isBefore()` | `boolean` | 인자로 전달한 일자 이전이면 `true`를 반환합니다. |
| `isBeforeOrEqual()` | `boolean` | 인자로 전달한 일자 이전이거나 같으면 `true`를 반환합니다. |
| `isAfter()` | `boolean` | 인자로 전달한 일자 이후이면 `true`를 반환합니다. |
| `isAfterOrEqual()` | `boolean` | 인자로 전달한 일자 이후거나 같으면 `true`를 반환합니다. |
| `isBetween()` | `boolean` | 인자로 전달한 두 일자 사이에 있으면 `true`를 반환합니다. |
| `isAfterOrEqual()` | `boolean` | 인자로 전달한 두 일자 사이에 있거나 같으면 `true`를 반환합니다. |

```typescript
const date1: DateTime = new DateTime({
	year: 2020,
	month: 10,
	date: 20
});

const date2: DateTime = new DateTime({
	year: 2020,
	month: 10,
	date: 27
});

console.log(date1.diff(date2, 'date')); // -7

console.log(date1.isEqual(date2, 'month')); // true

console.log(date1.isBefore(date2, 'date')); // true
console.log(date1.isBeforeOrEqual(date2, 'month')); // true

console.log(date1.isAfter(date2, 'date')); // false
console.log(date1.isBeforeOrEqual(date2, 'month')); // true

const date3: DateTime = new DateTime({
	year: 2020,
	month: 10,
	date: 27
});

console.log(date2.isBetween(date1, date3, 'date')); // true
console.log(date2.isBetweenOrEqual(date1, date2, 'date')); // true
```

## `DateTimeParam`, `DateTimeParamEx`

일자와 시각 값을 표현하는 객체입니다. 이 객체는 다음과 같은 필드로 구성됩니다.

| 필드        | 필드 타입 | 값 범위        | 설명                                        |
|-----------|---|-------------|-------------------------------------------|
| `year`    | `number` | -           | 연도를 표현합니다.                                |
| `quarter` | `number` | `1` ~ `4`   | 분기를 표현합니다. (`DateTimeParamEx`에만 존재합니다.)   |
| `month`   | `number` | `1` ~ `12`  | 월을 표현합니다.                                 |
| `week`    | `number` | `1` ~ `42`  | 주차수를 표현합니다. (`DateTimeParamEx`에만 존재합니다.) |
| `date`    | `number` | `1` ~ `31`  | 일자를 표현합니다.                                |
| `hours`   | `number` | `0` ~ `23`  | 시각을 표현합니다.                                |
| `minutes` | `number` | `0` ~ `59`  | 분을 표현합니다.                                 |
| `seconds` | `number` | `0` ~ `59`  | 초를 표현합니다.                                 |
| `ms`      | `number` | `0` ~ `999` | 밀리초를 표현합니다.                               |

* `month` 필드의 값은 `0` ~ `11` 범위가 아닙니다. 이 필드는 실제 월 값 `1` ~ `12`을 표현합니다.
* `quarter`, `week` 필드는 `DateTimeParamEx`에만 존재합니다.

## `DateTimeUnit`

일자, 시각 단위를 표현하는 값입니다.

| 토큰 | 필드 | 타입 | 설명 |
|---|---|---|---|
| `DateTimeUnit.Year` | `year` | `number` | 연도 |
| `DateTimeUnit.Quarter` | `quarter` | `number` | 분기 |
| `DateTimeUnit.Month` | `month` | `number` | 월 |
| `DateTimeUnit.Week` | `week` | `number` | 주 |
| `DateTimeUnit.Date` | `date` | `number` | 일자 |
| `DateTimeUnit.Hours` | `hours` | `number` | 시간 |
| `DateTimeUnit.Minutes` | `minutes` | `number` | 분 |
| `DateTimeUnit.Seconds` | `seconds` | `number` | 초 |
| `DateTimeUnit.Ms` | `ms` | `number` | 밀리초 |

## 달력

### `DateTime.getYearCalendar(): YearCalendar`

해당 연도에 해당하는 달력을 반환합니다. 시간 필드는 모두 `0`으로 설정됩니다.

`dates` 배열의 길이는 해당 연도에 있는 일자 개수와 같습니다.

### `DateTime.getMonthCalendar(): MonthCalendar`

해당 연도, 월에 해당하는 달력을 반환합니다. 시간 필드는 모두 `0`으로 설정됩니다.

`dates` 배열의 길이는 해당 월에 있는 일자 개수와 같습니다.

## `Duration`

기간을 표현합니다.

`Duration` 객체는 `new` 생성자로 생성합니다.

```TypeScript
const duration: Duration = new Duration();
```

생성자에 인자를 전달하면 원하는 기간을 지정하며 인스턴스를 생성할 수 있습니다. 이 때 인자는 `undefined`, `null`, `number`, `string`, `Duration`
, [`json` 타입(`DurationParam`)](#DurationParam)을 지원합니다.

```TypeScript
const newDurationByString: Duration = new Duration('PY2');

const newDurationByDuration: Duration = new Duration(new Duration());

const newDurationByDurationParam: Duration = new Duration({
	years: 2
});
```

### 값 가져오기 & 값 설정하기 - 개별 필드

| 토큰 | 필드 | 타입 |
|---|---|---|
| `DateTimeUnit.Years` | `year` | `number` |
| `DateTimeUnit.Months` | `month` | `number` |
| `DateTimeUnit.Dates` | `date` | `number` |
| `DateTimeUnit.Hours` | `hours` | `number` |
| `DateTimeUnit.Minutes` | `minutes` | `number` |
| `DateTimeUnit.Seconds` | `seconds` | `number` |
| `DateTimeUnit.Ms` | `ms` | `number` |

```TypeScript
const duration: Duration = new Duration(); // value : {}

duration.years = 2; // value : { years : 2 }
duration.ms = 1001; // value : { years : 2, seconds : 1, ms : 1} - 자리수 조정

console.log(duration.seconds); // 1
```

### `add()`

#### `add (param : Duration | DurationParam) : Duration`

인자가 `Duration`이거나 `DurationParam`이면 `Duration` 객체를 반환합니다.

#### `add (param : DateTime | DateTimeParam) : DateTime`

인자가 `DateTime`이거나 `DateTimeParam`이면 `DateTime` 객체를 반환합니다.

### `divide(count : number) : Duration[]`

전체 기간을 `count` 개수만큼 나눠서 `Duration` 배열로 반환합니다.

```TypeScript
const duration: Duration = { seconds: 1 };

console.log(duration.divide(4)); // 값이 { ms : 250 }인 Duration 인스턴스 배열
```

## `DurationParam`

기간을 표현합니다. 이 객체는 다음과 같은 필드로 구성됩니다.

| 필드 | 필드 타입 | 값 범위 | 설명 |
|---|---|---|---|
| `years` | `number` | - | 연단위 기간을 표현합니다. |
| `months` | `number` | `1` ~ `12` | 월단위 기간을 표현합니다. |
| `dates` | `number` | `1` ~ `31` | 일단위 기간을 표현합니다. |
| `hours` | `number` | `0` ~ `23` | 시간단위 기간을 표현합니다. |
| `minutes` | `number` | `0` ~ `59` | 분단위 기간을 표현합니다. |
| `seconds` | `number` | `0` ~ `59` | 초단위 기간을 표현합니다. |
| `ms` | `number` | `0` ~ `999` | 밀리초단위 기간을 표현합니다. |

## `DurationUnit`

기간 단위를 표현합니다.

| 토큰 | 필드 | 타입 |설명 |
|---|---|---|---|
| `DurationUnit.Years` | `years` | `number` | 연단위 기간을 표현합니다. |
| `DurationUnit.Quarters` | `quarters` | `number` | 분기단위 기간을 표현합니다. |
| `DurationUnit.Months` | `months` | `number` | 월단위 기간을 표현합니다. |
| `DurationUnit.Weeks` | `weeks` | `number` | 주단위 기간을 표현합니다. |
| `DurationUnit.Dates` | `dates` | `number` | 일단위 기간을 표현합니다. |
| `DurationUnit.Hours` | `hours` | `number` | 시간단위 기간을 표현합니다. |
| `DurationUnit.Minutes` | `minutes` | `number` | 분단위 기간을 표현합니다. |
| `DurationUnit.Seconds` | `seconds` | `number` | 초단위 기간을 표현합니다. |
| `DurationUnit.Ms` | `ms` | `number` | 밀리초단위 기간을 표현합니다. |
