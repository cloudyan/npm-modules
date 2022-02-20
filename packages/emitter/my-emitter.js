
// 事件总线（发布订阅模式）

class EventEmitter {
  constructor() {
    this.events = {}
  }
  on(name, fn) {
    const fns = this.events[name] || []
    fns.push({
      name,
      fn,
    })
    this.events[name] = fns

    return this
  }
  off(name, fn) {
    const fns = this.events[name] || []

    const liveFns = []
    for (const item of fns) {
      if (item.fn !== fn && item.fn._ !== fn) {
        liveFns.push(item.fn)
      }
    }
    this.events[name] = liveFns

    return this
  }
  emit(name, ...rest) {
    // 创建副本，如果回调函数内继续注册相同事件，会造成死循环
    const fns = [...this.events[name] || []]

    for (const item of fns) {
      item.fn(...rest)
    }

    return this
  }
  once(name, fn) {
    const self = this

    function listener () {
      self.off(name, fn)
      fn(...arguments)
    }
    listener._ = fn

    return this.on(name, listener)
  }
}

// testing
const eventBus = new EventEmitter()

const fn1 = (name, age) => {console.log(`${name}'s age is ${age}`)}
const fn2 = (name, age) => {console.log(`hello, ${name}'s age is ${age}`)}
eventBus.on('say', fn1)
eventBus.on('say', fn1)
eventBus.once('say', fn2)
eventBus.emit('say', 'jack', 20)



class EventEmitter2 {
  constructor() {
    this.events = {};
  }
  on(event, callback) {
    let callbacks = this.events[event] || [];
    callbacks.push(callback);
    this.events[event] = callbacks;
    return this;
  }
  off(event, callback) {
    let callbacks = this.events[event];
    this.events[event] = callbacks && callbacks.filter(fn => fn !== callback);
    return this;
  }
  emit(event, ...args) {
    let callbacks = this.events[event];
    callbacks.forEach(fn => {
      fn(...args);
    });
    return this;
  }
  once(event, callback) {
    // 这样处理更简单
    let wrapFun = function (...args) {
      callback(...args);
      this.off(event, wrapFun);
    };
    this.on(event, wrapFun);
    return this;
  }
}
