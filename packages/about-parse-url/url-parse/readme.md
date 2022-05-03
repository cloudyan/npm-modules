# url-parse

- https://www.npmjs.com/package/url-parse
- https://github.com/unshiftio/url-parse#readme

## 目标

- 作用
- 源码分析

## 作用

跨 Node.js 和浏览器环境无缝工作的小型 URL 解析器。

### 使用

```js
var parse = require('url-parse')

var url = parse('https://github.com/foo/bar', true);
```

The returned url instance contains the following properties:

- protocol: The protocol scheme of the URL (e.g. http:).
- slashes: A boolean which indicates whether the protocol is followed by two forward slashes (//).
- auth: Authentication information portion (e.g. username:password).
- username: Username of basic authentication.
- password: Password of basic authentication.
- host: Host name with port number. The hostname might be invalid.
- hostname: Host name without port number. This might be an invalid hostname.
- port: Optional port number.
- pathname: URL path.
- query: Parsed object containing query string, unless parsing is set to false.
- hash: The "fragment" portion of the URL including the pound-sign (#).
- href: The full URL.
- origin: The origin of the URL.

## 源码解析
