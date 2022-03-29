# axios-fetch

- https://www.npmjs.com/package/axios-fetch

## 目标

- 作用
- 源码分析

## 作用

This library exposes a Fetch WebAPI implementation backed by a Axios client instance. This allows a bridge between projects that have pre-configured Axios clients already to other libraries that require Fetch implementations.

让 axios 实现了类似 fetch WebAPI 的使用效果。但并不是将 axios 的 adapter 改为使用 fetch 来实现。

用于需要使用 fetch，但底层想使用 axios 的场景。

### 使用

```js
const { buildAxiosFetch } = require("axios-fetch");
const { createHttpLink } = require("apollo-link-http");
const link = createHttpLink({
  uri: "/graphql"
  fetch: buildAxiosFetch(yourAxiosInstance)
});
```


## 源码分析

```js
const { Response, Headers } = require('node-fetch');
const mapKeys = require('lodash/mapKeys');

/**
 * A Fetch WebAPI implementation based on the Axios client
 */
async function axiosFetch (axios, input, init = {}) {
  // Convert the `fetch` style arguments into a Axios style config

  const lowerCasedHeaders = mapKeys(init.headers, function (value, key) {
    return key.toLowerCase();
  });

  if (!('content-type' in lowerCasedHeaders)) {
    lowerCasedHeaders['content-type'] = 'text/plain;charset=UTF-8';
  }

  const config = {
    url: input,
    method: init.method || 'GET',
    data: String(init.body),
    headers: lowerCasedHeaders,
    validateStatus: () => true
  };

  const result = await axios.request(config);

  // Convert the Axios style response into a `fetch` style response
  const responseBody = typeof result.data === `object` ? JSON.stringify(result.data) : result.data;

  const headers = new Headers();
  Object.entries(result.headers).forEach(function ([key, value]) {
    headers.append(key, value);
  });

  return new Response(responseBody, {
    status: result.status,
    statusText: result.statusText,
    headers
  });
}

function buildAxiosFetch (axios) {
  return axiosFetch.bind(undefined, axios);
}

module.exports = {
  buildAxiosFetch
};
```
