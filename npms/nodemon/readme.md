# nodemon

[nodemon](https://www.npmjs.com/package/nodemon)

直接参看 [nodemon 基本配置与使用](https://www.cnblogs.com/JuFoFu/p/5140302.html)

node 有一个 npm 模块 `supervisor` 也是用来监控进程的，不过除了 `supervisor` 外，还有很多其他的工具，从 github 的评分上看，比较热门的有 `forever`, `nodemon`, `node-dev`, pm2

`nodemon` 用来监视 node.js 应用程序中的任何更改并自动重启服务，非常适合用在开发环境中。

`nodemon` 使用 [Chokidar](https://www.npmjs.com/package/chokidar) 作为底层监控系统，但是如果监控失效，或者提示没有需要监控的文件时，就需要使用轮询模式（polling mode），即设置 `legacy-watch` 为 `true`

`nodemon`，配置比较方便，文档也很清晰

可以使用`-e`开关指定要监视的自定义文件扩展名列表

```bash
nodemon -e ".coffee|.js|.ejs" app.js
```

**安装**

```bash
npm install -g nodemon
```

参考：

- https://www.cnblogs.com/JuFoFu/p/5140302.html
