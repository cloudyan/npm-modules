# axios 中的 `utils` 工具函数

- `utils` 工具函数 [源码](https://github.com/axios/axios/blob/master/lib/utils.js)

参考:

- [阅读axios源码，发现了这些实用的基础工具函数](https://juejin.cn/post/7042610679815241758)

## 工具函数

```js
{
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isFunction,
  isStream,
  isURLSearchParams,
  isStandardBrowserEnv,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
}
```

## 分析

### `isArray` 判断数组

现在使用原生方法 Array.isArray

```js
var toString = Object.prototype.toString;

// 可以通过 `toString()` 来获取每个对象的类型
// 一般返回值是 Boolean 类型的函数，命名都以 is 开头
function isArray(val) {
  return toString.call(val) === '[object Array]';
}
```

### `isUndefined` 判断未定义

这个方法是判断值为 `undefined`, 注意以下两个场景

- 不能用于未定义的变量, 直接用 `typeof` 是可以的
- 不能用在暂时性死区内, 直接用 `typeof` 也是不可以的

```js
// 注意 typeof null === 'object'
function isUndefined(val) {
  return typeof val === 'undefined';
}

// 暂时死区
function testDef(v) {
  const result = typeof a === 'undefined';
  let a;
  console.log(result)
}
testDef(1)
```

### `isBuffer` 判断 `buffer`

```js
// 先判断不是 `undefined`和`null`
// 再判断 `val`存在构造函数，因为`Buffer`本身是一个类
// 最后通过自身的`isBuffer`方法判断
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}
```

这个平时没用过, 不是很熟

**什么是 Buffer?**

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像TCP流或文件流时，必须使用到二进制数据。因此在 Node.js 中，定义了一个 `Buffer` 类，该类用来创建一个专门存放二进制数据的缓存区。

详细可以看 [官方文档](http://nodejs.cn/api/buffer.html#buffer) 或 [更通俗易懂的解释](https://www.runoob.com/nodejs/nodejs-buffer.html)。

因为 `axios` 可以运行在浏览器和 node 环境中，所以内部会用到 nodejs 相关的知识。

### `isArrayBuffer` 判断类型化数组

详细: [isArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Typed_arrays)

```js
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}
```

### `isFormData` 判断 `FormData`

```js
// 新方法
function isFormData(val) {
  return toString.call(val) === '[object FormData]';
}

// 老方法
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}
// `instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上

// instanceof 用法
function C() {}
function D() {}

const c = new C()
c instanceof C // output: true   因为 Object.getPrototypeOf(c) === C.prototype
c instanceof Object // output: true   因为 Object.prototype.isPrototypeOf(c)
c instanceof D // output: false   因为 D.prototype 不在 c 的原型链上
```

### `isArrayBufferView` 判断 `ArrayBuffer.isView`

```js
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}
```

### `isString` 判断字符串

```js
function isString(val) {
  return typeof val === 'string';
}
```

### `isNumber` 判断数组

```js
function isNumber(val) {
  return typeof val === 'number';
}
```

### `isObject` 判断对象

```js
// 排除 `null` 的情况
function isObject(val) {
  return val !== null && typeof val === 'object';
}
```

### `isPlainObject` 判断纯对象

纯对象： 用 `{}` 或 `new Object()` 创建的对象。

- `Object.create(null)` 呢? 也包含在内
- 这个不是判断空对象

```js
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

var obj = Object.create(null);
console.log(isPlainObject(obj)); // true
```

其实就是判断目标对象的原型是不是 `null` 或 `Object.prototype`

### `isDate` 判断 `Date`

```js
function isDate(val) {
  return toString.call(val) === '[object Date]';
}
```

### `isFile` 判断文件类型

```js
function isFile(val) {
  return toString.call(val) === '[object File]';
}
```

### `isBlob` 判断 `Blob`

```js
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}
```

`Blob` 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取。

### `isFunction` 判断函数

```js
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}
```

### `isStream` 判断是否是流

```js
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
```

### `isURLSearchParams` 判断 `URLSearchParams`

```js
function isURLSearchParams(val) {
  return toString.call(val) === '[object URLSearchParams]';
}
```

`URLSearchParams` 接口定义了一些实用的方法来处理 URL 的查询字符串

详情可看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)：

示例:

```js
var paramsString = "q=URLUtils.searchParams&topic=api"
var searchParams = new URLSearchParams(paramsString);

for (let p of searchParams) {
  console.log(p);
}

searchParams.has("topic") === true; // true
searchParams.get("topic") === "api"; // true
searchParams.getAll("topic"); // ["api"]
searchParams.get("foo") === null; // true
searchParams.append("topic", "webdev");
searchParams.toString(); // "q=URLUtils.searchParams&topic=api&topic=webdev"
searchParams.set("topic", "More webdev");
searchParams.toString(); // "q=URLUtils.searchParams&topic=More+webdev"
searchParams.delete("topic");
searchParams.toString(); // "q=URLUtils.searchParams"
```

### `trim` 去除首尾空格

```js
// `trim` 方法不存在的话，用正则
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}
```

### `isStandardBrowserEnv` 判断标准浏览器环境

但是官方已经不推荐使用这个属性 **Deprecated** [`navigator.product`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/product)。

```js
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}
```

### `forEach` 遍历对象或数组

保留了英文注释，提升大家的英文阅读能力。

```js
/**
 * Iterate over an Array or an Object invoking a function for each item.
 * 用一个函数去迭代数组或对象
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 * 如果是数组，回调将会调用value, index, 和整个数组
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 * 如果是对象，回调将会调用value, key, 和整个对象
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  // 如果值不存在，无需处理
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  // 如果不是对象类型，强制转成数组类型
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    // 是数组，for 循环执行回调 fn
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    // 是对象，for 循环执行回调 fn
    for (var key in obj) {
      // 只遍历可枚举属性
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
```

思考: 源码为什么不用 `forEach` 和 `for...in` 呢 ?

### `merge` 合并对象

```js
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}
```

### `extend` 扩展对象

```js
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
```

### `stripBOM` 删除 `UTF-8` 编码中 `BOM`

```js
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}
```

所谓 `BOM`，全称是`Byte Order Mark`，它是一个`Unicode`字符，通常出现在文本的开头，用来标识字节序。

`UTF-8` 主要的优点是可以兼容 `ASCII`，但如果使用 `BOM` 的话，这个好处就荡然无存了。

## 知识点

- `typeof`
- `instanceof`
- `Object.create(null)`
- `Buffer`
- `Blob`
- `URLSearchParams`
- `forEach`
- `for...in`
- `BOM`

