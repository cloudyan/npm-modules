# fetch-jsonp

- https://www.npmjs.com/package/fetch-jsonp
- https://github.com/camsong/fetch-jsonp#readme

## 目标

- 作用
- 源码分析

## 作用

### 使用

```js
fetchJsonp('/users.jsonp', {
    jsonpCallback: 'custom_callback',
    timeout: 3000,
  })
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
```

### jsonpCallback vs jsonpCallbackFunction

对于一个 jsonp 请求，有如下格式 `${url}${jsonpCallback}=${jsonpCallbackFunction}`

## 源码分析

源码比较简单，直接查看即可

## 扩展

- `fetch-jsonp` vs `axios-jsonp`

