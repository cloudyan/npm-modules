# `await-to-js` callback hell or try-catch hell

`Promise` 解决了 callback hell, 而 ES7 的 `async/await` 却引起了 try-catch hell

详细参见： https://github.com/cloudyan/learn-javascript/blob/master/es6/16.promise/try-catch-hell/readme.md

其他：

- https://www.npmjs.com/package/await-to-js
- https://github.com/scopsy/await-to-js#readme
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
