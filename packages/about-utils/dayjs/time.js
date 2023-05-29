const dayjs = require('dayjs')
const quarterOfYear = require('dayjs/plugin/quarterOfYear')
const weekday = require('dayjs/plugin/weekday')
const localeData = require('dayjs/plugin/localeData')
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(weekday)
dayjs.extend(quarterOfYear)
// Fix: caught TypeError: clone2.localeData is not a function
dayjs.extend(localeData)
// 扩展支持自定义时间格式
dayjs.extend(customParseFormat);

const timeFormat = 'HH:mm'
const time = '12:08'
console.log(dayjs('12:08', 'HH:mm'))
