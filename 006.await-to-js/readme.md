# `await-to-js` 流程控制

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
