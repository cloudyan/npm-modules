const inquirer = require('inquirer');

// 8. editor
const promptList = [
  {
    type: 'editor',
    message: '请输入备注：',
    name: 'editor',
  },
];

inquirer.prompt(promptList).then(answers => {
  console.log(answers); // 返回的结果
})
