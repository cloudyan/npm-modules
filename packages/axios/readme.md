# axios

Axios 是一个基于 promise 网络请求库，作用于node.js 和浏览器中。 它是 [isomorphic](https://www.lullabot.com/articles/what-is-an-isomorphic-application) 的(即同一套代码可以运行在浏览器和node.js中)。在服务端它使用原生 node.js http 模块, 而在客户端 (浏览端) 则使用 XMLHttpRequests。

axios 是最著名的 Javascript 请求库之一。

- https://www.npmjs.com/package/axios
- https://github.com/axios/axios
- 官方文档: https://axios-http.com/docs/intro

阅读源码前应详细阅读 [axios 官方文档](https://axios-http.com/docs/intro), 以及 README.md 说明文件。

之前就看过一次源码, 当时感觉设计精良，其他的也没了, 前些日子需要做请求拦截重试功能, 同时又看了一遍 axios 以及 umi-request 的设计, 才感觉 axios 的这个设计，兼容扩展都十分强大.

参考好文

- 若川 [学习 axios 源码整体架构，打造属于自己的请求库](https://juejin.cn/post/6844904019987529735)
- [You-Dont-Know-Axios](https://github.com/chinesedfan/You-Dont-Know-Axios)

设计理论

![axios-design](../../assets/axios-design.png)

请求配置

![axios-configs](../../assets/axios-configs.png)

## 目标

- [utils](./utils.md)
- 使用及场景
- 源码分析
- Axios 生态
- 功能扩展

## 源码分析

通读源码后，可以浏览下 axios 的 Issues 以及 PR，数量不少，甚至可以尝试解决。

项目文件内容比较多，分为三部分展开叙述。

1. 第一部分: 引入一些工具函数 `utils`、`Axios` 构造函数、默认配置 `defaults` 等。
2. 第二部分: 是生成实例对象 `axios`、`axios.Axios`、`axios.create`等。
3. 第三部分: **取消相关API**实现，还有 `all`、`spread`、导出等实现。

### 取消相关 API

axios 使用 cancel token 取消一个请求。

> Axios 的 cancel token API 是基于**可取消 Promise 提案（[cancelable promises proposal](https://github.com/tc39/proposal-cancelable-promises)）**来实现的（该提案已被撤销） 。
> Axios 也支持使用 AbortController 中止请求

注意: axios 可以使用同一个 cancel token 取消多个请求。

## Axios 生态

-


## 知识点

- Should `method` be lower cases or upper?
  - 都应大写，参看[HTTP specifications](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- headers: CORS, cookies
  - [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 仅发生在浏览器端
  - [preflighted requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests)
  - [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Access-Control-Expose-Headers)
  - [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Credentialed_requests_and_wildcards)
  - Set-Cookie [HttpOnly or Secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)
- `data` && `Content Type`
  - `data` must match with the header [Content Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
    - `text/plain` -> data 是文本
    - `application/json` -> data 应是 JSON 格式（使用 `JSON.stringify` 转换）
    - `application/x-www-form-urlencoded` -> data 应是 URL/URI 编码的, 可以使用 `qs.stringify(data)` 转换
- `responseType`
  - text
  - json
  - arraybuffer
  - document
  - blob
  - stream
- axios 目前还不支持 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- 跟随重定向 [follow-redirects](https://github.com/follow-redirects/follow-redirects)
- validateStatus
- 304 响应 [sindresorhus/got](https://github.com/sindresorhus/got/blob/main/documentation/cache.md)
- [应用传输安全 (ATS)](https://developers.google.com/admob/ios/app-transport-security)

## 扩展

### **Interceptors**

```js
axios.interceptors.request.use(requestResolve1, requestReject1);
axios.interceptors.request.use(requestResolve2, requestReject2);
axios.interceptors.response.use(responseResolve1, responseReject1);
axios.interceptors.response.use(responseResolve2, responseReject2);

axios(config).then(thenBlock).catch(catchBlock);

// equals to

Promise.resolve(config)
  .then(requestResolve2, requestReject2)
  .then(requestResolve1, requestReject1)
  .then(dispatchRequest, undefined)
  .then(responseResolve1, responseReject1)
  .then(responseResolve2, responseReject2)
  .then(thenBlock).catch(catchBlock);
```

The real request is not sent immediately when you call `axios(config)`, because `dispatchRequest` is one of `then` handlers. Avoid doing synchronous time-consumed tasks after axios calls.

```js
axios(config);

setTimeout(function () {
  // do time-consumed tasks in next event loop
});
```

浏览器在重定向时总是会添加 Authorization 标头，参见[axios/axios#2855 (comment)](https://github.com/axios/axios/issues/2855#issuecomment-732974809)

### Promise 链式写法

使用 Promise 链式写法的一个缺点是我们无法访问每个回调函数的作用域（或者其中未返回的的变量），你可以阅读 Alex Rauschmayer 博士这篇 [a great article](https://2ality.com/2017/08/promise-callback-data-flow.html) 来解决这个问题。



参考：

- [代码沙盒，能运行多种语言，且可以添加依赖](https://codesandbox.io/)
-
