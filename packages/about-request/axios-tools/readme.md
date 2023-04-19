# axios-tools

扩展 axios 能力的工具集 [axios-tools](https://github.com/cloudyan/axios-tools)

- taro 中使用 axios
- uniapp 中使用 axios
- 常见的其他能力
  - retry
  - cache
  - throttle
  - session-refresh
- 底层使用 fetch 实现
  - axios-fetch-adapter

## 目标

- 作用
- 源码分析

## 作用

汇集 axios 的能力扩展，并配备最佳实践

### 使用

在项目中使用，具体示例参见 `axios-tools/usage`

1. 业务封装 `src/utils/request.js`
2. 引用 `src/service/index.js`

```js
// 业务封装
import axios from 'axios'
import createTaroAdapter from '@deepjs/axios-taro-adapter'
// import createUniappAdapter from '@deepjs/axios-uniapp-adapter'
import Taro from '@tarojs/taro'

axios.defaults.adapter = createTaroAdapter(Taro.request)
// axios.defaults.adapter = createUniappAdapter(uni.request)

const instance = axios.create({
  baseURL: 'https://m.xxx.com',
})

instance.get('https://m.xxx.com/common/initconfig')
  .then(resp => {
    console.log('GET请求成功:', resp)
  })

export const request = instance;
```

引用

```js
import { request } from '@/utils/request'

export function getConfig(data = {}) {
  return request('/common/initconfig', {
    method: 'GET',
    params: data,
  })
}
```

## 源码分析




其他同类项目

- https://www.npmjs.com/package/taro-axios
  - https://github.com/fjc0k/taro-axios
- https://www.npmjs.com/package/axios-miniprogram-adapter
  - https://github.com/bigMeow/axios-miniprogram-adapter#readme
- https://www.npmjs.com/package/foca-miniprogram-axios
  - https://github.com/foca-js/foca-miniprogram-axios#readme
- https://www.npmjs.com/package/foca-axios
  - https://github.com/foca-js/foca-axios#readme
