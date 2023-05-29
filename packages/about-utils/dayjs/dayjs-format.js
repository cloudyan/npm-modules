const dayjs = require('dayjs')
const quarterOfYear = require('dayjs/plugin/quarterOfYear')
const weekday = require('dayjs/plugin/weekday')

dayjs.extend(weekday)
dayjs.extend(quarterOfYear)

const relativeValueRe =
  /^(.+)?(\+|-)(\d+)(minute|min|hour|day|week|month|year|weekday|second|millisecond)s?$/i;

const dateFilter2 = function dateFilter(
  value,
  format = 'YYYY-MM-DD',
) {
  if (typeof value === 'string') {
    value = value.trim();
  }
  let regs;
  let date;
  if (value && typeof value === 'string' && (regs = relativeValueRe.exec(value))) {
    // console.log('regs', regs);
    const step = parseInt(regs[3], 10);
    const from = regs[1] ? dateFilter(regs[1], format) : /(minute|min|hour|second)s?/.test(regs[4])
      ? dayjs()
      : dayjs().startOf('day')

    return regs[2] === '-'
      ? from.subtract(step, regs[4])
      : from.add(step, regs[4]);
  } else if (value === 'now') {
    return dayjs();
  } else if(value === 'today') {
    return dayjs().startOf('day')
  } else {
    return dayjs(value, format)
  }
};

console.log('now', dateFilter2('now').format())
console.log('+3hours', dateFilter2('+3hours').format())
console.log('-3days', dateFilter2('-3days').format())
console.log('2023-04-28', dateFilter2('2023-04-28').format())
