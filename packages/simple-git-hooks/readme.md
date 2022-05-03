# simple-git-hooks

- https://www.npmjs.com/package/simple-git-hooks
- https://github.com/toplenboren/simple-git-hooks#readme

特点

- Zero dependency
- Small configuration (1 object in package.json)
- Lightweight

## 目标

- 作用
- 源码分析

## 作用

### 使用

1. `npm i simple-git-hooks -D`
2. Add `simple-git-hooks` to your `package.json`

```js
{
  "simple-git-hooks": {
    "pre-commit": "npx lint-staged",
    "pre-push": "cd ../../ && npm run format",

    // All unused hooks will be removed automatically by default
    // but you can use the `preserveUnused` option like following to prevent this behavior

    // if you'd prefer preserve all unused hooks
    "preserveUnused": true,

    // if you'd prefer preserve specific unused hooks
    "preserveUnused": ["commit-msg"]
  }
}
```

This configuration is going to run all linters on every `commit` and formatter on `push`.

> 注意: 每次更新命令后，需要手动运行 `npx simple-git-hooks`, 用于更新 git 钩子（.git/hooks/）

### 常见问题

参见 https://github.com/toplenboren/simple-git-hooks#common-issues

## 源码分析

源码不多，300 多行，参见 [simple-git-hooks](./simple-git-hooks.js)
