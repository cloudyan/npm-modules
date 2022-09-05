# universal-request

用于发起网络请求

> 此库在查看低代码引擎数据源文档时注意到（定制数据源请求实现（运行态））
> 大意是：低代码引擎底层请求使用 fetch，也给了方案如何替换为使用 axios，
> 而这里作者需要改造为支持使用 umi-request

这里涉及到了一个问题，两个常用的库 axios 与 umi-request 互换的问题。

参考文档：

- [LowCodeEngine - 定制数据源请求并出码](https://juejin.cn/post/7102585821915512840)
- [定制数据源请求实现（运行态）](https://www.yuque.com/lce/usage/datasource#NVdIn)
- [数据源引擎设计](https://www.yuque.com/lce/doc/datasource-engine)
