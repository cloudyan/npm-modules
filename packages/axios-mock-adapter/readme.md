# axios-mock-adapter

- https://www.npmjs.com/package/axios-mock-adapter
- https://github.com/ctimmerm/axios-mock-adapter#readme

## 目标

- 作用
- 源码分析

## 作用

Axios adapter that allows to easily mock requests

### 使用

```js
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);
// var mock = new MockAdapter(axiosInstance, { delayResponse: 2000 });

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onGet("/users").reply(200, {
  users: [{ id: 1, name: "John Smith" }],
});

axios.get("/users").then(function (response) {
  console.log(response.data);
});

// Mock GET request to /users when param `searchText` is 'John'
// arguments for reply are (status, data, headers)
mock.onGet("/users", { params: { searchText: "John" } }).reply(200, {
  users: [{ id: 1, name: "John Smith" }],
});

axios
  .get("/users", { params: { searchText: "John" } })
  .then(function (response) {
    console.log(response.data);
  });
```

## 源码分析



