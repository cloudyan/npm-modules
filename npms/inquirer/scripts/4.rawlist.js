const inquirer = require('inquirer');

// 4. rawlist
const promptList = [
  {
    type: 'rawlist',
    message: '请选择一种水果:',
    name: 'fruit',
    choices: ['Apple', 'Pear', 'Banana'],
  },
];

inquirer.prompt(promptList).then(answers => {
  console.log(answers); // 返回的结果
})
