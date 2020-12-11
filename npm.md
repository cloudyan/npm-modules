# npm

使用 `npm install` 和 `npm ci` 的主要区别是：

- 该项目必须有一个 `package-lock.json` 或 `npm-shrinkwrap.json`。
- 如果 `package-lock.json` 中的依赖项与 `package.json` 的依赖项不匹配，`npm ci` 则将退出并显示错误，而不是更新 `package-lock.json`
- `npm ci` 只能一次安装整个项目：使用此命令无法添加单个依赖项。
- 如果 `node_modules` 已经存在，它将在 `npm ci` 开始安装之前自动删除。
- 它永远不会写入 `package.json` 或任何包锁：安装基本上是冻结的。
