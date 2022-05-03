# `cross-env`

跨平台设置和使用环境变量。（此库目前处于维护模式。不会添加新功能，只会修复严重和常见的错误，且与 NodeJS 保持同步）

- https://www.npmjs.com/package/cross-env
- https://github.com/kentcdodds/cross-env#readme

这个库大部分前端都有接触过，这里将之前的学习稍作整理。

参考好文：

- https://juejin.cn/post/7041123890201886757

## 目标

- 作用
- 源码分析

## 作用

### 出现原因

当使用 `NODE_ENV=production` 来设置环境变量时，大多数Windows命令提示将会报错。因为Windows和POSIX 设置和使用环境变量方式不同。

- POSIX 系统环境变量使用 `$ENV_VAR` 格式
  - `EXPORT NODE_ENV=production && webpack`
- Windows 系统环境变量使用 `％ENV_VAR％` 格式
  - `SET NODE_ENV=production && webpack`

windows不支持 `NODE_ENV=development` 的方式来设置环境变量，会报错（[Bash on Windows](https://docs.microsoft.com/zh-cn/windows/wsl/about) 例外）

### 解决方案

`cross-env` 能够提供一个设置环境变量的scripts，让你能够以unix方式设置环境变量，然后在windows上也能兼容运行。这样你只需要配置 POSIX 格式即可跨平台使用环境变量了。

```bash
# 统一格式
cross-env NODE_ENV=production && webpack
```

设置完环境变量，nodejs 环境可以在 `process.env` 上获取所有的环境变量

### 使用

```bash
npm i cross-env --save-dev
```

```js
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```

`NODE_ENV` 环境变量将由 `cross-env` 设置

## 源码分析

**is-windows.js**

```js
module.exports = () =>
  process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE)
```

**command.js**

不是 Windows，直接返回，是 Windows 则将 `$my_var` or `${my_var}` 变为 `%my_var%`

```js
const path = require('path')
const isWindows = require('./is-windows')

module.exports = commandConvert

/**
 * Converts an environment variable usage to be appropriate for the current OS
 * @param {String} command Command to convert
 * @param {Object} env Map of the current environment variable names and their values
 * @param {boolean} normalize If the command should be normalized using `path`
 * after converting
 * @returns {String} Converted command
 */
function commandConvert(command, env, normalize = false) {
  if (!isWindows()) {
    return command
  }
  const envUnixRegex = /\$(\w+)|\${(\w+)}/g // $my_var or ${my_var}
  const convertedCmd = command.replace(envUnixRegex, (match, $1, $2) => {
    const varName = $1 || $2
    // In Windows, non-existent variables are not replaced by the shell,
    // so for example "echo %FOO%" will literally print the string "%FOO%", as
    // opposed to printing an empty string in UNIX. See kentcdodds/cross-env#145
    // If the env variable isn't defined at runtime, just strip it from the command entirely
    return env[varName] ? `%${varName}%` : ''
  })
  // Normalization is required for commands with relative paths
  // For example, `./cmd.bat`. See kentcdodds/cross-env#127
  // However, it should not be done for command arguments.
  // See https://github.com/kentcdodds/cross-env/pull/130#issuecomment-319887970
  return normalize === true ? path.normalize(convertedCmd) : convertedCmd
}
```

**variable.js**

```js
const isWindows = require('./is-windows')

const pathLikeEnvVarWhitelist = new Set(['PATH', 'NODE_PATH'])

module.exports = varValueConvert

/**
 * This will transform UNIX-style list values to Windows-style.
 * For example, the value of the $PATH variable "/usr/bin:/usr/local/bin:."
 * will become "/usr/bin;/usr/local/bin;." on Windows.
 * @param {String} varValue Original value of the env variable
 * @param {String} varName Original name of the env variable
 * @returns {String} Converted value
 */
function replaceListDelimiters(varValue, varName = '') {
  const targetSeparator = isWindows() ? ';' : ':'
  if (!pathLikeEnvVarWhitelist.has(varName)) {
    return varValue
  }

  return varValue.replace(/(\\*):/g, (match, backslashes) => {
    if (backslashes.length % 2) {
      // Odd number of backslashes preceding it means it's escaped,
      // remove 1 backslash and return the rest as-is
      return match.substr(1)
    }
    return backslashes + targetSeparator
  })
}

/**
 * This will attempt to resolve the value of any env variables that are inside
 * this string. For example, it will transform this:
 * cross-env FOO=$NODE_ENV BAR=\\$NODE_ENV echo $FOO $BAR
 * Into this:
 * FOO=development BAR=$NODE_ENV echo $FOO
 * (Or whatever value the variable NODE_ENV has)
 * Note that this function is only called with the right-side portion of the
 * env var assignment, so in that example, this function would transform
 * the string "$NODE_ENV" into "development"
 * @param {String} varValue Original value of the env variable
 * @returns {String} Converted value
 */
function resolveEnvVars(varValue) {
  const envUnixRegex = /(\\*)(\$(\w+)|\${(\w+)})/g // $my_var or ${my_var} or \$my_var
  return varValue.replace(
    envUnixRegex,
    (_, escapeChars, varNameWithDollarSign, varName, altVarName) => {
      // do not replace things preceded by a odd number of \
      if (escapeChars.length % 2 === 1) {
        return varNameWithDollarSign
      }
      return (
        escapeChars.substr(0, escapeChars.length / 2) +
        (process.env[varName || altVarName] || '')
      )
    },
  )
}

/**
 * Converts an environment variable value to be appropriate for the current OS.
 * @param {String} originalValue Original value of the env variable
 * @param {String} originalName Original name of the env variable
 * @returns {String} Converted value
 */
function varValueConvert(originalValue, originalName) {
  return resolveEnvVars(replaceListDelimiters(originalValue, originalName))
}
```

**index.js**

```js
const {spawn} = require('cross-spawn')
const commandConvert = require('./command')
const varValueConvert = require('./variable')

module.exports = crossEnv

const envSetterRegex = /(\w+)=('(.*)'|"(.*)"|(.*))/

// process.argv.slice(2)
function crossEnv(args, options = {}) {
  const [envSetters, command, commandArgs] = parseCommand(args)
  const env = getEnvVars(envSetters)

  // 如果 command 存在，则利用 spawn 开启子进程
  // 并附带上 commandArgs, 同时将子进程的 process.env 设置成 env
  if (command) {
    const proc = spawn(
      // run `path.normalize` for command(on windows)
      commandConvert(command, env, true),
      // by default normalize is `false`, so not run for cmd args
      commandArgs.map(arg => commandConvert(arg, env)),
      {
        stdio: 'inherit',
        shell: options.shell,
        env,
      },
    )

    // http://nodejs.cn/api/process/signal_events.html
    process.on('SIGTERM', () => proc.kill('SIGTERM'))
    process.on('SIGINT', () => proc.kill('SIGINT'))
    process.on('SIGBREAK', () => proc.kill('SIGBREAK'))
    process.on('SIGHUP', () => proc.kill('SIGHUP'))
    proc.on('exit', (code, signal) => {
      let crossEnvExitCode = code
      // exit code could be null when OS kills the process(out of memory, etc) or due to node handling it
      // but if the signal is SIGINT the user exited the process so we want exit code 0
      if (crossEnvExitCode === null) {
        crossEnvExitCode = signal === 'SIGINT' ? 0 : 1
      }
      process.exit(crossEnvExitCode) //eslint-disable-line no-process-exit
    })
    return proc
  }
  return null
}

// cross-env NODE_ENV=production webpack --config build/webpack.config.js
// => ['NODE_ENV=production', 'webpack', '--config', 'build/webpack.config.js']
// 分为三部分 [envSetters, command, commandArgs]
// envSetters = { NODE_ENV: 'production' }
// command = 'webpack'
// commandArgs = ['--config', 'build/webpack.config.js']
function parseCommand(args) {
  const envSetters = {}
  let command = null
  let commandArgs = []
  for (let i = 0; i < args.length; i++) {
    const match = envSetterRegex.exec(args[i])
    if (match) {
      let value

      if (typeof match[3] !== 'undefined') {
        value = match[3]
      } else if (typeof match[4] === 'undefined') {
        value = match[5]
      } else {
        value = match[4]
      }

      envSetters[match[1]] = value
    } else {
      // No more env setters, the rest of the line must be the command and args
      let cStart = []
      cStart = args
        .slice(i)
        // Regex:
        // match "\'" or "'"
        // or match "\" if followed by [$"\] (lookahead)
        .map(a => {
          const re = /\\\\|(\\)?'|([\\])(?=[$"\\])/g
          // Eliminate all matches except for "\'" => "'"
          return a.replace(re, m => {
            if (m === '\\\\') return '\\'
            if (m === "\\'") return "'"
            return ''
          })
        })
      command = cStart[0]
      commandArgs = cStart.slice(1)
      break
    }
  }

  return [envSetters, command, commandArgs]
}

// 将 envSetters 与 process.env 合并为 env
function getEnvVars(envSetters) {
  const envVars = {...process.env}
  if (process.env.APPDATA) {
    envVars.APPDATA = process.env.APPDATA
  }
  Object.keys(envSetters).forEach(varName => {
    envVars[varName] = varValueConvert(envSetters[varName], varName)
  })
  return envVars
}
```

**bin/cross-env.js**

```js
#!/usr/bin/env node

const crossEnv = require('..')

crossEnv(process.argv.slice(2))
```

## 知识点

- `$ENV_VAR` POSIX
- `％ENV_VAR％` Windows
- `process.env`
- NodeJS 如何判断当前的操作系统
  - [`process.platform`](http://nodejs.cn/api/process.html#processplatform)
  - `process.env.OSTYPE `
- [`webpack.DefinePlugin`](https://webpack.docschina.org/plugins/define-plugin/)
  - 由于本插件会直接替换文本，因此提供的值必须在字符串本身中再包含一个**实际的引号**。通常，可以使用类似 `'"production"'` 这样的替换引号，或者直接用 `JSON.stringify('production')`。
- `path.normalize`
- `npm scripts`
  - npm 脚本的唯一要求就是可以在 Shell 执行，因此它不一定是 Node 脚本，任何可执行文件都可以写在里面
- `RegExp`
  - `/\w/` 等价于 `/[A-Za-z0-9_]/` https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions
  - `exec`
  - `match`
  - `?=` 正向先行断言 更多详细 https://www.runoob.com/w3cnote/reg-lookahead-lookbehind.html
- `cross-spawn` 解决 `spawn` 跨 Windows 平台的问题
  - spawn 开启子进程 http://nodejs.cn/api/child_process.html#child_processspawncommand-args-options
- `signal_events` 信号事件，稍作了解即可
  - http://nodejs.cn/api/process/signal_events.html

## 扩展知识

- nodejs 环境如何获取到环境变量
  - `process.env.xxx`
- react 组件中如何获取到环境变量
  - `webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)})`

`npm scripts`

当我们执行 `npm run build` 时，背后究竟发生了什么呢？

npm 脚本的原理非常简单。每当执行 `npm run`，就会自动新建一个 Shell，在这个 Shell 里面执行指定的脚本命令。因此，只要是 Shell（一般是 Bash）可以运行的命令，就可以写在 npm 脚本里面。

比较特别的是，`npm run` 新建的这个 Shell，会将当前目录的 `node_modules/.bin` 子目录加入 `PATH` 变量，执行结束后，再将 `PATH` 变量恢复原样。

这意味着，当前目录的 `node_modules/.bin` 子目录里面的所有脚本，都可以直接用脚本名调用，而不必加上路径。

比如，当前项目的依赖里面有 `cross-env`，只要直接写 `cross-env xxx` 就可以了。


参考：

- https://blog.csdn.net/qq_26927285/article/details/78105510
