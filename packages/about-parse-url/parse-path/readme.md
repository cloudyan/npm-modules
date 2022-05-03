# parse-path

- https://www.npmjs.com/package/parse-path
- https://github.com/IonicaBizau/parse-path#readme

## 目标

- 作用
- 源码分析

## 作用

Parse paths (local paths, urls: ssh/git/etc)

### 使用

```js
// Dependencies
const parsePath = require("parse-path")

console.log(parsePath("http://ionicabizau.net/blog"))
// { protocols: [ 'http' ],
//   protocol: 'http',
//   port: null,
//   resource: 'ionicabizau.net',
//   user: '',
//   pathname: '/blog',
//   hash: '',
//   search: '',
//   href: 'http://ionicabizau.net/blog' }

console.log(parsePath("http://domain.com/path/name?foo=bar&bar=42#some-hash"))
// { protocols: [ 'http' ],
//   protocol: 'http',
//   port: null,
//   resource: 'domain.com',
//   user: '',
//   pathname: '/path/name',
//   hash: 'some-hash',
//   search: 'foo=bar&bar=42',
//   href: 'http://domain.com/path/name?foo=bar&bar=42#some-hash' }

console.log(parsePath("git+ssh://git@host.xz/path/name.git"))
// { protocols: [ 'git', 'ssh' ],
//   protocol: 'git',
//   port: null,
//   resource: 'host.xz',
//   user: 'git',
//   pathname: '/path/name.git',
//   hash: '',
//   search: '',
//   href: 'git+ssh://git@host.xz/path/name.git' }

console.log(parsePath("git@github.com:IonicaBizau/git-stats.git"))
// { protocols: [],
//   protocol: 'ssh',
//   port: null,
//   resource: 'github.com',
//   user: 'git',
//   pathname: '/IonicaBizau/git-stats.git',
//   hash: '',
//   search: '',
//   href: 'git@github.com:IonicaBizau/git-stats.git' }
```

## 源码分析

