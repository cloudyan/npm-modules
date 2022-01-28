# `dot-prop`

- https://www.npmjs.com/package/dot-prop
- https://github.com/sindresorhus/dot-prop#readme

使用 `.` 路径从嵌套对象中获取、设置或删除属性。类似 `foo.notDefined.deep` 这样

## 用法

```js
import {getProperty, setProperty, hasProperty, deleteProperty} from 'dot-prop';

const object = {foo: {bar: 'b'}};
getProperty(object, 'foo.notDefined.deep');
//=> undefined

setProperty(object, 'foo.bar', 'b');
setProperty(object, 'foo.baz', 'x');
//=> {foo: {bar: 'b', baz: 'x'}}

setProperty(object, 'foo.biz.0', 'a');
//=> {foo: {bar: 'b', baz: 'x', biz: ['a']}}
```

## 源码分析

源码

```js
// 判断 object
const isObject = value => {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
};

const disallowedKeys = new Set([
  '__proto__',
  'prototype',
  'constructor',
]);

// 数字索引 key
const digits = new Set('0123456789');

// 处理路径格式，如 a.b.c, a[b.c], foo\\bar
// 了解细节，查看模块的[单元测试](https://github.com/sindresorhus/dot-prop/blob/main/test.js)是个好方法
function getPathSegments(path) {
  const parts = [];
  let currentSegment = '';
  let currentPart = 'start';
  let isIgnoring = false;

  for (const character of path) {
    switch (character) {
      case '\\':
        if (currentPart === 'index') {
          throw new Error('Invalid character in an index');
        }

        if (currentPart === 'indexEnd') {
          throw new Error('Invalid character after an index');
        }

        if (isIgnoring) {
          currentSegment += character;
        }

        currentPart = 'property';
        isIgnoring = !isIgnoring;
        break;

      case '.':
        if (currentPart === 'index') {
          throw new Error('Invalid character in an index');
        }

        if (currentPart === 'indexEnd') {
          currentPart = 'property';
          break;
        }

        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += character;
          break;
        }

        if (disallowedKeys.has(currentSegment)) {
          return [];
        }

        parts.push(currentSegment);
        currentSegment = '';
        currentPart = 'property';
        break;

      case '[':
        if (currentPart === 'index') {
          throw new Error('Invalid character in an index');
        }

        if (currentPart === 'indexEnd') {
          currentPart = 'index';
          break;
        }

        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += character;
          break;
        }

        if (currentPart === 'property') {
          if (disallowedKeys.has(currentSegment)) {
            return [];
          }

          parts.push(currentSegment);
          currentSegment = '';
        }

        currentPart = 'index';
        break;

      case ']':
        if (currentPart === 'index') {
          parts.push(Number.parseInt(currentSegment, 10));
          currentSegment = '';
          currentPart = 'indexEnd';
          break;
        }

        if (currentPart === 'indexEnd') {
          throw new Error('Invalid character after an index');
        }

        // Falls through

      default:
        if (currentPart === 'index' && !digits.has(character)) {
          throw new Error('Invalid character in an index');
        }

        if (currentPart === 'indexEnd') {
          throw new Error('Invalid character after an index');
        }

        if (currentPart === 'start') {
          currentPart = 'property';
        }

        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += '\\';
        }

        currentSegment += character;
    }
  }

  if (isIgnoring) {
    currentSegment += '\\';
  }

  switch (currentPart) {
    case 'property': {
      if (disallowedKeys.has(currentSegment)) {
        return [];
      }

      parts.push(currentSegment);

      break;
    }

    case 'index': {
      throw new Error('Index was not closed');
    }

    case 'start': {
      parts.push('');

      break;
    }
  // No default
  }

  return parts;
}

// 如果 object 是数组，其 key 就必须是数字或数字字符串，不能是其他字符串
function isStringIndex(object, key) {
  if (typeof key !== 'number' && Array.isArray(object)) {
    const index = Number.parseInt(key, 10);
    return Number.isInteger(index) && object[index] === object[key];
  }

  return false;
}

// 断言
function assertNotStringIndex(object, key) {
  if (isStringIndex(object, key)) {
    throw new Error('Cannot use string index');
  }
}

// throw 会中断函数的继续执行
// nodejs 中应是会给强提示，浏览器中则需要 try...catch 保护外部域的正常执行
// function testThrow() {
//   console.log('before throw');
//   assertNotStringIndex([1,2,3], 'aa')
//   console.log('after throw');
// }
// console.log('out before throw');
// try {
//   testThrow();
// } catch(err) {
//   console.log(err);
// }
// console.log('out after throw');

export function getProperty(object, path, value) {
  // value 作为默认值
  // 如果 object非对象 或 path非字符串
  if (!isObject(object) || typeof path !== 'string') {
    return value === undefined ? object : value;
  }

  const pathArray = getPathSegments(path);
  // 如果 path 路径无，返回默认值 value
  if (pathArray.length === 0) {
    return value;
  }

  for (let index = 0; index < pathArray.length; index++) {
    const key = pathArray[index];

    if (isStringIndex(object, key)) {
      object = index === pathArray.length - 1 ? undefined : null;
    } else {
      object = object[key];
    }

    if (object === undefined || object === null) {
      // `object` is either `undefined` or `null` so we want to stop the loop, and
      // if this is not the last bit of the path, and
      // if it didn't return `undefined`
      // it would return `null` if `object` is `null`
      // but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
      if (index !== pathArray.length - 1) {
        return value;
      }

      break;
    }
  }

  return object === undefined ? value : object;
}

export function setProperty(object, path, value) {
  if (!isObject(object) || typeof path !== 'string') {
    return object;
  }

  const root = object;
  const pathArray = getPathSegments(path);

  for (let index = 0; index < pathArray.length; index++) {
    const key = pathArray[index];

    assertNotStringIndex(object, key);

    if (index === pathArray.length - 1) {
      object[key] = value;
    } else if (!isObject(object[key])) {
      object[key] = typeof pathArray[index + 1] === 'number' ? [] : {};
    }

    object = object[key];
  }

  return root;
}

export function deleteProperty(object, path) {
  if (!isObject(object) || typeof path !== 'string') {
    return false;
  }

  const pathArray = getPathSegments(path);

  for (let index = 0; index < pathArray.length; index++) {
    const key = pathArray[index];

    assertNotStringIndex(object, key);

    if (index === pathArray.length - 1) {
      delete object[key];
      return true;
    }

    object = object[key];

    if (!isObject(object)) {
      return false;
    }
  }
}

export function hasProperty(object, path) {
  if (!isObject(object) || typeof path !== 'string') {
    return false;
  }

  const pathArray = getPathSegments(path);
  if (pathArray.length === 0) {
    return false;
  }

  for (const key of pathArray) {
    if (!isObject(object) || !(key in object) || isStringIndex(object, key)) {
      return false;
    }

    object = object[key];
  }

  return true;
}

// 转义路径中的特殊字符
// \\ => \\\\
// .  => \\.
// [  => \\[
export function escapePath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Expected a string');
  }

  return path.replace(/[\\.[]/g, '\\$&');
}
```

### 知识点

- [ ] DIY `dot-prop`
- `path.replace(/[\\.[]/g, '\\$&')`
  - [JavaScript Regular Expression Visualizer](https://regexp.deepjs.cn/)
- `"type": "module"` 声明
  - ESM 模块
  - 支持 `import` 语法可以直接右键 `RUN CODE` 运行
- `isStringIndex`
- `for...of`
- `assert` 断言
- `throw`

## 扩展

- `electron-store`
- `conf`

关于 `throw`

[`throw`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/throw)语句用来抛出一个用户自定义的异常。当前函数的执行将被停止（`throw`之后的语句将不会执行），并且控制将被传递到调用堆栈中的第一个[`catch`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch)块。如果调用者函数中没有`catch`块，程序将会终止。
