# `remote-git-tags` callback promisify 化的 Node.js 源码实现

- https://www.npmjs.com/package/remote-git-tags
- https://github.com/sindresorhus/remote-git-tags#readme

参考好文：

- 若川 [从22行有趣的源码库中，我学到了 callback promisify 化的 Node.js 源码实现](https://juejin.cn/post/7028731182216904740)

## 目标

- 了解作用和使用场景
- 源码分析

## 作用

Get tags from a remote Git repo

从远程仓库获取所有标签。

**使用**

```js
import remoteGitTags from 'remote-git-tags';

console.log(await remoteGitTags('https://github.com/lxchuan12/blog.git'));
//=> Map {'3.0.5' => 'c39343e7e81d898150191d744efbdfe6df395119', …}
```

原理：通过执行 `git ls-remote --tags repoUrl` （仓库路径）获取 `tags`

应用场景：可以看有哪些包依赖的这个包。 [npm 包描述信息](https://www.npmjs.com/package/remote-git-tags)

其中一个比较熟悉的是 [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)

> `npm-check-updates` 将您的 `package.json` 依赖项升级到最新版本，忽略指定的版本。

还有场景可能是 `github` 中获取所有 `tags` 信息，切换 `tags` 或者选定 `tags` 发布版本等，比如微信小程序版本。

看源码前先看 `package.json` 文件。

```js
{
  "name": "remote-git-tags",
  "version": "4.0.0",
  "description": "Get tags from a remote Git repo",
  // 指定 Node 以什么模块加载，缺省时默认是 commonjs
  "type": "module",
  "exports": "./index.js",
  // 指定 nodejs 的版本
  "engines": {
    "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
  },
  // xo 是个 ESLint 包装器
  "scripts": {
    "test": "xo && ava"
  },
  "files": [
    "index.js"
  ]
}
```

众所周知，Node 之前一直是 CommonJS 模块机制。 Node 13 添加了对标准 ES6 模块的支持。

告诉 Node 它要加载的是什么模块的最简单的方式，就是将信息编码到不同的扩展名中。

- 如果是 .mjs 结尾的文件，则 Node 始终会将它作为 ES6 模块来加载。
- 如果是 .cjs 结尾的文件，则 Node 始终会将它作为 CommonJS 模块来加载。
- 对于以 .js 结尾的文件，默认是 CommonJS 模块。如果同级目录及所有目录有 package.json 文件，且 type 属性为module 则使用 ES6 模块。type 值为 commonjs 或者为空或者没有 package.json 文件，都是默认 commonjs 模块加载。

关于 Node 模块加载方式，在《JavaScript权威指南第7版》16.1.4 Node 模块 小节，有更加详细的讲述。此书第16章都是讲述Node，感兴趣的读者可以进行查阅。

还有个配置 `.npmrc`

```yaml
# 该配置会导致 npm i 不生成 package-lock.json 文件
package-lock=false
```

## 源码分析

代码比较少，直接贴源码

```js
import { promisify } from 'node:util';
import childProcess from 'node:child_process';

const execFile = promisify(childProcess.execFile);

export default async function remoteGitTags(repoUrl) {
  const {stdout} = await execFile('git', ['ls-remote', '--tags', repoUrl]);
  const tags = new Map();

  for (const line of stdout.trim().split('\n')) {
    const [hash, tagReference] = line.split('\t');

    // Strip off the indicator of dereferenced tags so we can override the
    // previous entry which points at the tag hash and not the commit hash
    // `refs/tags/v9.6.0^{}` → `v9.6.0`
    const tagName = tagReference.replace(/^refs\/tags\//, '').replace(/\^{}$/, '');

    tags.set(tagName, hash);
  }

  return tags;
}
```

- [child_process.execFile 文档](http://nodejs.cn/api/child_process.html#child_processexecfilefile-args-options-callback)

`child_process.execFile()` 函数与 `child_process.exec()` 类似，不同之处在于它默认不衍生 `shell`。 而是，指定的可执行文件 `file` 直接作为新进程衍生，使其比 `child_process.exec()` 略有效率。由于未衍生 shell，因此不支持 I/O 重定向和文件通配等行为。

一句话简述 `remote-git-tags` 原理：使用`Node.js`的子进程 `child_process` 模块的 `execFile` 方法执行 `git ls-remote --tags repoUrl` 获取所有 `tags` 及对应的 `hash` 值, 存放在 `Map` 对象中。

### `git ls-remote --tags`

支持远程仓库链接。

[git ls-remote 文档](https://git-scm.com/docs/git-ls-remote)

```bash
# 示例
git ls-remote --tags https://github.com/vuejs/vue-next.git
```

把所有 `tags` 及对应的 `hash` 值, 存放在 `Map` 对象中。

### `node:util`

node:util [Node 模块文档说明](https://nodejs.org/dist/latest-v16.x/docs/api/modules.html#core-modules)

> Core modules can also be identified using the node: prefix, in which case it bypasses the require cache. For instance, require('node:http') will always return the built in HTTP module, even if there is require.cache entry by that name.

也就是说引用 `node` 原生库可以加 `node:` 前缀，比如 `import util from 'node:util'`, 这样会绕过 `require.cache`

- [node utils 源码](https://github.com/nodejs/node/blob/ccb8aae3932c13f33622203b2ffc5a33120e9d40/lib/internal/util.js#L324)
- [util.promisify 官方文档](http://nodejs.cn/api/util/util_promisify_original.html)

```js
// 学习源码，需要边调试边学习
// https://github.com/nodejs/node/blob/ccb8aae3932c13f33622203b2ffc5a33120e9d40/lib/internal/util.js#L324
const kCustomPromisifiedSymbol = SymbolFor('nodejs.util.promisify.custom');
const kCustomPromisifyArgsSymbol = Symbol('customPromisifyArgs');

let validateFunction;

function promisify(original) {
  // Lazy-load to avoid a circular dependency.
  if (validateFunction === undefined)
    ({ validateFunction } = require('internal/validators'));

  validateFunction(original, 'original');

  if (original[kCustomPromisifiedSymbol]) {
    const fn = original[kCustomPromisifiedSymbol];

    validateFunction(fn, 'util.promisify.custom');

    return ObjectDefineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
  }

  // Names to create an object from in case the callback receives multiple
  // arguments, e.g. ['bytesRead', 'buffer'] for fs.read.
  const argumentNames = original[kCustomPromisifyArgsSymbol];

  function fn(...args) {
    return new Promise((resolve, reject) => {
      ArrayPrototypePush(args, (err, ...values) => {
        if (err) {
          return reject(err);
        }
        if (argumentNames !== undefined && values.length > 1) {
          const obj = {};
          for (let i = 0; i < argumentNames.length; i++)
            obj[argumentNames[i]] = values[i];
          resolve(obj);
        } else {
          resolve(values[0]);
        }
      });
      ReflectApply(original, this, args);
    });
  }

  ObjectSetPrototypeOf(fn, ObjectGetPrototypeOf(original));

  ObjectDefineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return ObjectDefineProperties(
    fn,
    ObjectGetOwnPropertyDescriptors(original)
  );
}

promisify.custom = kCustomPromisifiedSymbol;
```

## 知识点

- `node:util`
- `git ls-remote --tags`
- `util.promisify`
  - `Map`
  - `for...of`
  - 正则
  - 解构赋值
  - `Symbol`
  - `SymbolFor`
  - `ReflectApply`
  - `ObjectSetPrototypeOf`
  - `ObjectDefineProperty`
  - `ObjectGetOwnPropertyDescriptors`

这些知识可以查看[esma规范](https://yanhaijing.com/es5/#about)，或者阮一峰老师的《[ES6 入门教程](https://es6.ruanyifeng.com/)》 等书籍。

还有经典的 MDN 文档，我在这里学习 [learn-javascript](https://github.com/cloudyan/learn-javascript)

promisify 也可以看 [es6-promisify](https://github.com/mikehall314/es6-promisify) 这个库学习

或 [`diy-promisify`](./diy-promisify.js)

