const inquirer = require('inquirer');

// 1. input
const promptList = [
  {
    type: 'input',
    message: '设置一个用户名:',
    name: 'name',
    default: 'test_user', // 默认值
  },
  {
    type: 'input',
    message: '请输入手机号:',
    name: 'phone',
    validate: function(val) {
      if (val.match(/\d{11}/g)) {
        // 校验位数
        // TIP: 这里必须 return boolean 值
        return true;
      }
      return '请输入11位数字';
    },
  },
];

inquirer.prompt(promptList).then(answers => {
  console.log(answers); // 返回的结果
})
