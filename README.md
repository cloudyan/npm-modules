# npm-modules

这个项目有停了很长一段时间, 现在重新开始。并将这个库重新定位为源码系列。

1. 学使用
2. 学源码

学习参考:

- [【必读】每周一起学习200行源码共读活动介绍](https://www.yuque.com/ruochuan12/topics/1)
- [每天一个npm包](https://www.zhihu.com/people/xu-yi-zong-13/posts)

```js
循序渐进
借助调试
理清主线
查阅资料
总结记录
```

## 列表

- 001.[【validate-npm-package-name】检测 npm 包是否符合标准](./001.validate-npm-package-name/readme.md)
- 002.[【axios/lib/utils】axios 中 utils 工具函数](./101.axios/utils.md)
- 003.[【remote-git-tags】callback promisify 化的 Node.js 源码实现](./003.remote-git-tags/readme.md)
- 004.[【only-allow】一行代码统一规范团队包管理器的神器](./004.only-allow/readme.md)
- 005.[【install-pkg】 以编程方式安装包。自动检测包管理器（npm、yarn 和 pnpm）](./005.pkg-install/readme.md)
- 006.[【configstore】 轻松加载和持久化配置，无需考虑位置和方式]
- 008.[【@vuejs/shared】 vue3 中 shared 工具函数](./102.vuejs/shared.md)
- 101.[axios] axios 分析
- 102.[vuejs] vue 分析


学习 nodejs，从下面的方向开始

- nodejs 官方api
- nodejs 命令行、工具方向优秀 npm 模块
- nodejs openApi、server服务方向优秀 npm 模块
- 其他优秀的 npm 模块

## nodejs 官方 API

官方 API

## nodejs 命令行、工具方向优秀 npm 模块

- [execa](./execa) Better `child_process`
- [minimist](./minimist)
- [inquirer](./inquirer)
- [babel](./babel)
- [cross-env](./cross-env)
- [jsonwebtoken](./jsonwebtoken)
- log
  - [log4js](./log4js)
  - [bunyan](./bunyan)
  - [debug](./debug)
  - winston
- chokidar

## nodejs openApi、server服务方向优秀 npm 模块

- [koa](./koa)
- [nodemon](./nodemon)
- [supervisor](./supervisor)
- [pm2](./pm2)
- [loadtest](./loadtest)
- [express](./express)
  - express-winston
  - path-to-regexp 是Express风格的路径正则工具
- 模板引擎
  - https://blog.csdn.net/chszs/article/details/58606201
- [mongodb](./mongodb)
  - [mongodb](https://zhuanlan.zhihu.com/p/24308524)
  - [mongoose](https://mongoosejs.com/)
- 熟悉 alinode 性能监测

## 优秀的 npm 模块

- [dayjs](https://github.com/iamkun/dayjs)
- [timeago.js](https://github.com/hustcc/timeago.js)
- [page-fps](https://github.com/hustcc/page-fps)
- [size-sensor](https://github.com/hustcc/size-sensor)
- [event-emitter](https://github.com/antvis/event-emitter) @antvis
- [bluebird](https://github.com/petkaantonov/bluebird)
- [markdown 编写格式规范检查](https://github.com/hustcc/lint-md)
- [rxjs](https://cn.rx.js.org/manual/index.html)

参考：

- [awesome-javascript](https://github.com/sorrycc/awesome-javascript) awesome系列必属精品，javascript资源清单 github关注数>5000
- [awesome-javascript-cn](https://github.com/jobbole/awesome-javascript-cn) 中文文档清单
- [awesome-nodejs](https://github.com/sindresorhus/awesome-nodejs) awesome系列必属精品，Nodejs 资源的收集 github 关注数> 11000
- [node-lessons](https://github.com/alsotang/node-lessons) Node.js 包教不包会
