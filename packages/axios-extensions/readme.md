# axios-extensions

- https://www.npmjs.com/package/axios-extensions
- https://github.com/kuitos/axios-extensions#readme

## 目标

- [cacheAdapterEnhancer](https://github.com/kuitos/axios-extensions#cacheadapterenhancer) makes request cacheable
- [throttleAdapterEnhancer](https://github.com/kuitos/axios-extensions#throttleadapterenhancer) makes GET requests throttled automatically
- [retryAdapterEnhancer](https://github.com/kuitos/axios-extensions#retryadapterenhancer) makes request retry with special times while it failed

### 使用

```js
import axios from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';

// enhance the original axios adapter with throttle and cache enhancer
const http = axios.create({
  baseURL: '/',
  headers: { 'Cache-Control': 'no-cache' },
  adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter))
});
```

## 源码分析

```bash
mkdir source && cd source

git clone https://github.com/kuitos/axios-extensions.git
```
