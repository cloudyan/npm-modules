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
```

## 常用时间

- 便捷选择
  - 最近 N 分钟/小时/天/周/月
  - 按天 昨天 前天 上周日 本周一 上月最后一天 本月第一天
  - 本周 上周
  - 本月 上月
  - 本季度 上季度
  - 本年 去年
- 相对时间
- 固定时间
- 自定义
- 相对时间
  - 30 分钟
  - 1 天
  - 7 天
  - 1 周
  - 1 月
- 绝对时间
  - 今日零点
  - 昨日
  - 1 天
  - 1 周
  - 1 月


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
// 本周起始时间
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
