# cross-env

[cross-env](https://www.npmjs.com/package/cross-env)

## 是什么

运行跨平台设置和使用环境变量的脚本

## 出现原因

当您使用`NODE_ENV=production`, 来设置环境变量时，大多数Windows命令提示将会阻塞(报错)。 （异常是Windows上的Bash，它使用本机Bash。）同样，Windows和POSIX命令如何使用环境变量也有区别。

使用POSIX，您可以使用：`$ ENV_VAR`和使用Windows，则使用 `％ENV_VAR％`。

> 说人话：windows不支持`NODE_ENV=development`的设置方式。会报错

## 解决

`cross-env`使得您可以使用单个命令，而不必担心为平台正确设置或使用环境变量。 只要在POSIX系统上运行就可以设置好，而`cross-env`将会正确地设置它。

说人话: 这个迷你的包(`cross-env`)能够提供一个设置环境变量的scripts，让你能够以unix方式设置环境变量，然后在windows上也能兼容运行。

## 安装

```bash
yarn cross-env --dev
```

## 使用

```js
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```

`NODE_ENV`环境变量将由`cross-env`设置

参考：

- https://blog.csdn.net/qq_26927285/article/details/78105510
