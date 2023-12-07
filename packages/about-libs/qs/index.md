# URL 解析

诉求

- 用于解析 URL
- 用于序列化 URL

分析，优劣对比

- URL 原生
- querystring
- qs
- query-string
- url

功能设计

1. 解析 url

包含常规 `new URL()` 属性

```js
// new URL('https://baidu.com:3000?xx=123#blog')

{
  hash: "#blog",
  host: "baidu.com:3000",
  hostname: "baidu.com", // domain
  href: "https://baidu.com:3000/?a=1&a=2&b=3#blog",
  origin: "https://baidu.com:3000",
  pathname: "/",
  port: "3000",
  protocol: "https:",
  search: "?a=1&a=2&b=3",
  // URLSearchParams,
  searchParams: {
    size: 3
  },
  // password: "",
  // username: "",
  // auth: `user:pass`,
  // path: "/p/a/t/h?query=string",
}
```



1. 扩展方法及属性

- parse 解析
- stringify 序列化
- queryParams
- queryParamsStr

## 实现

```js

```

## 注意事项

以下8个特殊字符URL编码没有对其进行转码，十六进制值

| 特殊字符 | 说明 | 十六进制值 |
| --- | --- | --- |
| `+` | URL 中+号表示空格 | `%2B` |
| 空格 | URL中的空格可以用+号或者编码 | `%20` |
| `/` | 分隔目录和子目录 | `%2F` |
| `?` | 分隔实际的 URL 和参数 | `%3F` |
| `%` | 指定特殊字符 | `%25` |
| `#` | 表示书签 | `%23` |
| `&` | URL 中指定的参数间的分隔符 | `%26` |
| `=` | URL 中指定参数的值 | `%3D` |

以及

| 特殊字符 | 编码 |
| --- | --- |
| `!` | `%21` |
| `'` | `%27` |
| `(` | `%28` |
| `)` | `%29` |
