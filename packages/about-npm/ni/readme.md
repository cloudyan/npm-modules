<!-- 源码分析 Source code analysis，由 `pnpm create tpl sca` 生成 -->
# `ni`

use the right package manager

- https://www.npmjs.com/package/@antfu/ni
- https://github.com/antfu/ni#readme

参考好文

- 若川 https://juejin.cn/post/7023910122770399269 推荐

之前有写一个 [cdn-cli](https://github.com/cloudyan/cdn-cli) 工具，实现上传文件到阿里云 OSS `cdn deploy [source] [target]`

前面看了 [configstore](../configstore/readme.md) 做配置文件，兼容性考虑很全面。

这次看 ni 的设计实现，第一感觉就是设计精美，结构优良，又收益了。

## 目标

- 作用
- 源码分析

## 作用

`ni` 会假设您使用锁文件（您应该使用），这是前提。

在它运行之前，它会检测你的 `yarn.lock` / `pnpm-lock.yaml` / `package-lock.json` 以了解当前的包管理器，并运行相应的命令。

```bash
使用 `ni` 在项目中安装依赖时：
  假设你的项目中有锁文件 `yarn.lock`，那么它最终会执行 `yarn install` 命令。
  假设你的项目中有锁文件 `pnpm-lock.yaml`，那么它最终会执行 `pnpm i` 命令。
  假设你的项目中有锁文件 `package-lock.json`，那么它最终会执行 `npm i` 命令。

使用 `ni -g vue-cli` 安装全局依赖时
  默认使用 `npm i -g vue-cli`

当然不只有 `ni` 安装依赖。
  还有 `nr` - run
  `nx` - execute
  `nu` - upgrade
  `nci` - clean install
  `nrm` - remove
```

> `ni` 相关的命令，都可以在末尾追加 `\?`，表示只打印，不是真正执行。

这个可以用来做测试验证。

假如项目目录下没有锁文件，默认就会让用户从`npm`、`yarn`、`pnpm`选择，然后执行相应的命令。 但如果在`~/.nirc`文件中，设置了全局默认的配置，则使用默认配置执行对应命令。

```conf
; ~/.nirc

; fallback when no lock found
defaultAgent=npm # default "prompt"

; for global installs
globalAgent=npm
```

如此看，这个工具必然会做以下三件事：

1. 根据锁文件猜测用哪个包管理器 npm/yarn/pnpm
2. 抹平不同的包管理器的命令差异
3. 最终运行相应的脚本

### 使用

```bash
npm i -g @antfu/ni
```

如果全局安装遇到冲突，可以加上 `--force` 参数强制安装。

#### ni - install

```bash
ni

# npm install
# yarn install
# pnpm install


ni axios

# npm i axios
# yarn add axios
# pnpm add axios
```

#### nr - run

```bash
nr dev --port=3000

# npm run dev -- --port=3000
# yarn run dev --port=3000
# pnpm run dev -- --port=3000
# TODO: 这里的 -- 是什么作用


nr
# 交互式选择命令去执行
# interactively select the script to run
# supports https://www.npmjs.com/package/npm-scripts-info convention


nr -

# 重新执行最后一次执行的命令
# rerun the last command
```

#### nx - execute

```bash
nx jest

# npx jest
# yarn dlx jest
# pnpm dlx jest
```

## 源码分析

看源码，要一边调试，一边验证逻辑想法，这样看效果才好

TODO: 这里需要补充一篇看源码环境准备相关的知识介绍。



## 知识点



## 扩展
