# axios vs fetch

## fetch

- fetch 使用 Promise，不使用回调函数，因此大大简化了写法，写起来更简洁。
- fetch 采用模块化设计，API 分散在多个对象上（Response 对象、Request 对象、Headers 对象），更合理一些；相比之下，XMLHttpRequest 的 API 设计并不是很好，输入、输出、状态都在同一个接口管理，容易写出非常混乱的代码。
- fetch 通过数据流（Stream 对象）处理数据，可以分块读取，有利于提高网站性能表现，减少内存占用，对于请求大文件或者网速慢的场景相当有用。XMLHTTPRequest 对象不支持数据流，所有的数据必须放在缓存里，不支持分块读取，必须等待全部拿到后，再一次性吐出来。

- 如果使用 PWA service worker 执行缓存, 仅支持 fetchApi, axios 无法使用
- fetch 的 body 必须被字符串化 `JSON.stringify`，axios 的 data 包含对象, 支持转为 json
- fetch 的 request 对象没有 url，axios 的 request 对象中有 url
- fetch 的 response 是一个 Response 对象，Response 包含的数据通过 Stream 接口异步读取，但是它还包含一些同步属性，对应 HTTP 回应的标头信息（Headers），可以立即读取。
- fetch 的响应对象包含 ok 属性，请求才是 resolved，而 axios 是响应 200 且 statusText 为 OK 时，请求才是 resolved
- fetch 是浏览器 API，axios 是依赖包
- fetch 的响应更原始，axios 的响应更容易阅读调试
- response.json() 是一个异步操作，取出所有内容，并将其转为 JSON 对象。


### [fetch 兼容性](https://caniuse.com/fetch)

- safari 10.3+
- Edge 14+
- ie11- 都不支持

需要引入 folyfill

- [whatwg-fetch](https://www.npmjs.com/package/whatwg-fetch)
- [promise-polyfill](https://github.com/taylorhakes/promise-polyfill)

更多参见

- [Fetch 规范](https://fetch.spec.whatwg.org/)
- [Fetch 测试用例](https://github.com/web-platform-tests/wpt/tree/master/fetch)

### fetch Request

- Request.method
- Request.headers
- Request.credentials
- Request.cache
- Request.body
- Request.context
- Request.mode

### fetch Response

- Response.ok [boolean] 是否成功
  - true: 对应状态码 200~299
  - false: 对应其他状态码
- Response.status [number] HTTP 回应的状态码
- Response.statusText [string] HTTP 回应的状态信息
- Response.url [string] 返回请求的 URL。如果 URL 存在跳转，该属性返回的是最终 URL。
- Response.type [string] 返回请求的 类型
  - basic：普通请求，即同源请求。
  - cors：跨域请求。
  - error：网络错误，主要用于 Service Worker。
  - opaque：如果fetch()请求的type属性设为no-cors，就会返回这个值，详见请求部分。表示发出的是简单的跨域请求，类似`<form>`表单的那种跨域请求。
  - opaqueredirect：如果fetch()请求的redirect属性设为manual，就会返回这个值，详见请求部分。
- Response.redirected [boolean] 请求是否发生过跳转
- Response.headers 指向一个 Headers 对象，对应 HTTP 回应的所有标头。
  - 可以使用`for...of`循环进行遍历
- Response.body 属性是 Response 对象暴露出的底层接口，返回一个 ReadableStream 对象，供用户操作。
  - 可以用来分块读取内容，应用之一就是显示下载的进度。
  - response.body.getReader()方法返回一个遍历器。这个遍历器的read()方法每次返回一个对象，表示本次读取的内容块。

fetch()发出请求以后，有一个很重要的注意点：只有网络错误，或者无法连接时，fetch()才会报错，其他情况都不会报错，而是认为请求成功。

### 读取内容的方法

Response 对象根据服务器返回的不同类型的数据，提供了不同的读取方法。

- response.text()：得到文本字符串。如 HTML 文件
- response.json()：得到 JSON 对象。主要用于获取接口返回的 json 数据
- response.blob()：得到二进制 Blob 对象。如图片文件
- response.formData()：得到 FormData 表单对象。主要用在 Service Worker 里面，拦截用户提交的表单，修改某些数据以后，再提交给服务器
- response.arrayBuffer()：得到二进制 ArrayBuffer 对象。主要用于获取流媒体文件，如音频文件

Stream 对象只能读取一次，读取完就没了。这意味着，上面的五个读取方法，只能使用一个，否则会报错。

Response 对象提供Response.clone()方法，创建Response对象的副本，实现多次读取。

Response 对象还有一个Response.redirect()方法，用于将 Response 结果重定向到指定的 URL。该方法一般只用在 Service Worker 里面


参考文档

- https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html
- https://blog.logrocket.com/axios-vs-fetch-best-http-requests/
- https://www.quora.com/Why-should-JavaScript-developers-prefer-Axios-over-Fetch
- https://github.com/rikmms/progress-bar-4-axios
