# dayjs

- [dayjs](https://github.com/iamkun/dayjs/)
- [官方文档](https://day.js.org/docs/zh-CN/parse/parse)

Day.js 有很多 API 来解析、处理、校验、增减、展示时间和日期

```js
dayjs('2018-08-08') // 解析

dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A') // 展示

dayjs()
  .set('month', 3)
  .month() // 获取

dayjs().add(1, 'year') // 处理

dayjs().isBefore(dayjs()) // 查询
```

## API

```js
const dayjs = require('dayjs')
// import dayjs from 'dayjs' // ES 2015

dayjs().format()

const now = dayjs()

// 显示
const nowMs = now.valueOf() // Unix 时间戳毫秒数
const nowS = now.unix()     // Unix 时间戳秒数
const todayStart = now.startOf('date')
// 左移时间
const yestoday = now.substract(1, 'day') // day week month year hour second
// 右移时间
const tomorrow = now.add(dayjs.duration({'days' : 1}))
```

## 常用时间

推荐使用 ✅ 标记

- 时间点
  - 当前时间毫秒数、秒数，今日零点时间
- 相对时间：当前时间点向前推 N 个时间点（结束时间为当前时间点）
  - `[now_s-60*N, now_s]`
  - N 分钟 [now-N分钟, now] ✅
  - N 小时 [now-N小时, now] ✅
  - N 天   [now-N天, now]，如 7 天，30 天等
  - N 周   [now-N周, now]，如 1 周
  - 今天   [今日开始, now]  ✅
  - 本周  [周开始, now]
  - 本月  [月开始, now]
- 整点时间：当前周期（日或周等）结束时间点，向前推 N 个时间点
  - `[xxxStart, xxxEnd]`
  - 今天 [今天开始, 今天结束] todayStart
  - 昨天 [昨天开始, 昨天结束]
  - 前天 [前天开始, 前天结束]
  - 本周 [本周开始, 本周结束] 自然周 weekStart
  - 上周 [上周开始, 上周结束] 自然周
  - 本月 [本月开始, 本月结束] monthStart
  - 上月 [上月开始, 上月结束]
  - 本季度 [本季度开始, 本季度结束] quarterStart 依赖 `dayjs/plugin/quarterOfYear`
  - 本年度 [本年度开始, 本年度结束]
  - 30天  [今天零点-30天, 今天零点] ✅ `[todayStart-86400*30, todayStart]`
  - 1周   [今天零点-1周, 今天零点]  ✅ `[todayStart-86400*7, todayStart]`
  - 1小时  [当前小时整点-1小时, 当前小时整点] `[hourStart-3600, hourStart]`
  - 1天   [当前小时整点-24小时, 当前小时整点] `[hourStart-3600*24, hourStart]`
  - 特定时间段 [上周五开始, 这周四结束] ✅
- 其他便捷选择
  - 上周日
  - 本周一
  - 上月最后一天
  - 本月第一天
- 自定义时间段：开始时间~结束时间

### 常用时间实现

```js
const now = dayjs();


// 时间点
console.log(dayjs('2023-04-19').unit())
const nowSeconds = now.unit() // Unix 时间戳秒数
const nowMilliseconds = now.valueOf() // Unix 时间戳毫秒数
const todayStart = now.startOf('date')
const todayEnd = now.endOf('date')

// startOf('date') 与 startOf('day') 相同，都是当天零点


// 相对时间与绝对时间
// 昨天
// 拿到昨天的0点0分0秒的时间戳和23点59分59秒时间戳。
const yestoday = dayjs().substract(1, 'days')
const yestodayStart = yestoday.startOf('date') // 绝对时间
const yestodayEnd = yestoday.endOf('date') // 绝对时间
// 前天
const theDayBeforeYestoday = dayjs().substract(2, 'days') // 绝对时间

// 周数据
// 两种方法获得上周日（周日为一周开始）
const lastSunDay = dayjs().startOf('week')
const lastSunDayFromWeekday = dayjs().day(0) // 0~6
// 本周一
const Monday = dayjs().startOf('week').add(1, 'days')
// 上月最后一天
const lastDayOfLastMonth = dayjs().subtract(1, 'months').endOf('month')
// 本月第一天
const firtstDayOfMonth = dayjs().startOf('months')
// 本周起始时间（本周一）
const Monday = dayjs().startOf('week').add(1, 'days')
// 本周末尾时间
const Sunday = dayjs().endOf('week').add(1, 'days')

// 其他
```


### 其他用法

```js
// 拿到昨天的0点0分0秒的时间戳和23点59分59秒时间戳。
const yestoday = dayjs().substract(1, 'days')
const yestodayStart = yestoday.startOf('date')
const yestodayEnd = yestoday.endOf('date')

console.log(
  yestoday,
  yestodayStart,
  yestodayEnd,
  yestodayStart.valueOf(),
  yestodayEnd.valueOf(),
)

// startOf 设置到一个时间的开始，如 date, month 等
// 同理可以获取前天
const theDayBeforeYestoday = dayjs().substract(2, 'days')
// 上周日
const lastSunDay = dayjs().startOf('week')
const lastSunDayFromWeekday = dayjs().day(0) // 0~6

// 本周一
const Monday = dayjs().startOf('week').add(1, 'days')
// 上月最后一天
const lastDayOfLastMonth = dayjs().subtract(1, 'months').endOf('month')
// 本月第一天
const firtstDayOfMonth = dayjs().startOf('months')
// 本周起始时间（本周一）
const Monday = dayjs().startOf('week').add(1, 'days')
// 本周末尾时间
const Sunday = dayjs().endOf('week').add(1, 'days')

console.log(Monday.diff(Sunday, 'days')) // -6 一周有7天，显示少了1天。原因就是周日是到23时59分59秒，差一秒不足一天，被四舍五入了。
console.log(Monday.diff(Sunday, 'hours')) // -167 一周有168小时，显示少了1小时。不过我们要传给后端的就是Monday和Sunday的时间戳，后端可以根据周一零点到周日23点59分59秒的时间区间查找数据。

// 本季度起始时间
const firstDayOfQuarter = dayjs().startOf('quarter')
// 本年起始时间
const firstDayOfYear = dayjs().startOf('year')
// 去年起始时间
const firstDayOfLastYear = dayjs().subtract(1, 'years').startOf('year')
// 最近 3 天
const first3day = dayjs().subtract(3, 'days').startOf('day')

// 本月 5 号
// 方式一
const number5 = dayjs().startOf('month').add(4, 'days')
// 方式二
const number5FromDates = dayjs().date(5);

// 上个月 5 号
// 方式一
const number5LastMouth = dayjs().subtract(1, 'months').startOf('month').add(4, 'days')

// 本周三
// 方式一
const Wednesday = dayjs().startOf('week').add(3, 'days')
// 方式二
const WednesdayFromDay = dayjs().day(3);
```
