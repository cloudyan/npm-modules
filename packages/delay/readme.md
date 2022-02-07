# deplay

带取消功能的延迟函数

- https://www.npmjs.com/package/delay
- https://github.com/sindresorhus/delay#readme

参考好文：

- 若川：https://juejin.cn/post/7042461373904715812

## 目标

- 作用
- 源码分析

## 作用

`delay` 用法

```js
const delay = require('delay');

(async () => {
  bar();

  await delay(100);

  // Executed 100 milliseconds later
  baz();
})();
```

以前有用到一个 `sleep`, 跟这个有点类似

```js
const sleep = (ms, ...rest) => new Promise((resolve) => setTimeout(resolve, ms, ...rest));

// testing
await sleep(3000);
console.log(111);

// 扩展
// 2. 传入 value 作为返回值
// 3. 通过参数控制返回 resolve or reject
// 4. 一定时间范围内随机获得结果
// 5. 支持提前清除
const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);

const createDelay = ({willResolve}) => (ms, {value} = {}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(willResolve){
        resolve(value);
      }
      else{
        reject(value);
      }
    }, ms);
  });
}

const createWithTimers = () => {
  const delay = createDelay({willResolve: true});
  delay.reject = createDelay({willResolve: false});
  delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
  return delay;
}

// testing
const delay4 = createWithTimers();
```

## 源码分析

```js
'use strict';

// From https://github.com/sindresorhus/random-int/blob/c37741b56f76b9160b0b63dae4e9c64875128146/index.js#L13-L15
const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);

const createAbortError = () => {
  const error = new Error('Delay aborted');
  error.name = 'AbortError';
  return error;
};

const createDelay = ({clearTimeout: defaultClear, setTimeout: set, willResolve}) => (ms, {value, signal} = {}) => {
  if (signal && signal.aborted) {
    return Promise.reject(createAbortError());
  }

  let timeoutId;
  let settle;
  let rejectFn;
  const clear = defaultClear || clearTimeout;

  const signalListener = () => {
    clear(timeoutId);
    rejectFn(createAbortError());
  };

  const cleanup = () => {
    if (signal) {
      signal.removeEventListener('abort', signalListener);
    }
  };

  const delayPromise = new Promise((resolve, reject) => {
    settle = () => {
      cleanup();
      if (willResolve) {
        resolve(value);
      } else {
        reject(value);
      }
    };

    rejectFn = reject;
    timeoutId = (set || setTimeout)(settle, ms);
  });

  if (signal) {
    signal.addEventListener('abort', signalListener, {once: true});
  }

  delayPromise.clear = () => {
    clear(timeoutId);
    timeoutId = null;
    settle();
  };

  return delayPromise;
};

const createWithTimers = clearAndSet => {
  const delay = createDelay({...clearAndSet, willResolve: true});
  delay.reject = createDelay({...clearAndSet, willResolve: false});
  delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
  return delay;
};

const delay = createWithTimers();
delay.createWithTimers = createWithTimers;

module.exports = delay;
// TODO: Remove this for the next major release
module.exports.default = delay;
```

## 知识点

- `Promise`
- `abort`
- `addEventListener`
- `range`
- `randomInteger`
- `axios` 取消请求
- `AbortController`
