# npm-modules

这个项目有停了很长一段时间, 现在重新开始。并将这个库重新定位为**源码系列**(xxx-analysis)。

1. 学使用
2. 学设计

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

> 工欲善其事必先利其器

如何学习调试源码

- [程序员阅读源码是一种什么心态？源码对编程意义何在？如何才能更好阅读代码？](https://www.zhihu.com/question/29765945)
- [debugging 调试](https://github.com/cloudyan/debugging)
  - [调试JS代码](https://juejin.cn/post/7030584939020042254)
- [为什么源码分析味同嚼蜡？浅析技术写作中的思维误区](https://juejin.cn/post/6844903512669700109)
- [如何阅读大型前端开源项目的源码](https://zhuanlan.zhihu.com/p/36996225)

## 列表

- about-async
  - [x] [【await-to-js】流程控制](./packages/about-async/await-to-js/readme.md)
  - [x] [【delay】带取消功能的延迟函数](./packages/about-async/delay/readme.md)
  - [ ] [【p-queue】](./packages/about-async/p-queue/readme.md)
  - [ ] [【p-limit】](./packages/about-async/p-limit/readme.md)
  - [ ] [【p-throttle】](./packages/about-async/p-throttle/readme.md)
- about-ci
  - [x] [【configstore】轻松加载和持久化配置，无需考虑位置和方式](./packages/about-ci/configstore/readme.md)
    - [x] [【dot-prop】](./packages/about-ci/configstore/dot-prop.md)
  - [x] [【cross-env】跨平台设置及使用环境变量](./packages/about-ci/cross-env/readme.md)
  - [ ] [open](./packages/about-ci/open/readme.md)
- about-framework
  - [x] [【vue2/shared】中的工具函数](./packages/about-framework/vue2/vue2-shared.md)
  - [x] [【vue3/shared】中的工具函数](./packages/about-framework/vue3/vue3-shared.md)
- about-hooks
  - [ ] [【ahooks】自定义 hooks](./packages/about-hooks/readme.md)
- about-npm
  - [x] [【validate-npm-package-name】检测 npm 包是否符合标准](./packages/about-npm/validate-npm-package-name/readme.md)
  - [x] [【only-allow】一行代码统一规范团队包管理器的神器](./packages/about-npm/only-allow/readme.md)
  - [x] [【install-pkg】以编程方式安装包。自动检测包管理器（npm、yarn 和 pnpm）](./packages/about-npm/pkg-install/readme.md)
  - [x] [【ni】use the right package manager](./packages/about-npm/ni/readme.md)
- about-parse-url
  - [ ] [parse-path](./packages/about-parse-url/parse-path/readme.md)
  - [ ] [parse-url](./packages/about-parse-url/parse-url/readme.md)
  - [ ] [parseurl](./packages/about-parse-url/parseurl/readme.md)
  - [ ] [url-parse](./packages/about-parse-url/url-parse/readme.md)
  - [ ] [url-pattern](./packages/about-parse-url/url-pattern/readme.md)
- about-request
  - [x] [【axios/utils】中的工具函数](./packages/about-request/axios/utils.md)
  - [x] [axios](./packages/about-request/axios/readme.md)
  - [x] [axios-jsonp](./packages/about-request/axios-jsonp/readme.md)
  - [x] [axios-retry](./packages/about-request/axios-retry/readme.md)
  - [x] [axios-extensions](./packages/about-request/axios-extensions/readme.md)
  - [x] [axios-fetch](./packages/about-request/axios-fetch/readme.md)
  - [axios-tools](./packages/about-request/axios-tools/readme.md)
  - [ky-universal](./packages/about-request/ky-universal/readme.md)
  - [axios vs fetch](./packages/about-request/readme.md)
  - [universal-request](./packages/about-request/universal-request/readme.md)
- about-storage
  - [x] [【js-cookie】Cookie 的封装，简单、轻量、好用](./packages/js-cookie/readme.md)
  - [x] [localforage](./packages/about-storage/localforage/readme.md)
  - [ ] [lowdb](./packages/about-storage/lowdb/readme.md)
  - [ ] [storage](./packages/about-storage/storage/readme.md)
- about-tpl
  - [ ] [degit](./packages/about-tpl/degit/readme.md)
  - [ ] [create-vite](./packages/about-tpl/create-vite/readme.md)
  - [ ] [create-tpl](./packages/about-tpl/create-tpl/readme.md)
- about-uuid
  - [ ] [nanoid](./packages/about-uuid/nanoid/readme.md)
  - [x] [uuid](./packages/about-uuid/uuid/readme.md)
- other
  - [x] [【emitter】发布订阅](./packages/emitter/readme.md)
  - [x] [【remote-git-tags】callback promisify 化的 Node.js 源码实现](./packages/remote-git-tags/readme.md)
  - [ ] [simple-git-hooks](./packages/simple-git-hooks/readme.md)

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
