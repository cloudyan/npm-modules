# husky

- https://typicode.github.io/husky/
- https://github.com/typicode/husky

> Modern native git hooks made easy

Husky 支持所有 [Git 钩子](https://git-scm.com/docs/githooks)。

## 目标

- 作用
- 源码分析

## 作用

husky 可以让我们向项目中方便地添加 git hooks。

### 出现原因

使用 Git 钩子最直观的方式是操作 `.git/hooks` 下的示例文件，将对应钩子文件的 `.sample` 后缀名移除即可启用。然而这种操作方式存在弊端：

- 需要操作项目范围外的 `.git` 目录
- 无法同步 `.git/hooks` 到远程仓库

### 解决方案

上面的两个弊端可以通过为 Git 指定 hooks 目录 `core.hooksPath` 完美避过，Husky 便是基于此方案实现。

`husky@8` 要求 git [`2.9+`](https://raw.githubusercontent.com/git/git/master/Documentation/RelNotes/2.9.0.txt)

### 使用

```bash
# 自动安装（推荐）
# https://typicode.github.io/husky/#/?id=automatic-recommended
npx husky-init && npm install       # npm
npx husky-init && yarn              # Yarn 1
yarn dlx husky-init --yarn2 && yarn # Yarn 2+
pnpm dlx husky-init && pnpm install # pnpm

或使用

npx auto-husky

或手动操作

npm i -D husky
# 手动启用 Git 挂钩
npm set-script prepare "husky install"
npm run prepare
```

config

```bash
# Add a hook:
npx husky add .husky/pre-commit "npx --no -- lint-staged"
# 或
npx husky add .husky/pre-commit "npm run lint-staged"

npx husky add .husky/pre-commit "npm test"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "${1}"' # 这个执行有问题
yarn husky add .husky/commit-msg 'npx --no -- commitlint --edit "${1}"' # 这个可以

# husky uninstall
npm uninstall husky && git config --unset core.hooksPath
```

注意: 针对客户端 git hooks 而言，很容易通过 `git commit --no-verify` 而跳过检查，所以对应规范需要在 CI 流程中卡点。

## 源码分析

husky 源码比较精简，共三个文件

- src/index.ts
- src/bin.ts
- husky.sh

**src/index.ts**

这里包含了，git 命令操作，huksy 的 install, set, add, uninstall 命令操作。

```ts
import cp = require('child_process') // 子进程
import fs = require('fs')
import p = require('path')

// Logger
const l = (msg: string): void => console.log(`husky - ${msg}`)

// Git command
const git = (args: string[]): cp.SpawnSyncReturns<Buffer> =>
  // 同步执行 git 命令
  cp.spawnSync('git', args, { stdio: 'inherit' })

/**
 * install 初始化设置
 * 1. git rev-parse 底层命令
 * 2. 创建 .husky 必须在 cwd 当前目录
 * 3. 必须存在 .git 文件，否则无法操作 .git/config
 * 4. 创建文件
 *    1. 在 .husky 文件下创建文件夹 '_'
 *    2. 在 '_' 文件下写入文件 .gitignore, 文件内容为 ‘*’, 忽略该目录下所有文件的 git 提交
 *    3. 复制 husky 项目根目录下的 husky.sh 文件 到 目标项目的 '_' 目录下，名称不变
 *    4. 执行 git 操作，修改 githook 的执行路径为目标项目的 .husky 文件下
 *    5. 执行成功 or 失败后的 log 提示
*/
export function install(dir = '.husky'): void {
  if (process.env.HUSKY === '0') {
    l('HUSKY env variable is set to 0, skipping install')
    return
  }

  // Ensure that we're inside a git repository
  // If git command is not found, status is null and we should return.
  // That's why status value needs to be checked explicitly.
  if (git(['rev-parse']).status !== 0) {
    return
  }

  // Custom dir help
  const url = 'https://typicode.github.io/husky/#/?id=custom-directory'

  // Ensure that we're not trying to install outside of cwd
  if (!p.resolve(process.cwd(), dir).startsWith(process.cwd())) {
    throw new Error(`.. not allowed (see ${url})`)
  }

  // Ensure that cwd is git top level
  if (!fs.existsSync('.git')) {
    throw new Error(`.git can't be found (see ${url})`)
  }

  try {
    // Create .husky/_
    fs.mkdirSync(p.join(dir, '_'), { recursive: true })

    // Create .husky/_/.gitignore
    fs.writeFileSync(p.join(dir, '_/.gitignore'), '*')

    // Copy husky.sh to .husky/_/husky.sh
    fs.copyFileSync(p.join(__dirname, '../husky.sh'), p.join(dir, '_/husky.sh'))

    // Configure repo
    const { error } = git(['config', 'core.hooksPath', dir])
    if (error) {
      throw error
    }
  } catch (e) {
    l('Git hooks failed to install')
    throw e
  }

  l('Git hooks installed')
}

/**
 * set: 创建指定的 githook 文件，并写入文件内容
 * 1. 如果文件目录不存在, 中断并提示手动执行 husky install 初始化配置
 * 2. 写入文件, 指定解释器为 sh 执行 shell 脚本, cmd 动态参数，为开发者想要在这个 githook 阶段执行的操作，一般为脚本 例：npm run lint
 *    这里有配置文件权限，755。
*/
export function set(file: string, cmd: string): void {
  const dir = p.dirname(file)
  if (!fs.existsSync(dir)) {
    throw new Error(
      `can't create hook, ${dir} directory doesn't exist (try running husky install)`,
    )
  }

  fs.writeFileSync(
    file,
    `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

${cmd}
`,
    { mode: 0o0755 },
  )

  l(`created ${file}`)
}

/**
 * add: 在已有的 githook 文件中追加命令
 * 1. 已存在则追加内容
 * 2. 不存在则新建
 */
export function add(file: string, cmd: string): void {
  if (fs.existsSync(file)) {
    fs.appendFileSync(file, `${cmd}\n`)
    l(`updated ${file}`)
  } else {
    set(file, cmd)
  }
}

/**
 * uninstall: 卸载 install 中指定的 hooksPath 的路径，恢复为 git 默认的 githook 路径
*/
export function uninstall(): void {
  git(['config', '--unset', 'core.hooksPath'])
}

```

**src/bin.ts**

用于接收命令行参数，执行 `src/index.ts` 中的命令操作

```ts
#!/usr/bin/env node         // 指定使用 node 解析运行文件
import p = require('path')
import h = require('./')

// Show usage and exit with code
// 打印帮助命令，这里没有使用 commander 包，而是使用进程方法获取参数，所以自己打印了帮助 log
// 减少了依赖，更轻量精简
function help(code: number) {
  console.log(`Usage:
  husky install [dir] (default: .husky)
  husky uninstall
  husky set|add <file> [cmd]`)
  process.exit(code)
}

// Get CLI arguments
const [, , cmd, ...args] = process.argv
const ln = args.length
const [x, y] = args

// Set or add command in hook
// 处理需要参数的主文件的函数并执行, 对错误的参数进行了长度判断
const hook = (fn: (a1: string, a2: string) => void) => (): void =>
  // Show usage if no arguments are provided or more than 2
  !ln || ln > 2 ? help(2) : fn(x, y)

// CLI commands
// 没有参数的直接调用，需要参数的，套了一层 hook 函数，用于参数处理
const cmds: { [key: string]: () => void } = {
  install: (): void => (ln > 1 ? help(2) : h.install(x)),
  uninstall: h.uninstall, // 没有参数直接调用
  set: hook(h.set),
  add: hook(h.add),
  ['-v']: () =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
    console.log(require(p.join(__dirname, '../package.json')).version),
}

// Run CLI
try {
  // Run command or show usage for unknown command
  // 令存在则运行指定函数，不存在则打印帮助 log
  cmds[cmd] ? cmds[cmd]() : help(0)
} catch (e) {
  console.error(e instanceof Error ? `husky - ${e.message}` : e) // 打印 error 信息
  process.exit(1) // 报错退出
}
```

**husky.sh**

githook

```bash
#!/bin/sh     # 指定该文件使用 shell 解析执行

# 执行当前目录下指定的文件。
# $0 为 当前脚本名称 调用 husky.sh 脚本
. "$(dirname "$0")/_/husky.sh"

npm test
```

husky.sh

```bash
#!/usr/bin/env sh

# 判断变量 husky_skip_init 的长度是否为 0
if [ -z "$husky_skip_init" ]; then
  # 为 0 时， 创建 debug 函数, 用来打印报错日志
  debug () {
    # HUSKY_DEBUG 为 “1” 时打印
    if [ "$HUSKY_DEBUG" = "1" ]; then
      # // $1 表示参数
      echo "husky (debug) - $1"
    fi
  }

  # 声明一个只读参数, 内容为 basename + 文件名称
  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  # 判断变量 HUSKY 是否 = “0”
  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  # 判断 ~/.huskyrc 是否为普通文件
  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  # 声明只读变量
  readonly husky_skip_init=1
  export husky_skip_init
  # 当前文件名 是否在 传进来的参数中 存在则执行
  sh -e "$0" "$@"
  exitCode="$?"

  # 当 exitCode 不等于 0 时，打印当前执行的 hook 名称，以及退出码
  if [ $exitCode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitCode (error)"
  fi

  # 当 exitCode 等于 127 时，提示找不到命令
  if [ $exitCode = 127 ]; then
    echo "husky - command not found in PATH=$PATH"
  fi

  exit $exitCode
fi

```


## 知识点

- [Git 钩子](https://git-scm.com/docs/githooks)
- `core.hooksPath`
- `--no-verify`
- `--no-install` VS `--no`
- `--`
- `npm set-script`

## 扩展知识

git 允许在各种操作之前添加一些 hook 脚本，如未正常运行则 git 操作不通过。

- Husky Hooks
  1. pre-commit
  2. pre-push
  3. post-merge
  4. pre-receive
  5. prepare-commmit-msg
- Task Runner
  1. Lint commit-msg
  2. Analyze code
  3. Format code
  4. Run tests
  5. Run scripts

git hooks 可使用 `core.hooksPath`（git@2.9+） 自定义脚本位置。

**为什么用 husky？**

我们只会用到“提交工作流”钩子，提交工作流包含 4 个钩子：

- `pre-commit` 在提交信息**编辑前**运行，在这个阶段塞入**代码检查**流程，检查未通过返回非零值即可停止提交流程；
- `prepare-commit-msg` 在默认信息被创建之后运行，此时正是**启动编辑器前**，可在这个阶段加载 `commitizen` 之类的辅助填写工具；
- `commit-msg` 在**完成编辑后**运行，可在这个阶段借助 `commitlint` 进行提交信息规范性检查；
- `post-commit` 在**提交完成后**运行，在这个阶段一般做一些通知操作。

使用 Git 钩子最直观的方式是操作 `.git/hooks` 下的示例文件，将对应钩子文件的 `.sample` 后缀名移除即可启用。然而这种操作方式存在弊端：

- 需要操作项目范围外的 `.git` 目录
- 无法同步 `.git/hooks` 到远程仓库

两个弊端可以通过为 Git 指定 hooks 目录 `core.hooksPath` 完美避过，Husky 便是基于此方案实现

```bash
# husky 即通过自定义 core.hooksPath 并将 npm scripts 写入其中的方式来实现此功能。
git config 'core.hooksPath' .husky

npm set-script prepare "husky install"
```

注: husky@4 老版本配置方式是不一样的，如下

```json
"husky": {
  "hooks": {
    "pre-commit": "pretty-quick --staged"
  }
},
```

注: `--no-install` 选项已弃用，并将转换为 `--no`

在 CI/Docker/Prod 中禁用 `husky`?

参见[官方文档](https://typicode.github.io/husky/#/?id=disable-husky-in-cidockerprod)

参考文档

- https://www.jianshu.com/p/3e2df03f63f3
