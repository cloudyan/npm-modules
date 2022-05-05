# about hooks

## Hooks的使用规则

[Hook 规则](https://zh-hans.reactjs.org/docs/hooks-rules.html)

- 只在最顶层使用 Hook
  - **不要在循环，条件或嵌套函数中调用 Hook**
- 只在 React 函数中调用 Hook
  - **不要在普通的 JavaScript 函数中调用 Hook**。你可以：
    - ✅ 在 React 的函数组件中调用 Hook
    - ✅ 在自定义 Hook 中调用其他 Hook

这里如果使用违规，会在控制台报错 `Hooks can only be called inside the body of a function component` 会罗列出你可能触发警告的三个原因：

- 你的 React 和 React DOM 可能版本不匹配。
- 你可能打破了 Hook 的规则。
- 你可能在同一个应用中拥有多个 React 副本。

具体根据提示逐一排查。

### 使用Hooks的优势

- 使用hooks，如果业务变更，就不需要把函数组件修改成类组件。
- 告别了繁杂的this和合并了难以记忆的生命周期。
- 更好的完成状态之间的共享，解决原来class组件内部封装的问题，也解决了高阶组件和函数组件的嵌套过深。一个组件一个自己的state，一个组件内可以公用。
- 支持包装自己的Hooks(自定义Hooks)，是基于纯命令式的api。

### 内置API介绍理解

React一共内置了9种Hook。

- useState
- usEffect
- useContext
- useReducer
- useCallback
- useMemo
- useRef
- useImperativeHandle
- useLayoutEffect

## 提取自定义 Hook

**自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook。**

只在自定义 Hook 的顶层无条件地调用其他 Hook。

与 React 组件不同的是，自定义 Hook 不需要具有特殊的标识。我们可以自由的决定它的参数是什么，以及它应该返回什么（如果需要的话）。换句话说，它就像一个正常的函数。但是它的名字应该始终以 use 开头，这样可以一眼看出其符合 Hook 的规则。

## 常见自定义 hooks 库

- https://ahooks.js.org/zh-CN/hooks/use-request/index
- https://taro-docs.jd.com/taro/docs/hooks#taro-hooks
- https://vuejs.org/api/composition-api-lifecycle.html


参考文档：

- https://zh-hans.reactjs.org/docs/hooks-custom.html
- https://github.com/peng-yin/note/issues/45
