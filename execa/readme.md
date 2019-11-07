# execa

- [execa](https://www.npmjs.com/package/execa) better `child_process`。

execa 是一个子进程管理工具（改进 child_process 的方法），是可以调用shell和本地外部程序的javascript封装。

- 会启动子进程执行。
- 支持多操作系统，包括windows。
- 如果父进程退出，则生成的全部子进程都被杀死。

示例：

`execa(file, [arguments], [options])`：执行一个文件，集成了 child_process.execFile 和 child_process.spawn 的功能。返回一个增强版的 child_process，增加了 stdout 和 stderr 属性。

[index.js](./index.js)

参考：

- https://zxljack.com/2019/02/execa/
- http://abloz.com/tech/2018/08/21/nodejs-execa/
