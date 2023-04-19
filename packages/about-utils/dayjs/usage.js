const dayjs = require('dayjs')

// 实现一个符合常规逻辑的时间范围选择
// 如 ['2023-04-17', '2023-04-19'] 表示可选时间范围为 4-17零点开始，4-20零点结束
// console.log(dayjs('2023-04-19').unix() === dayjs('2023-04-19').startOf('day').unix())
console.log(dayjs('2023-04-19').startOf('day').format())
console.log(dayjs('2023-04-19').endOf('day').format())

// format:
// YYYY/[Q]Q/MM/年第w周/星期d/DDTHH:mm:ss

// test
const now = dayjs() // 等同 dayjs(new Date())
console.log(now.unix(), +new Date(), now.format())
const yestoday = now.subtract(1, 'day')
const hour = now.subtract(1, 'hour')
const todayStart = now.startOf('date')
console.log(todayStart.format(), yestoday.format(), hour.format())

function getDateTime() {
  const now = dayjs()
  const todayStart = now.startOf('date')

  // 单位 s
  return {
    dayjs,
    now: now.unix(),
    todayStart: todayStart.unix(),
    format(unix, format = 'YYYMM-DD HH:mm:ss') {
      return dayjs(unix*1000).format(format)
    }
  }
}
function getTime() {
  const dateTime = getDateTime()
  const to = dateTime.now
  const from = dateTime.now - 3600

  return {
    from,
    to,
    format: dateTime.format,
  }
}

const {from, to, format} = getTime()

console.log(from, to, now.unix(from), format(from))

// 今天是周五？
console.log('周': dayjs().day())
// console.log(now.month(), now.month(0).format())

// 处理 unix
format(from, 'MM-DD HH:mm')

