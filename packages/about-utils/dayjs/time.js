require('dayjs/locale/zh-cn')
const dayjs = require('dayjs')
const quarterOfYear = require('dayjs/plugin/quarterOfYear')
const weekday = require('dayjs/plugin/weekday')
const localeData = require('dayjs/plugin/localeData')
const customParseFormat = require('dayjs/plugin/customParseFormat');
const weekYear = require('dayjs/plugin/weekYear');
const weekOfYear = require('dayjs/plugin/weekOfYear');
const advancedFormat = require('dayjs/plugin/advancedFormat')

dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(quarterOfYear)
// Fix: caught TypeError: clone2.localeData is not a function
dayjs.extend(localeData)
// 扩展支持自定义时间格式
dayjs.extend(customParseFormat);

dayjs.extend(weekYear)
dayjs.extend(weekOfYear)

// https://day.js.org/docs/zh-CN/parse/string-format
// 年/季度/月/年第几周/星期几/天T时:分:秒
// 'YYYY/[Q]Q/MM/年第w周/星期d/DDTHH:mm:ss'

// const timeFormat = 'HH:mm'
// const time = '12:08'
// console.log(dayjs('12:08', 'HH:mm'))

// 季度与周，需要指定年份 [Q]Q ww
// 但月日，不需要 MM-DD
const week = '34'
const monthDay = '08-19'
// console.log(dayjs().weekYear())
console.log(dayjs().format('MM-DD'))
console.log(dayjs().format('YYYY-ww周'))
console.log(dayjs().week(31))
console.log(dayjs(week, 'ww'))
// console.log(dayjs(monthDay, 'MM-DD'))
