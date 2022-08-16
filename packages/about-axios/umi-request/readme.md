# umi-request

- https://www.npmjs.com/package/umi-request
- https://github.com/umijs/umi-request#readme
- https://www.npmjs.com/package/@umijs/plugin-request

参考好文

- https://zhuanlan.zhihu.com/p/88997003
  - 原文: https://github.com/ProtoTeam/blog/blob/master/039.umi-request%20%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E4%B9%8B%E8%B7%AF.md
- https://github.com/umijs/umi-request/blob/master/README_zh-CN.md

## 目标

- 作用
- 源码分析

## 背景

在做中台业务应用开发的过程中，我们发现在请求链路上存在以下问题：

1. **请求库各式各样，没有统一。** 每次新起应用都需要重复实现一套请求层逻辑，切换应用时需要重新学习请求库 API。
2. **各应用接口设计不一致、混乱。** 前后端同学每次需重新设计接口格式，前端同学在切换应用时需重新了解接口格式才能做业务开发。
3. **接口文档维护各式各样。** 有的在语雀（云端知识库）上，有的在 RAP （开源接口管理工具）上，有的靠阅读源码才能知道，无论是维护、mock 数据还是沟通都很浪费人力。

针对以上问题，我们提出了**请求层治理**，希望能**通过统一请求库、规范请求接口设计规范、统一接口文档**这三步，对请求链路的前中后三个阶段进行**提效和规范，** 从而减少开发者在接口设计、文档维护、请求层逻辑开发上花费的沟通和人力成本。其中，**统一请求库作为底层技术支持，需要提前打好基地，为上层提供稳定、完善的功能支持，基于此，umi-request 应运而生。**

## 作用

网络请求库，基于 fetch 封装, 兼具 fetch 与 axios 的特点, 旨在为开发者提供一个统一的 api 调用方式, 简化使用, 并提供诸如缓存, 超时, 字符编码处理, 错误处理等常用功能.

- url 参数自动序列化
- post 数据提交方式简化
- response 返回处理简化
- api 超时支持
- api 请求缓存支持
- 支持处理 gbk 编码
- 类 axios 的 request 和 response 拦截器(interceptors)支持
- 统一的错误处理方式
- 类 koa 洋葱机制的 use 中间件机制支持
- 类 axios 的取消请求支持
- 支持 node 环境发送 http 请求

### 与 fetch、axios 的异同？

| 特性       | umi-request | fetch          | axios          |
| ---------- | ----------- | -------------- | -------------- |
| 实现       | fetch       | 浏览器原生支持 | XMLHttpRequest |
| query 简化 | ✅          | ❌             | ✅             |
| post 简化  | ✅          | ❌             | ❌             |
| 超时       | ✅          | ❌             | ✅             |
| 缓存       | ✅          | ❌             | ❌             |
| 错误检查   | ✅          | ❌             | ❌             |
| 错误处理   | ✅          | ❌             | ✅             |
| 拦截器     | ✅          | ❌             | ✅             |
| 前缀       | ✅          | ❌             | ❌             |
| 后缀       | ✅          | ❌             | ❌             |
| 处理 gbk   | ✅          | ❌             | ❌             |
| 中间件     | ✅          | ❌             | ❌             |
| 取消请求   | ✅          | ❌             | ✅             |

umi-request 底层抛弃了设计粗糙、不符合关注分离的 XMLHttpRequest，选择了更加语义化、基于标准 Promise 实现的 fetch（更多细节[详见](https://github.com/camsong/blog/issues/2)）；同时同构更方便，使用 [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)（目前已内置）；而基于各业务应用场景提取常见的请求能力并支持快速配置如 post 简化、前后缀、错误检查等。

总结：

随着 umi-request 能力的完善，已经能够支持各个场景、端应用的请求，前端开发只需要掌握一套 API 调用就能实现多端开发，再也不用关注底层协议实现，把更多的精力放在前端开发上。而基于此，umi-request 能在底层做更多的事情，如 mock 数据、自动识别请求类型、接口异常监控上报、接口规范校验等等，最终实现请求治理的目标。

### 用法

#### 使用自定义请求

移动端应用一般都会有自己的请求协议如 RPC 请求，前端会通过 SDK 去调用客户端请求 API，umi-request 支持开发者自己封装请求能力，例子：

```js
// service/some.js
import request, { extend } from 'umi-request';

const request = extend({
  // __umiRequestCoreType__: 'SDKRequest', // 可以全局修改，也可以按需定义
  prefix: '/api/v1',
  suffix: '.json',
  timeout: 1000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  params: {
    token: 'xxx' // 所有请求默认带上 token 参数
  },
  errorHandler: function(error) {
    /* 异常处理 */
  }
});

// 自定义请求内核中间件
function SDKRequest(ctx, next) {
  const { req } = ctx;
  const { url, options } = req;
  const { __umiRequestCoreType__ = 'normal' } = options;

  if (__umiRequestCoreType__.toLowerCase() !== 'SDKRequest') {
    return next();
  }

  return Promise.resolve()
    .then(() => {
      return SDK.request(url, options); // 假设已经引入了 SDK 并且能通过 SDK 发起对应请求
    })
    .then(result => {
      ctx.res = result; // 将结果注入到 ctx 的 res 里
      return next();
    });
}

request.use(SDKRequest, { core: true }); // 引入内核中间件

export async function queryUser() {
  return request('/api/sdk/request', {
    __umiRequestCoreType__: 'SDKRequest', // 声明使用 SDKRequest 来发起请求
    data: []
  });
}
```

这里有个问题，参考底层请求核心中间件实现 [fetchMiddleware](https://github.com/umijs/umi-request/blob/master/src/middleware/fetch.js)，如果使用自定义实现，就需要自行格式化数据

## 源码分析



