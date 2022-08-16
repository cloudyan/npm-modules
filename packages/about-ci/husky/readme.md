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

husky 源码非常精简

**bin.ts**

```ts
#!/usr/bin/env node
import p = require('path')
import h = require('./')

// Show usage and exit with code
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
const hook = (fn: (a1: string, a2: string) => void) => (): void =>
  // Show usage if no arguments are provided or more than 2
  !ln || ln > 2 ? help(2) : fn(x, y)

// CLI commands
const cmds: { [key: string]: () => void } = {
  install: (): void => (ln > 1 ? help(2) : h.install(x)),
  uninstall: h.uninstall,
  set: hook(h.set),
  add: hook(h.add),
  ['-v']: () =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
    console.log(require(p.join(__dirname, '../package.json')).version),
}

// Run CLI
try {
  // Run command or show usage for unknown command
  cmds[cmd] ? cmds[cmd]() : help(0)
} catch (e) {
  console.error(e instanceof Error ? `husky - ${e.message}` : e)
  process.exit(1)
}
```

**index.ts**

```ts
import cp = require('child_process')
import fs = require('fs')
import p = require('path')

// Logger
const l = (msg: string): void => console.log(`husky - ${msg}`)

// Git command
const git = (args: string[]): cp.SpawnSyncReturns<Buffer> =>
  cp.spawnSync('git', args, { stdio: 'inherit' })

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

export function add(file: string, cmd: string): void {
  if (fs.existsSync(file)) {
    fs.appendFileSync(file, `${cmd}\n`)
    l(`updated ${file}`)
  } else {
    set(file, cmd)
  }
}

export function uninstall(): void {
  git(['config', '--unset', 'core.hooksPath'])
}

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
