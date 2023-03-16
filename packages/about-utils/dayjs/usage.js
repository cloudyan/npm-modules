const dayjs = require('dayjs')

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
    format(unix, format = 'MM-DD HH:mm:ss') { return dayjs(unix*1000).format(format) }
  }
}
function getTime() {
  const dateTime = getDateTime()
  const to = dateTime.now
  const from = dateTime.now - 60*60

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

