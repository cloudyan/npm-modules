# `await-to-js` callback hell or try-catch hell

- https://www.npmjs.com/package/await-to-js
- https://github.com/scopsy/await-to-js#readme

之前没看过这个包，但有思考过下面的这个话题

1. `Promise` 的引入是为了解决了 `callback hell`, 但流程控制上只能一路 `then`, 流程控制欠缺
   1. 像 `axios`, `umi-request` 都通过扩展拦截器来做流程的细节把控
   2. 对于封装为 Promise 的公共模块，缺少钩子 `predo` `postdo`
2. ES7 的 `async/await` 造成了 `try-catch hell`
   1. `await-to-js` 包一定程度上是在解决 `try-catch hell` 的问题

详细参见：

- [try-catch-hell](https://github.com/cloudyan/learn-javascript/blob/master/es6/16.promise/try-catch-hell/readme.md)
- 官方文章：https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/

## 目标

- 作用
- 源码分析

## 作用

您需要使用 Node 7.6（或更高版本）或 ES7 转译器才能使用 async/await 功能。

用法

```js
import to from 'await-to-js';

async function asyncFunctionWithThrow() {
  const [err, user] = await to(UserModel.findById(1));
  if (!user) throw new Error('User not found');
}
```

解决的问题

```js
import to from 'await-to-js';

export const getAll = async (req, res) => {
  try {
    const people = await to(getData())
    const projects = await to(getProjects())
    const supplies = await to(getSupplies())

    res.status(200).send({people, projects, supplies})
  } catch (err) {
    res.status(500).send(err)
  }
}

// 当在同一个方法中实现了多个异步操作并且错误处理对于两种情况相同时，
// 新的 promise 处理程序可能不是最佳选择（回到 tr-catch 反而能避免重复）。
let err = null
let data = null
export const getAll2 = async (req, res) => {
  [err, data] = await to(getData())
  if (err) return res.status(500).send(err)
  const people = data

  [err, data] = await to(getProjects())
  if (err) return res.status(500).send(err)
  const projects = data

  [err, data] = await to(getSupplies())
  if (err) return res.status(500).send(err)
  const supplies = data

  res.status(200).send({people, projects, supplies})
}
```

## 源码分析

```ts
/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error> (
  promise: Promise<T>,
  errorExt?: object
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}

export default to;
```
