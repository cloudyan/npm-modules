# `emitter` 发布订阅

- https://www.npmjs.com/package/tiny-emitter
- https://github.com/scottcorgan/tiny-emitter#readme
- https://www.npmjs.com/package/mitt
- https://github.com/developit/mitt#readme

参考好文：

- [Emitter事件派发---mitt和tiny-emitter源码分析](https://github.com/xiong-ling/learning-series/issues/2)

## 目标

- 作用
- 源码分析

## 源码分析

- [ ] DIY [tiny-emitter](https://github.com/scottcorgan/tiny-emitter/blob/master/index.js)

```js
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;
module.exports.TinyEmitter = E;
```

### `mitt`

- [ ] [mitt](https://github.com/developit/mitt/blob/main/src/index.ts)

### 对比分析

`mitt` 和 `tiny-emitter` 的对比分析

- 共同点
  - 都支持 `on(type, handler)`、`off(type, [handler])` 和 `emit(type, [evt])` 三个方法来注册、注销、派发事件
- 不同点
  - `emit`
    - 有 `all` 属性，可以拿到对应的事件类型和事件处理函数的映射对象，是一个 `Map` 不是 `{}`
    - 支持监听 `'*'` 事件，可以调用 `emitter.all.clear()`清除所有事件
    - 返回的是一个对象，对象存在上面的属性
  - `tiny-emitter`
    - 支持链式调用, 通过 `e` 属性可以拿到所有事件（需要看代码才知道）
    - 多一个 `once` 方法 并且 支持设置 `this`(指定上下文 `ctx`)
    - 返回的一个函数实例，通过修改该函数原型对象来实现的

## 知识点

- `addEventListener`
- `Map`
- `call`
- `apply`

## 扩展

- [观察者模式 vs 发布订阅模式](https://zhuanlan.zhihu.com/p/51357583)
- [观察者模式 vs 发布-订阅模式](https://juejin.cn/post/6844903513009422343)
  - 英文原文：[Observer vs Pub-Sub pattern](https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c)
- [理解【观察者模式】和【发布订阅】的区别](https://juejin.cn/post/6978728619782701087)
