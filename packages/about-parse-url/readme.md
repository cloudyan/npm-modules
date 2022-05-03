# URL

nodejs url 模块提供用于网址处理和解析的实用工具。

url 模块提供了两种用于处理网址的 API：

- 一种是 Node.js 特定的旧版 API，
- 一种是实现了与 Web 浏览器使用的相同的 [WHATWG 网址标准](https://url.spec.whatwg.org/) 的新版 API。

```js
/**
 * http://nodejs.cn/api/url.html#url_url_strings_and_url_objects
 *
 * 下面提供了 WHATWG 和 旧版 API 之间的比较。
 *    在网址 'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'
 *      上方显示的是由旧版 url.parse() 返回的对象的属性。
 *      下方则是 WHATWG URL 对象的属性。
 *
 * WHATWG 网址的 origin 属性包括 protocol 和 host，但不包括 username 或 password。

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
("" 行中的所有空格都应被忽略。它们纯粹是为了格式化。)


 */

```

使用 WHATWG API 解析网址字符串：

```js
const myURL = new URL('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');

// 网址构造函数可作为全局对象的属性访问。 也可以从内置的 url 模块中导入：
import { URL } from 'url';
console.log(URL === globalThis.URL); // 打印 'true'.
```

使用旧版 API 解析网址字符串：

```js
import url from 'url';
const myURL = url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
```

一些知名库

- url: nodejs 内置模块，用于网址处理和解析
- querystring: nodejs 内置模块，解析和格式化网址查询字符串
- qs: 64M, A querystring parsing and stringifying library with some added security.
- query-string: 16M, Parse and stringify URL query strings
- normalize-url: 32M, Normalize a URL 规范化 URL

url 解析

- url-parse: 10M, 跨 Node.js 和浏览器环境无缝工作的小型 URL 解析器
- url-pattern: 137K,
- parse-url: 3M, An advanced url parser supporting git urls too.
- parse-path: 3M, Parse paths (local paths, urls: ssh/git/etc)
- parseurl: 21M, 基于 nodejs 内置模块 url 实现
