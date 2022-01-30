# `only-allow`

一行代码统一规范团队包管理器的神器

- https://www.npmjs.com/package/only-allow
- https://github.com/pnpm/only-allow#readme
- https://juejin.cn/post/7033560885050212389

## 目标

- 使用
- npm 命令钩子
- 源码分析

## 使用

- `npx only-allow npm`
- `npx only-allow yarn`
- `npx only-allow pnpm`

```js
{
  "scripts": {
    "preinstall": "npx only-allow npm"
  }
}
```

## npm 命令钩子

[npm 官方文档](https://docs.npmjs.com/cli/v8/using-npm/scripts#pre--post-scripts)

Vue3 源码用了 `npm` 的 `preinstall` 钩子 约束，只能使用 `pnpm` 安装依赖。

package.json

```json
// vue-next/package.json
{
  "private": true,
  "version": "3.2.22",
  "scripts": {
    "preinstall": "node ./scripts/preinstall.js",
  }
}
```

- [preinstall](./preinstall.js) [源码](https://github.com/vuejs/core/blob/6b6889852f247a91df4793ad37e8e2e1d27c79b3/scripts/preinstall.js#L1)

```js
// vue-next/scripts/preinstall.js

if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `\u001b[33mThis repository requires using pnpm as the package manager ` +
      ` for scripts to work properly.\u001b[39m\n`
  )
  process.exit(1)
}
```

关于 `process` 对象可以查看 [阮一峰老师 process 对象](https://javascript.ruanyifeng.com/nodejs/process.html)

> `process.argv` 属性返回一个数组，由命令行执行脚本时的各个参数组成。
> 它的第一个成员总是 `node`，第二个成员是脚本文件名，其余成员是脚本文件的参数。

## 源码分析

独立的 npm 包，https://pnpm.io/only-allow-pnpm

```js
#!/usr/bin/env node
const whichPMRuns = require('which-pm-runs')
const boxen = require('boxen')

const argv = process.argv.slice(2)
if (argv.length === 0) {
  console.log('Please specify the wanted package manager: only-allow <npm|pnpm|yarn>')
  process.exit(1)
}

// 第一个参数则是 用户传入的希望使用的包管理器
// 比如 npx only-allow pnpm
// 这里调试是 node bin.js pnpm
const wantedPM = argv[0]
if (wantedPM !== 'npm' && wantedPM !== 'pnpm' && wantedPM !== 'yarn') {
  console.log(`"${wantedPM}" is not a valid package manager. Available package managers are: npm, pnpm, or yarn.`)
  process.exit(1)
}
const usedPM = whichPMRuns()
// 希望使用的包管理器 不相等，则报错。
// - npm  提示使用 npm install
// - pnpm 提示使用 pnpm install
// - yarn 提示使用 yarn install
// 最后退出进程
if (usedPM && usedPM.name !== wantedPM) {
  const boxenOpts = { borderColor: 'red', borderStyle: 'double', padding: 1 }
  switch (wantedPM) {
    case 'npm':
      console.log(boxen('Use "npm install" for installation in this project', boxenOpts))
      break
    case 'pnpm':
      console.log(boxen(`Use "pnpm install" for installation in this project.
If you don't have pnpm, install it via "npm i -g pnpm".
For more details, go to https://pnpm.js.org/`, boxenOpts))
      break
    case 'yarn':
      console.log(boxen(`Use "yarn" for installation in this project.
If you don't have Yarn, install it via "npm i -g yarn".
For more details, go to https://yarnpkg.com/`, boxenOpts))
      break
  }
  process.exit(1)
}
```

可以继续查看 [which-pm-runs 源码](https://github.com/zkochan/packages/blob/master/which-pm-runs/index.js#L1-L18)

返回包管理器和版本号。

关于 [npm_config_user_agent](https://npm.io/package/npm-config-user-agent-parser)

`npm_config_user_agent` 是格式类似如下的字符串

```js
npm/6.1.0 node/v8.9.4 darwin x64

// 或
yarn/1.7.0 npm/? node/v8.9.4 darwin x64
```

### `which-pm-runs`

源码如下

```js
'use strict'

module.exports = function () {
  if (!process.env.npm_config_user_agent) {
    return undefined
  }
  return pmFromUserAgent(process.env.npm_config_user_agent)
}

function pmFromUserAgent (userAgent) {
  const pmSpec = userAgent.split(' ')[0]
  const separatorPos = pmSpec.lastIndexOf('/')
  return {
    name: pmSpec.substr(0, separatorPos),
    version: pmSpec.substr(separatorPos + 1)
  }
}
```

## 知识点

- `process`
  - `process.argv`
  - `process.env.npm_config_user_agent`
- `substr` String.prototype.substr is deprecated.
  - 推荐 `slice`
  - [pull request => chore: remove deprecated String.prototype.substr](https://github.com/vuejs/core/pull/4699)


扩展

- [参加有赞前端技术开放日所感所想](https://lxchuan12.gitee.io/20180421-youzan-front-end-tech-open-day/)
    > 技术（开源）项目本质上是：理念、套路、规范的工具化。
- 强制使用包管理器pnpm，npm安装pnpm需要node 12.17以上版本
