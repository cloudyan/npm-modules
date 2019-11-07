# 学习 minimist

- [minimist](https://www.npmjs.com/package/minimist)

minimist 是个流行的nodejs轻量级命令行解析工具。

nodejs的命令行参数解析工具有很多，比如：argparse、optimist、yars、commander。optimist和yargs内部使用的解析引擎正是minimist，如果你喜欢轻量级的技术，那么minimist足够简单好用，代码量也很少（只有几百行），非常适合研读。

minimist的特性比较全面：

- short options
- long options
- Boolean 和 Number类型的自动转化
- option alias

`
` 开头的参数

- `–-key` 默认值为 true，一般用于某种开关
  - `node index.js --profile`
- `--key=value` 形式
  - `node index.js --profile=test`
- `--key value` 形式
  - `node index.js --profile test`

`-` 开头的参数

一般当作`–-`参数的所写形式，单独一个字符解析的时候是ok，`-`后接多个字符的时候，默认会被逐个字符当作参数进行解析

- `-`单个字符
  - `node index.js -p`
- `-`多个字符，相当于多个单字母合并一起，解析为多个单字母
  - `node index.js -profile`
- `-k value`
  - 等价于 `--p value`
  - `node index.js -p test`
- `-k=value`
  - 等价于 `--p=value`
  - `node index.js -p=test`

不带`--`和`-`的参数

- 参数值为数组，key 为_
  - `node index.js param1 param2 param3`

## 源码

minimist整体的解析过程，代码大致是：

```js
for (var i = 0; i < args.length; i++) {
  var arg = args[i];
  if (/^--.+=/.test(arg)) {
    ...
  } else if (/^--no-.+/.test(arg)) {
    ...
  } else if (/^--.+/.test(arg)) {
    ...
  } else if (/^-[^-]+/.test(arg)) {
    ...
  } else {
    ...
  }
}
```

```js
// test.js
var args = require('minimist')(process.argv.slice(2));
console.log(args.hello);

$ node test.js --hello=world
// world
$ node test.js --hello world
// world
$ node test.js --hello
```

脚本测试

```bash
const minimist = require('minimist')

const cliOptions = minimist(process.argv)

console.log(process.argv);

console.log(cliOptions);
```

npm run test -p 8090 -o -a=1 ttt=123 (node scripts/test.js)

script/test.js 取 process.argv参数，只能拿到非`-` 开头的参数，如 8090 ttt=123

```bash
$ node scripts/test.js -p 8090 -o -a=1 ttt=123
# console.log(process.argv)
[
  '/usr/local/bin/node',
  '/Users/dwd/github/deepjs-net/learn-git/scripts/test.js',
  '-p',
  '8090',
  '-o',
  '-a=1',
  'ttt=123'
]
# minimist(process.argv)
{
  _: [
    '/usr/local/bin/node',
    '/Users/dwd/github/deepjs-net/learn-git/scripts/test.js',
    'ttt=123'
  ],
  p: 8090,
  o: true,
  a: 1
}
```

使用 npm scripts 运行脚本，参数处理会有变化

```bash
$ npm run test -p 8090 -o -a=1 ttt=123
# console.log(process.argv)
[
  '/usr/local/bin/node',
  '/Users/dwd/github/deepjs-net/learn-git/scripts/test.js',
  '8090',
  'ttt=123'
]
# minimist(process.argv)
{
  _: [
    '/usr/local/bin/node',
    '/Users/dwd/github/deepjs-net/learn-git/scripts/test.js',
    8090,
    'ttt=123'
  ]
}
```

参考：

- https://mrhuang87.github.io/2017/11/29/node-learning-minimist/
- https://jarvys.github.io/2014/06/01/minimist-js/
