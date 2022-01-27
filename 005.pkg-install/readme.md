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
- 如何配置 github action

这个包不大，知识点扩展开来涉及不少。

## 作用

自动检测包管理器（npm、yarn 和 pnpm）

```js
import { installPackage } from '@antfu/install-pkg'

await installPackage('vite', { silent: true })
```

原理就是通过锁文件自动检测使用何种包管理器（npm、yarn、pnpm），最终用 execa 执行类似如下的命令。

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

detect.ts 探测包管理器

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

install.ts

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

### ni 神器

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

## 知识点

- `path.basename`
- `execa` 执行脚本
  - https://www.npmjs.com/package/execa
  - https://github.com/sindresorhus/execa#readme
- `find-up` 查找路径
- `.npmrc`
  - `ignore-workspace-root-check=true` 即 `-W`
  - 使用的 `Yarn Workspaces`并且它管理所有项目(工作区)的依赖项，您应该将每个项目的依赖项添加到自己的 `package.json` ，而不是工作区根。
- `nr` 交互式选择脚本
- `esno`
- `github action`
- `package.json exports`
- github action workflows

对于github action 不熟悉的读者，可以看[阮一峰老师 GitHub Actions 入门教程](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

- 配置文件 [workflows/release](https://github.com/antfu/install-pkg/blob/main/.github/workflows/release.yml)
- 构建历史 [github action workflow](https://github.com/antfu/install-pkg/runs/3773517075?check_suite_focus=true)

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
          registry-url: https://registry.npmjs.org/
      - run: npm i -g pnpm @antfu/ni
      - run: nci
      - run: nr test --if-present
      - run: npx conventional-github-releaser -p angular
        env:
          CONVENTIONAL_GITHUB_RELEASER_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

根据每次 tags 推送，执行。

```bash
# 全局安装 pnpm 和 ni
npm i -g pnpm @antfu/ni
```

```bash
# 如何存在 test 命令则执行
nr test --if-present
```

nci - clean install

```bash
nci
# npm ci
# 简单说就是不更新锁文件
# yarn install --frozen-lockfile
# pnpm install --frozen-lockfile
```

最后 `npx conventional-github-releaser -p angular`

- [conventional-github-releaser](https://www.npmjs.com/package/conventional-github-releaser)

生成 `changelog`。
