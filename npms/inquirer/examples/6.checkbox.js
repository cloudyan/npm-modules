const inquirer = require('inquirer');

// 6. checkbox
const promptList = [
  {
    type: 'checkbox',
    message: '选择颜色:',
    name: 'color',
    choices: [
      {
        name: 'red',
      },
      new inquirer.Separator(), // 添加分隔符
      {
        name: 'blur',
        checked: true, // 默认选中
      },
      {
        name: 'green',
      },
      new inquirer.Separator('--- 分隔符 ---'), // 自定义分隔符
      {
        name: 'yellow',
      },
    ],
  },
];


// 或者下面这样
const promptList2 = [
  {
    type: 'checkbox',
    message: '选择颜色:',
    name: 'color',
    choices: ['red', 'blur', 'green', 'yellow'],
    pageSize: 2, // 设置行数
  },
];

inquirer.prompt(promptList).then(answers => {
  console.log(answers); // 返回的结果
})

// inquirer.prompt(promptList2).then(answers => {
//   console.log(answers); // 返回的结果
// })
