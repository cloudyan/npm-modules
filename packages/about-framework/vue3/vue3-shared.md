# vue3 中的 `@vue/shared` 工具函数

- https://github.com/vuejs/core

参考好文：

- 若川：[初学者也能看懂的 Vue3 源码中那些实用的基础工具函数](https://juejin.cn/post/6994976281053888519)

可以将源码 ts 转为 js，打包后更容易分析。在 [.github/contributing.md](https://github.com/vuejs/vue/blob/dev/.github/CONTRIBUTING.md) 找到贡献指南，查看说明

```bash
# 全局安装 pnpm 和 ni
npm i -g pnpm @antfu/ni

nr build
```

TODO: 另需要学习

- 编译输出添加 sourceMap
- 并配合调试流程，边分析源码边实践验证

## 源码分析

查看 [`core/packages/shared/dist/shared.esm-bundler.js`](./shared.esm-bundler.js)

有些同 vue2 的 shared 工具方法，也新增了一些，可以仔细品一下，为什么要设计这些的方法

## 知识点

- [`startsWith()`](https://es6.ruanyifeng.com/#docs/string-methods)
- `isMap`
  - Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。
- `isSet`
  - 类似数组，但是成员的值都是唯一的，没有重复的值
- MDN [`instanceof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)
- MDN [`typeof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof) 8 种
- `Symbol`
- `Promise`
  - [JavaScript Promise迷你书（中文版）](http://liubin.org/promises-book/)
- `\B`
- `Object.is` vs `===` 是否严格相等, 区别两点
  - `+0` === `-0` true
  - `NaN` === `NaN` false
  - polyfill
- `Object.defineProperty` 算是一个非常重要的 API, 参看 [learn-javascript](https://github.com/cloudyan/learn-javascript/blob/master/es5/readme.md#objectdefineproperty)
  - `Object.defineProperties`
- `globalThis` ES2020
  - [learn-javascript](https://github.com/cloudyan/learn-javascript/blob/master/es6/02.let-const/readme.md#globalthis)
  - [MDN globalThis](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis)

## 扩展

- 正则在线工具 [regex101](https://regex101.com/)

```js
// instanceof
const isDate = (val) => val instanceof Date;

// 例子：
isDate(new Date()); // true

// `instanceof` 操作符左边是右边的实例。但不是很准，但一般够用了。原理是根据原型链向上查找的。

isDate({__proto__: new Date()}); // true
// 实际上是应该是 Object 才对。
// 所以用 instanceof 判断数组也不准确。
// 再比如
({__proto__: [] }) instanceof Array; // true
// 实际上是对象。
// 所以用 数组本身提供的方法 Array.isArray 是比较准确的。
```

**`Object.is` polyfill**

- MDN [Object.is](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

```js
// https://github.com/zloirock/core-js/blob/master/packages/core-js/internals/same-value.js#L1-L7

// `SameValue` abstract operation
// https://tc39.es/ecma262/#sec-samevalue
// eslint-disable-next-line es/no-object-is -- safe
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return x === y ?
        x !== 0 || 1 / x === 1 / y : // +0 != -0
        x != x && y != y; // NaN == NaN
};
```

**`globalThis` polyfill**

vue3 `@vue/shared` 中是如下实现的

```js
const getGlobalThis = () => {
  if (typeof globalThis !== 'undefined') { return globalThis; }
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  return {};
};

var globals = getGlobalThis();

if (typeof globals.setTimeout !== 'function') {
  // 此环境中没有 setTimeout 方法！
}
```
