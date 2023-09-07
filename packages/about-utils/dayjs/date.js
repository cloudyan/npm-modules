const dayjs = require('dayjs')
const quarterOfYear = require('dayjs/plugin/quarterOfYear')
const weekday = require('dayjs/plugin/weekday')
const localeData = require('dayjs/plugin/localeData')
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(weekday)
dayjs.extend(quarterOfYear)
// Fix: caught TypeError: clone2.localeData is not a function
dayjs.extend(localeData)
dayjs.extend(customParseFormat);

// shortcuts 选择时间点
// ranges 选择时间范围
// 参考 amis-ui/src/components/DatePicker.tsx
const availableShortcuts = {
  now: {
    label: '现在',
    date: (now) => {
      return dayjs();
    }
  },
  today: {
    label: '今天',
    date: (now) => {
      return dayjs().startOf('day');
    }
  },

  yesterday: {
    label: '昨天',
    date: (now) => {
      return dayjs().add(-1, 'day').startOf('day');
    }
  },

  // https://day.js.org/docs/zh-CN/get-set/weekday
  thisweek: {
    label: '本周一',
    date: (now) => {
      // return dayjs().startOf('week').startOf('day');
      return dayjs().weekday(1);
    }
  },

  thismonth: {
    label: '本月初',
    date: (now) => {
      return dayjs().startOf('month');
    }
  },

  prevmonth: {
    label: '上个月初',
    date: (now) => {
      return dayjs().startOf('month').add(-1, 'month');
    }
  },

  prevquarter: {
    label: '上个季度初',
    date: (now) => {
      return dayjs().startOf('quarter').add(-1, 'quarter');
    }
  },

  thisquarter: {
    label: '本季度初',
    date: (now) => {
      return dayjs().startOf('quarter');
    }
  },

  tomorrow: {
    label: '明天',
    date: (now) => {
      return dayjs().add(1, 'day').startOf('day');
    }
  },

  endofthisweek: {
    label: '本周日',
    date: (now) => {
      // return dayjs().endOf('week');
      return dayjs().weekday(7);
    }
  },

  endofthismonth: {
    label: '本月底',
    date: (now) => {
      return dayjs().endOf('month');
    }
  },

  endofthismonth: {
    label: '本月底',
    date: (now) => {
      return dayjs().endOf('month');
    }
  },

  endoflastmonth: {
    label: '下个月底',
    date: (now) => {
      return dayjs().add(-1, 'month').endOf('month');
    }
  }
}

const availableRanges = {
  'today': {
    label: '今天',
    startDate: (now) => {
      return dayjs().startOf('day');
    },
    endDate: (now) => {
      return dayjs().endOf('day');
    }
  },

  'yesterday': {
    label: '昨天',
    startDate: (now) => {
      return dayjs().add(-1, 'day').startOf('day');
    },
    endDate: (now) => {
      return dayjs().add(-1, 'day').endOf('day');
    }
  },

  'tomorrow': {
    label: '明天',
    startDate: (now) => {
      return dayjs().add(1, 'day').startOf('day');
    },
    endDate: (now) => {
      return dayjs().add(1, 'day').endOf('day');
    }
  },

  // 兼容一下错误的用法
  '1daysago': {
    label: '最近 1 天',
    startDate: (now) => {
      return dayjs().add(-1, 'day').startOf('day');
    },
    endDate: (now) => {
      return dayjs().add(-1, 'day').endOf('day');
    }
  },

  '3daysago': {
    label: '最近 3 天',
    startDate: (now) => {
      return dayjs().add(-3, 'day').startOf('day');
    },
    endDate: (now) => {
      return dayjs().add(-1, 'day').endOf('day');
    }
  },

  '7daysago': {
    label: '最近 7 天',
    startDate: (now) => {
      return dayjs().add(-7, 'day').startOf('day');
    },
    endDate: (now) => {
      return dayjs().add(-1, 'day').endOf('day');
    }
  },

  '30daysago': {
    label: '最近 30 天',
    startDate: (now) => {
      return dayjs().add(-30, 'day').startOf('day');
    },
    endDate: (now) => {
      return dayjs().add(-1, 'day').endOf('day');
    }
  },

  '90daysago': {
    label: '最近 90 天',
    startDate: (now) => {
      return dayjs().add(-90, 'day').startOf('day');
    },
    endDate: (now) => {
      return dayjs().add(-1, 'day').endOf('day');
    }
  },

  'prevweek': {
    label: '上周',
    startDate: (now) => {
      return dayjs().startOf('week').add(-1, 'weeks');
    },
    endDate: (now) => {
      return dayjs().startOf('week').add(-1, 'day').endOf('day');
    }
  },

  'thisweek': {
    label: '本周',
    startDate: (now) => {
      return dayjs().startOf('week');
    },
    endDate: (now) => {
      return dayjs().endOf('week');
    }
  },

  'thismonth': {
    label: '本月',
    startDate: (now) => {
      return dayjs().startOf('month');
    },
    endDate: (now) => {
      return dayjs().endOf('month');
    }
  },

  'thisquarter': {
    label: '本季度',
    startDate: (now) => {
      return dayjs().startOf('quarter');
    },
    endDate: (now) => {
      return dayjs().endOf('quarter');
    }
  },

  'prevmonth': {
    label: '上个月',
    startDate: (now) => {
      return dayjs().startOf('month').add(-1, 'month');
    },
    endDate: (now) => {
      return dayjs().startOf('month').add(-1, 'day').endOf('day');
    }
  },

  'prevquarter': {
    label: '上个季度',
    startDate: (now) => {
      return dayjs().startOf('quarter').add(-1, 'quarter');
    },
    endDate: (now) => {
      return dayjs().startOf('quarter').add(-1, 'day').endOf('day');
    }
  },

  'thisyear': {
    label: '今年',
    startDate: (now) => {
      return dayjs().startOf('year');
    },
    endDate: (now) => {
      return dayjs().endOf('year');
    }
  },

  // 兼容一下之前的用法 'lastYear'
  'prevyear': {
    label: '去年',
    startDate: (now) => {
      return dayjs().startOf('year').add(-1, 'year');
    },
    endDate: (now) => {
      return dayjs().endOf('year').add(-1, 'year').endOf('day');
    }
  },

  'lastYear': {
    label: '去年',
    startDate: (now) => {
      return dayjs().startOf('year').add(-1, 'year');
    },
    endDate: (now) => {
      return dayjs().endOf('year').add(-1, 'year').endOf('day');
    }
  }
}


// console.log(Object.keys(availableShortcuts).reduce((obj, key) => {
//   const current = availableShortcuts[key]
//   obj[key] = current.date().format()
//   return obj;
// }, {}));

console.log(Object.keys(availableRanges).reduce((obj, key) => {
  const current = availableRanges[key]
  obj[key] = {
    startDate: current.startDate().format(),
    endDate: current.endDate().format(),
  }
  return obj;
}, {}));
