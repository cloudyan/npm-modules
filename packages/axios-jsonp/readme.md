# axios-jsonp

- https://www.npmjs.com/package/axios-jsonp
- https://github.com/AdonisLau/axios-jsonp#readme

## 目标

- 作用
- 源码分析

## 作用

A jsonp adapter for axios

support promise，support cancel，same as xhr

### 使用

```js
let axios = require('axios');
let jsonpAdapter = require('axios-jsonp');

axios({
  url: '/jsonp',
  adapter: jsonpAdapter,
  callbackParamName: 'callback', // optional, 'callback' by default
}).then((res) => {

});

```

## 源码分析

源码比较简单，这里的设计考虑的也是比较周全的，直接看源码即可 [./lib/index.js](./lib/index.js)
