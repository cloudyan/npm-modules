# ky

- https://www.npmjs.com/package/ky
- https://github.com/sindresorhus/ky#readme

## 目标

- 作用
- 源码分析

## 作用


```js
import ky from 'ky';

const json = await ky.post('https://example.com', {json: {foo: true}}).json();

console.log(json);
//=> `{data: '🦄'}`
```

## 源码分析



