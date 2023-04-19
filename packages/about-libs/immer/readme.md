<!-- 源码分析 Source code analysis，由 `npx create tpl sca` 生成 -->
# immer

参考好文

- https://immerjs.github.io/immer/zh-CN/

## 目标

- 作用
- 源码分析

## 作用

Immer 包暴露了一个完成所有工作的默认函数。

```js
produce(currentState, recipe: (draftState) => void): nextState
```

`produce` 需要一个 `baseState`，以及一个可用于对传入的 `draft` 进行所有所需更改的 `recipe`。关于 Immer 的有趣之处在于 baseState 将保持不变，但 nextState 将反映对 DraftState 所做的所有更改.

### 术语

- `(base)state`: 传递给 `produce` 的不可变状态
- `recipe`: `produce` 的第二个参数，它捕获了 base state 应该如何 `mutated`。
- `draft`: 任何 `recipe` 的第一个参数，它是可以安全 `mutate` 的原始状态的代理。
- `producer`: 一个使用 `produce` 的函数，通常形式为 `(baseState, ...arguments) => resultState`

## 源码分析



## 知识点



## 扩展
