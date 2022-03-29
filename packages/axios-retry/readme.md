# axios-retry

- https://www.npmjs.com/package/axios-retry
- https://github.com/softonic/axios-retry#readme

## 目标

- 作用
- 源码分析

## 作用

拦截失败请求并尽可能重试它们的 Axios 插件。

功能

- retries 失败前重试的次数，默认 `3`
- retryCondition 重试条件 `isNetworkOrIdempotentRequestError`
- shouldResetTimeout 重试时重置超时，默认 `false`
- retryDelay 控制重试请求之间的延迟回调(单位毫秒)，默认 `function noDelay(){ return 0; }`

### 使用

```js
// CommonJS
// const axiosRetry = require('axios-retry');

// ES6
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });

axios.get('http://example.com/test') // The first request fails and the second returns 'ok'
  .then(result => {
    result.data; // 'ok'
  });

// Exponential back-off retry delay between requests
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay});

// Custom retry delay
axiosRetry(axios, { retryDelay: (retryCount) => {
  return retryCount * 1000;
}});

// Works with custom axios instances
const client = axios.create({ baseURL: 'http://example.com' });
axiosRetry(client, { retries: 3 });

client.get('/test') // The first request fails and the second returns 'ok'
  .then(result => {
    result.data; // 'ok'
  });

// Allows request-specific configuration
client
  .get('/test', {
    'axios-retry': {
      retries: 0
    }
  })
  .catch(error => { // The first request fails
    error !== undefined
  });
```

## 源码分析


```js
```
