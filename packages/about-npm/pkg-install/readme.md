# `pkg-install`

以编程方式安装包。自动检测包管理器（npm、yarn 和 pnpm）

- https://www.npmjs.com/package/@antfu/install-pkg
- https://github.com/antfu/install-pkg#readme

## 目标

- 作用
- 源码分析
  - 如何开发构建一个 ts 的 npm 包
  - 配置属于自己的 eslint 预设、提升版本号等
  - 学会使用 execa 执行命令
- 如何配置 [github action](./github-action.md)

这个包不大，知识点扩展开来涉及不少。

## 作用

自动检测包管理器（npm、yarn 和 pnpm）

```js
import { installPackage } from '@antfu/install-pkg'

await installPackage('vite', { silent: true })
```

原理就是通过锁文件自动检测使用何种包管理器（npm、yarn、pnpm），最终用 `execa` 执行类似如下的命令。

```bash
pnpm install -D --prefer-offine release-it react antd
```

## 源码分析

- index.ts
- detect.ts
- install.ts

index.ts 入口文件

```js
export * from './detect'
export * from './install'
```

**detect.ts** 探测包管理器

```js
import path from 'path'
import findUp from 'find-up'

export type PackageManager = 'pnpm' | 'yarn' | 'npm'

const LOCKS: Record<string, PackageManager> = {
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
}

export async function detectPackageManager(cwd = process.cwd()) {
  const result = await findUp(Object.keys(LOCKS), { cwd })
  const agent = (result ? LOCKS[path.basename(result)] : null)
  return agent
}
```

**install.ts**

支持安装多个，也支持指定包管理器，支持额外的参数。

```js
import execa from 'execa'
import { detectPackageManager } from '.'

export interface InstallPackageOptions {
  cwd?: string
  dev?: boolean
  silent?: boolean
  packageManager?: string
  preferOffline?: boolean
  additionalArgs?: string[]
}

export async function installPackage(names: string | string[], options: InstallPackageOptions = {}) {
  const agent = options.packageManager || await detectPackageManager(options.cwd) || 'npm'
  if (!Array.isArray(names))
    names = [names]

  const args = options.additionalArgs || []

  if (options.preferOffline)
    args.unshift('--prefer-offline')

  return execa(
    agent,
    [
      agent === 'yarn'
        ? 'add'
        : 'install',
      options.dev ? '-D' : '',
      ...args,
      ...names,
    ].filter(Boolean),
    {
      stdio: options.silent ? 'ignore' : 'inherit',
      cwd: options.cwd,
    },
  )
}
```

依赖包 [`find-up`](https://github.com/sindresorhus/find-up#readme) 用于查找路径

```js
import { findUp } from 'find-up';

console.log(await findUp('pnpm-lock.yaml'));
//=> '/Users/install-pkg/pnpm-lock.yaml'

path.basename('/Users/install-pkg/pnpm-lock.yaml') // 则是 pnpm-lock.yaml
```

### `package.json scripts` 解析

```js
"scripts": {
  "prepublishOnly": "nr build",
  "dev": "nr build --watch",
  "start": "esno src/index.ts",
  "build": "tsup src/index.ts --format cjs,esm --dts --no-splitting",
  "release": "bumpp --commit --push --tag && pnpm publish",
  "lint": "eslint \"{src,test}/**/*.ts\"",
  "lint:fix": "nr lint -- --fix"
},
```

### `ni` 神器

自动根据锁文件 yarn.lock / pnpm-lock.yaml / package-lock.json 检测使用 yarn / pnpm / npm 的包管理器。

- nr
- nci

```bash
nr dev --port=3000

# npm run dev -- --port=3000
# yarn run dev --port=3000
# pnpm run dev -- --port=3000
```

```bash
nr
# 交互式选择脚本
# interactively select the script to run
# supports https://www.npmjs.com/package/npm-scripts-info convention
```

```bash
nci - clean install
nci
# npm ci
# 简单说就是不更新锁文件
# yarn install --frozen-lockfile
# pnpm install --frozen-lockfile
```

- [pnpm install --frozen-lockfile](https://pnpm.io/zh/cli/install#--frozen-lockfile)

#### [`esno`](https://github.com/antfu/esno#readme) 运行 ts

```ts
#!/usr/bin/env node

const spawn = require('cross-spawn')
const spawnSync = spawn.sync

const register = require.resolve('esbuild-register')

const argv = process.argv.slice(2)

process.exit(spawnSync('node', ['-r', register, ...argv], { stdio: 'inherit' }).status)
```

- [esbuild-register](https://github.com/egoist/esbuild-register) 简单说：使用 esbuild 即时传输 JSX、TypeScript 和 esnext 功能

#### [`tsup`](https://github.com/egoist/tsup#readme) 打包 ts

打包 TypeScript 库的最简单、最快的方法。

#### [`bumpp`](https://github.com/antfu/bumpp) 交互式提升版本号

`bumpp` Forked from [version-bump-prompt](https://github.com/JS-DevTools/version-bump-prompt)

交互式 CLI 可增加您的版本号等

#### eslint 预设

```bash
pnpm add -D eslint @antfu/eslint-config

// .eslintrc
{
  "extends": ["@antfu"],
  "rules": {}
}
```

- [xo](https://github.com/xojs/xo) 也不错

## [github action workflows](./github-action.md)

## 知识点

- `path.basename`
- `execa` 执行脚本
  - `stdio`
  - `cwd`
  - https://www.npmjs.com/package/execa
  - https://github.com/sindresorhus/execa#readme
- `find-up` 查找路径
- `.npmrc`
  - `ignore-workspace-root-check=true` 即 `-W`
  - 使用的 `Yarn Workspaces`并且它管理所有项目(工作区)的依赖项，您应该将每个项目的依赖项添加到自己的 `package.json` ，而不是工作区根。
- `nr` 交互式选择脚本
- `esno`
- [`package.json exports`](https://www.cnblogs.com/taohuaya/p/15573719.html)
  - [nodejs packages_exports 文档](https://nodejs.org/api/packages.html#packages_exports)
  - [来自这个提案](https://github.com/jkrems/proposal-pkg-exports/)
  - 阮一峰: [Node.js 如何处理 ES6 模块](https://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html)
- `github action`
