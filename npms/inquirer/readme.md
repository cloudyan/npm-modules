# inquirer

一个用户与命令行交互的工具（guide风格的命令行——提问-回答模式的命令行），inquirer 提供了一个漂亮的界面和提出问题流的方式。

- guide风格的命令行（提问-回答模式的命令行）—— inquirer
- git风格命令行开发工具——commander.js

适用于

- 询问操作者问题
- 获取并解析用户输入
- 检测用户回答是否合法
- 管理多层级的提示
- 提供错误回调

## 使用

**语法**

```js
const inquirer = require('inquirer');

const promptList = [
  // 具体交互内容
];

inquirer.prompt(promptList).then(answers => {
  console.log(answers); // 返回的结果
})
```

提问的类型支持 `input`, `confirm`, `list`, `rawlist`, `expand`, `checkbox`, `password`, `editor`

具体使用参见 [https://blog.csdn.net/qq_26733915/article/details/80461257](https://blog.csdn.net/qq_26733915/article/details/80461257)

参考：

- https://blog.csdn.net/qq_26733915/article/details/80461257
- https://www.jianshu.com/p/db8294cfa2f7
