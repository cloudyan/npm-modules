# localForage

- https://www.npmjs.com/package/localforage 1.8M
- https://github.com/localForage/localForage

## 目标

- 作用
- 源码分析

## 作用

localForage 是一个快速而简单的 JavaScript 存储库。localForage 通过使用异步存储（IndexedDB 或 WebSQL）和简单的类似localStorageAPI 来改善 Web 应用程序的离线体验。

localForage 在不支持 IndexedDB 或 WebSQL 的浏览器中使用 localStorage。

### 使用

Callbacks vs Promises

```js
localforage.setItem('key', 'value', function (err) {
  // if err is non-null, we got an error
  localforage.getItem('key', function (err, value) {
    // if err is non-null, we got an error. otherwise, value is the value
  });
});


localforage.setItem('key', 'value').then(function () {
  return localforage.getItem('key');
}).then(function (value) {
  // we got our value
}).catch(function (err) {
  // we got an error
});
```

配置

```js
localforage.config({
  driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
  name        : 'myApp',
  version     : 1.0,
  size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
  description : 'some description'
});
```

## 源码分析


