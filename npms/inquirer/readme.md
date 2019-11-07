# inquirer

[inquirer](https://www.npmjs.com/package/inquirer) 一个用户与命令行交互的工具（guide风格的命令行——提问-回答模式的命令行），inquirer 提供了一个漂亮的界面和提出问题流的方式。

- guide风格的命令行（提问-回答模式的命令行）—— inquirer
- git风格命令行开发工具——commander.js

适用于

- 询问操作者问题
- 获取并解析用户输入
- 检测用户回答是否合法
- 管理多层级的提示
- 提供错误回调

## 使用

[examples](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/inquirer/examples)

**语法**

```js
const inquirer = require('inquirer');

const promptList = [
  // Pass your questions in here
  // 具体交互内容
];

inquirer
  .prompt(promptList)
  .then(answers => {
    // 返回的结果
    // Use user feedback for... whatever!!
  });
```

提问的类型支持 `input`, `confirm`, `list`, `rawlist`, `expand`, `checkbox`, `password`, `editor`

[examples](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/inquirer/examples)

## 详细 api

[Inquirer.js Api](https://github.com/SBoudrias/Inquirer.js#objects)

- type
- name
- message
- default
- choices
- validate
- filter
- transformer
- when
- pageSize
- prefix
- suffix

参考：

- https://blog.csdn.net/qq_26733915/article/details/80461257
- https://www.jianshu.com/p/db8294cfa2f7
