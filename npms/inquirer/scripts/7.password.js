const inquirer = require('inquirer');

// 7. password
const promptList = [
  {
    type: 'password', // 密码为密文输入
    message: '请输入密码：',
    name: 'pwd',
  },
];

inquirer.prompt(promptList).then(answers => {
  console.log(answers); // 返回的结果
})
