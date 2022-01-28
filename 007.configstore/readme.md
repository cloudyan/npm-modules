# `configstore`

轻松加载和持久化配置，无需考虑位置和方式

- https://www.npmjs.com/package/configstore
- [configstore](https://github.com/yeoman/configstore#readme)

## 目标

- 作用
- 源码阅读
- 扩展
- 总结

之前有写过一个 [`@deepjs/storage`](https://www.npmjs.com/package/@deepjs/storage) 用于封装 `localStorage`, `sessionStorage`, 大体结构和这个有点类似。

这里来学习下流行库是怎么设计的，先看下 [npm](https://www.npmjs.com/package/configstore)  上的大体情况

- Readme
- Dependents 非常多的流行库都有引用它
  - update-notifier, forever, lighthouse, strapi, ...
- Weekly Downloads 10k

## 作用

轻松加载和保留配置，而无需考虑存储在哪里以及是怎么配置的

配置存储在位于环境变量 `$XDG_CONFIG_HOME` 如无，默认取值为 `~/.config`

```bash
# configstore 路径
~/.config/configstore/some-id.json
```

**用法**

还是要实操下，体会才更好，涉及到文件操作就无法右键 `RUN CODE` 来运行了

```js
import Configstore from 'configstore';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Create a Configstore instance.
const config = new Configstore(packageJson.name, {foo: 'bar'});

console.log(config.get('foo'));
//=> 'bar'

config.set('awesome', true);
console.log(config.get('awesome'));
//=> true

// Use dot-notation to access nested properties.
config.set('bar.baz', true);
console.log(config.get('bar'));
//=> {baz: true}

config.delete('awesome');
console.log(config.get('awesome'));
//=> undefined
```

## 源码分析

`configsotre` 的源码也不多，不过引用了几个三方包，可以先了解下做什么的，然后再来看源码分析

整体结构

```js
export default class Configstore {
  constructor(id, defaults, options = {}) {}
  get all() {}
  set all(value) {}
  get size() {}
  get(key) {}
  set(key, value) {}
  has(key) {}
  delete(key) {}
  clear() {}
  get path() {}
}
```

能看明白干什么的，也得写出来到底是干什么的。

```js
import path from 'path';
import os from 'os';
import fs from 'graceful-fs';
import {xdgConfig} from 'xdg-basedir';
import writeFileAtomic from 'write-file-atomic';
import dotProp from 'dot-prop';
import uniqueString from 'unique-string';

/**
 * 1. configDirectory: 存储当前操作系统的临时文件路径。Linux 通过 xdgConfig 包获取。
 *    其他操作系统通过 os.tmpdir() 获取, 后面再拼接一个 32 位的字符串。
 *        eg: 'C:\\Users\\userName\\AppData\\Local\\Tempb4de2a49c8ffa3fbee04446f045483b2'
 * 2. permissionError: 文件权限提示语
 * 3. mkdirOptions: 文件夹创建配置, mode 参数代表的是 linux 系统的目录权限, recursive 表示递归创建
 *        mode: 0o0600 只有拥有者有读写权限
 *        mode: 0o0700 只有拥有者有读、写、执行权限
 * 4. writeFileOptions: 写文件配置。
 */
const configDirectory = xdgConfig || path.join(os.tmpdir(), uniqueString());
const permissionError = 'You don\'t have access to this file.';
const mkdirOptions = {mode: 0o0700, recursive: true};
const writeFileOptions = {mode: 0o0600};

export default class Configstore {
  constructor(id, defaults, options = {}) {
    const pathPrefix = options.globalConfigPath ?
      path.join(id, 'config.json') :
      path.join('configstore', `${id}.json`);

    // 保存配置路径 configPath > configDirectory + pathPrefix
    this._path = options.configPath || path.join(configDirectory, pathPrefix);

    if (defaults) {
      this.all = {
        ...defaults,
        ...this.all
      };
    }
  }

  // 存取有异常的场景，就要做兼容处理
  get all() {
    try {
      // 同步以 utf-8 格式读取配置文件
      return JSON.parse(fs.readFileSync(this._path, 'utf8'));
    } catch (error) {
      // Create directory if it doesn't exist
      // 不存在，就返回 {}
      if (error.code === 'ENOENT') {
        return {};
      }

      // Improve the message of permission errors
      // 操作没有足够的权限
      if (error.code === 'EACCES') {
        error.message = `${error.message}\n${permissionError}\n`;
      }

      // Empty the file if it encounters invalid JSON
      if (error.name === 'SyntaxError') {
        writeFileAtomic.sync(this._path, '', writeFileOptions);
        return {};
      }

      throw error;
    }
  }

  // 存储数据，全量覆盖更新
  set all(value) {
    try {
      // Make sure the folder exists as it could have been deleted in the meantime
      // 同步递归的创建目录（给目录读写执行权限）
      fs.mkdirSync(path.dirname(this._path), mkdirOptions);

      // 同步写入配置内容，并给配置文件读写权限
      writeFileAtomic.sync(this._path, JSON.stringify(value, undefined, '\t'), writeFileOptions);
    } catch (error) {
      // Improve the message of permission errors
      if (error.code === 'EACCES') {
        error.message = `${error.message}\n${permissionError}\n`;
      }

      throw error;
    }
  }

  // 长度
  get size() {
    return Object.keys(this.all || {}).length;
  }

  get(key) {
    return dotProp.get(this.all, key);
  }

  set(key, value) {
    const config = this.all;

    // 参数长度不同处理, 支持对象格式传入配置
    if (arguments.length === 1) {
      for (const k of Object.keys(key)) {
        dotProp.set(config, k, key[k]);
      }
    } else {
      dotProp.set(config, key, value);
    }

    this.all = config;
  }

  has(key) {
    return dotProp.has(this.all, key);
  }

  delete(key) {
    const config = this.all;
    dotProp.delete(config, key);
    this.all = config;
  }

  clear() {
    this.all = {};
  }

  get path() {
    return this._path;
  }
}
```

### [xdg-basedir](https://www.npmjs.com/package/xdg-basedir), 源码如下

Get XDG Base Directory paths

```js
import os from 'os';
import path from 'path';

const homeDirectory = os.homedir();
const {env} = process;

export const xdgData = env.XDG_DATA_HOME ||
  (homeDirectory ? path.join(homeDirectory, '.local', 'share') : undefined);

export const xdgConfig = env.XDG_CONFIG_HOME ||
  (homeDirectory ? path.join(homeDirectory, '.config') : undefined);

export const xdgState = env.XDG_STATE_HOME ||
  (homeDirectory ? path.join(homeDirectory, '.local', 'state') : undefined);

export const xdgCache = env.XDG_CACHE_HOME || (homeDirectory ? path.join(homeDirectory, '.cache') : undefined);

export const xdgRuntime = env.XDG_RUNTIME_DIR || undefined;

export const xdgDataDirectories = (env.XDG_DATA_DIRS || '/usr/local/share/:/usr/share/').split(':');

if (xdgData) {
  xdgDataDirectories.unshift(xdgData);
}

export const xdgConfigDirectories = (env.XDG_CONFIG_DIRS || '/etc/xdg').split(':');

if (xdgConfig) {
  xdgConfigDirectories.unshift(xdgConfig);
}
```

### [`graceful-fs`](https://www.npmjs.com/package/graceful-fs)

`graceful-fs` 作为 `fs` 模块的替代品，旨在规范跨不同平台和环境的行为，并使文件系统访问对错误更具弹性。
`fs-extra` 是 `fs` 的一个扩展，提供了非常多的便利API，并且继承了fs所有方法并提供 Promise 风格的 API。`fs-extra` 底层依赖了 `graceful-fs` 用于防止`EMFILE`错误

对比

- npmtrends [fs-extra-vs-graceful-fs](https://www.npmtrends.com/fs-extra-vs-fs-promise-vs-graceful-fs)
- libhunt [fs-extra-vs-graceful-fs](https://nodejs.libhunt.com/compare-node-fs-extra-vs-node-graceful-fs)

### `dot-prop`

- [`dot-prop` 源码分析](./dot-prop.md)：

### [`unique-string`](https://www.npmjs.com/package/unique-string)

生成一个 32 位长度的随机字符串。

```js
import uniqueString from 'unique-string';

uniqueString();
//=> 'b4de2a49c8ffa3fbee04446f045483b2'

// unique-string 源码如下:
// 其底层，引入的是 [`crypto-random-string`](https://github.com/sindresorhus/crypto-random-string#readme)
import cryptoRandomString from 'crypto-random-string';

export default function uniqueString() {
  return cryptoRandomString({length: 32});
}

// 再向里了解
// in 'crypto-random-string'，默认使用 hex 方式
const generateRandomBytes = (byteLength, type, length) => crypto.randomBytes(byteLength).toString(type).slice(0, length);
const cryptoRandomString = ({length}) => generateRandomBytes(Math.ceil(length * 0.5), 'hex', length);
// 调用内置模块 [`crypto.randomBytes`](http://nodejs.cn/api/crypto.html#cryptorandombytessize-callback)
// crypto 源码 [`lib/crypto.js`](https://github.com/nodejs/node/blob/v16.13.2/lib/crypto.js)
```

返回一个 32 个字符的唯一字符串。匹配 MD5 的长度，这对于非加密目的来说[足够独特](https://stackoverflow.com/questions/2444321/how-are-hash-functions-like-md5-unique/2444336#2444336)。

### [`write-file-atomic`](https://www.npmjs.com/package/write-file-atomic)

This is an extension for node's fs.writeFile that makes its operation atomic and allows you set ownership (uid/gid of the file).

基于 `fs.writeFile` 的扩展模块，用于文件写入，并支持设置文件的 `uid/gid`。

> uid 代表用户对文件的操作权限，gid 代表用户所属组对文件的操作权限。

```js
var writeFileAtomic = require('write-file-atomic');

// 同步版本
writeFileAtomic.sync('message.txt', 'Hello Node', {chown:{uid:100,gid:50}});
```

## 知识点

- [`os.homedir()`](http://nodejs.cn/api/os/os_homedir.html)
- [`os.tmpdir()`](http://nodejs.cn/api/os.html#ostmpdir)
- [`path.join`](http://nodejs.cn/api/path.html#pathjoinpaths)
  - 使用特定于平台的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。
- `graceful-fs`
  - `fs-extra`
  - `readFileSync`
  - `mkdirSync`
  - error.code [信号常量](http://nodejs.cn/api/os.html#signal-constants)
    - 扩展 [`error code meanings`](https://stackoverflow.com/questions/23683911/node-js-error-code-meanings-specifically-fs)
- `dot-prop`
  - 循环引用
- `unique-string`
  - [鸽洞原理](https://en.wikipedia.org/wiki/Pigeonhole_principle)
  - [xxx.toString('hex')](https://stackoverflow.com/questions/60107757/why-do-we-do-tostringhex-after-crypto)
- `write-file-atomic`
  - [`fs.writeFile`](http://nodejs.cn/api/fs.html#fswritefilefile-data-options-callback)
  - `rwx = 4 + 2 + 1 = 7`
  - `0o0700`
  - `0o0600`
  - 二进制、八进制、十六进制
  - nodejs [use-chmod](https://stackoverflow.com/questions/8756639/how-do-i-use-chmod-with-node-js)
- `\t` or `\n`



## 扩展知识

**值得注意的一点是**, `0O` 前缀的可读性太差了(`0`和大写的`O`长的太像了, 很难区分), 我在esdiscuss上提出了[这个问题](https://esdiscuss.org/topic/is-it-really-a-good-idea-for-octal-numbers-to-allow-capital-o-e-g-0o755), 希望能禁用掉大写的`0O`前缀, 不过TC39目前的决定还是认为**一致性应该大于可读性**(一致性指的是要和`0X`以及`0B`等一致). 我认为这个决定是值得商榷的, 我推荐你永远不要使用大写的`0O`.

参考：

- [yeoman/configstrore 源码解析](https://juejin.cn/post/7021522417608556581)
- [Linux权限详解（chmod、600、644、666、700、711、755、777、4755、6755、7755）](https://blog.csdn.net/u013197629/article/details/73608613)

在开发 js 库的时候，涉及文件操作的部分需要考虑到不同系统及平台等环境的情况。`configstore` 的做法就是一个很好的思路，值得借鉴。

**关于权限**

十位权限表示 `T rwx rwx rwx`, 权限用 `8` 进制数字表示。

`rwx` 分别表示`owner`,`group`,`other`的(读，写，执行)权限，每个数可以转换为三位二进制数，分别表示`rwx`(读，写，执行)权限，为1表示有权限，0无权限

```bash
-rw------- (600)    只有拥有者有读写权限。
-rw-r--r-- (644)    只有拥有者有读写权限；而属组用户和其他用户只有读权限。
-rwx------ (700)    只有拥有者有读、写、执行权限。
-rwxr-xr-x (755)    拥有者有读、写、执行权限；而属组用户和其他用户只有读、执行权限。
-rwx--x--x (711)    拥有者有读、写、执行权限；而属组用户和其他用户只有执行权限。
-rw-rw-rw- (666)    所有用户都有文件读、写权限。
-rwxrwxrwx (777)    所有用户都有读、写、执行权限。
```

第一位表示**文件的类型**

```bash
d 代表的是目录(directroy)
- 代表的是文件(regular file)
s 代表的是套字文件(socket)
p 代表的管道文件(pipe)或命名管道文件(named pipe)
l 代表的是符号链接文件(symbolic link)
b 代表的是该文件是面向块的设备文件(block-oriented device file)
c 代表的是该文件是面向字符的设备文件(charcter-oriented device file)
```

- 关于 [git diff old mode 100644 new mode 100755](https://www.yuque.com/cloudyan/faq/nbdwlz)

## 总结

刚一看到这个包，感觉也没什么，不就是存个配置文件嘛，前些日子写的 `@deepjs/cdn-cli` 包也有存储配置啊

等这一通源码看下来，又收益匪浅了，知识点里列的都是加深熟悉的点，关于文件操作的部分，我之前也没考虑过跨平台系统的兼容支持，这个库就考虑的很周全。

而且通过扩展学习，也了解到了更多的知识。
