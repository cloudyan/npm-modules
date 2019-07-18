# 学习 minimist

- [minimist](https://www.npmjs.com/package/minimist)

测试代码

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
