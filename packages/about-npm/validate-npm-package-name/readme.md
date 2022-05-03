# validate-npm-package-name 检测 npm 包是否符合标准

- https://www.npmjs.com/package/validate-npm-package-name
- https://github.com/npm/validate-npm-package-name

参考好文：

- [每天一个npm包：validate-npm-package-name](https://zhuanlan.zhihu.com/p/362147023)

## 目标

- 了解作用和使用场景
- 源码分析

## 作用

此包导出一个同步函数, 该函数将一个 string 作为入参, 并返回一个具有两个属性的对象:

- validForNewPackages::Boolean
- validForOldPackages::Boolean

使用场景

```js
// https://github.com/facebook/create-react-app/blob/a422bf227cf5294a34d68696664e9568a152fd8f/packages/create-react-app/createReactApp.js#L828
function checkAppName(appName) {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    console.error(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          `"${appName}"`
        )} because of npm naming restrictions:\n`
      )
    );
    [
      ...(validationResult.errors || []),
      ...(validationResult.warnings || []),
    ].forEach(error => {
      console.error(chalk.red(`  * ${error}`));
    });
    console.error(chalk.red('\nPlease choose a different project name.'));

    // 退出进程
    process.exit(1);
  }
  ...
}
```

## 源码分析

通过源码, 可以学习到一个合格的包名需要符合哪些规范.

`validate-npm-package-name` 依赖了另一个包 `builtins`, 这个包也很小, 可以看到所有的 nodejs 内置模块, 还能了解下模块新增的历史.

- https://www.npmjs.com/package/builtins
- https://github.com/juliangruber/builtins/blob/master/index.js

```js
console.log(process.version) // 取当前 node 版本

// http://nodejs.cn/api/process/process_version.html
```

代码量比较少, 直接贴源码

```js
// https://github.com/npm/validate-npm-package-name/blob/main/index.js
'use strict'

var scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
// 这个是 node 内置模块名列表
var builtins = require('builtins')
var blacklist = [
  'node_modules',
  'favicon.ico'
]

var validate = module.exports = function (name) {
  // 警告：用于表示过去package name允许、如今不允许的兼容error
  var warnings = []
  // 存储不符号合格的包名的规则
  var errors = []

  // 校验规则
  if (name === null) {
    errors.push('name cannot be null')
    return done(warnings, errors)
  }

  if (name === undefined) {
    errors.push('name cannot be undefined')
    return done(warnings, errors)
  }

  if (typeof name !== 'string') {
    errors.push('name must be a string')
    return done(warnings, errors)
  }

  if (!name.length) {
    errors.push('name length must be greater than zero')
  }

  if (name.match(/^\./)) {
    errors.push('name cannot start with a period')
  }

  if (name.match(/^_/)) {
    errors.push('name cannot start with an underscore')
  }

  if (name.trim() !== name) {
    errors.push('name cannot contain leading or trailing spaces')
  }

  // No funny business
  blacklist.forEach(function (blacklistedName) {
    if (name.toLowerCase() === blacklistedName) {
      errors.push(blacklistedName + ' is a blacklisted name')
    }
  })

  // Generate warnings for stuff that used to be allowed

  // core module names like http, events, util, etc
  builtins.forEach(function (builtin) {
    if (name.toLowerCase() === builtin) {
      warnings.push(builtin + ' is a core module name')
    }
  })

  // really-long-package-names-------------------------------such--length-----many---wow
  // the thisisareallyreallylongpackagenameitshouldpublishdowenowhavealimittothelengthofpackagenames-poch.
  if (name.length > 214) {
    warnings.push('name can no longer contain more than 214 characters')
  }

  // mIxeD CaSe nAMEs
  if (name.toLowerCase() !== name) {
    warnings.push('name can no longer contain capital letters')
  }

  // 分割后取最后一项包名(去除 scope), 校验不能包含特殊字符 ~'!()*
  if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
    warnings.push('name can no longer contain special characters ("~\'!()*")')
  }

  // 包名不能包含 non-url-safe 字符 (这里可以复习下 url 参数处理)
  // 关于 encodeURIComponent 不转义哪些字符 `A-Z a-z 0-9 - _ . ! ~ * ' ( )` 其他都转义
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  if (encodeURIComponent(name) !== name) {
    // Maybe it's a scoped package name, like @user/package
    var nameMatch = name.match(scopedPackagePattern)
    if (nameMatch) {
      var user = nameMatch[1]
      var pkg = nameMatch[2]
      if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
        return done(warnings, errors)
      }
    }

    errors.push('name can only contain URL-friendly characters')
  }

  return done(warnings, errors)
}

validate.scopedPackagePattern = scopedPackagePattern

var done = function (warnings, errors) {
  var result = {
    validForNewPackages: errors.length === 0 && warnings.length === 0,
    validForOldPackages: errors.length === 0,
    warnings: warnings,
    errors: errors
  }
  if (!result.warnings.length) delete result.warnings
  if (!result.errors.length) delete result.errors
  return result
}
```

## 知识点

- match
- non-url-safe
  - encodeURIComponent
  - encodeURI

```js
function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
```
