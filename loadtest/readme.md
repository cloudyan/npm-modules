# loadtest

[loadtest](https://www.npmjs.com/package/loadtest)

实际可以直接使用压力测试工具 **ab工具**

loadtest

```bash
loadtest -n 1000 -c 100 http://localhost:3000/
loadtest -c 10 --rps 200 http://mysite.com/

pm2 start -i 4 —-name server index
```

ab 工具

```bash
ab -n 100 -c 10 http://test.com/
# 其中－n表示请求数，－c表示并发数
```

总的来说ab工具ab小巧简单，上手学习较快，可以提供需要的基本性能指标，但是没有图形化结果，不能监控。因此ab工具可以用作临时紧急任务和简单测试。

同类型的压力测试工具还有：webbench、siege、http_load等

另有一些压力测试软件，包括LoadRnner、Jmeter等，则是不同程度上包含了服务器处理之外的时间，比如LoadRunner运行在用户PC上，可以录制浏览器行为。

参考：

- https://wohugb.gitbooks.io/pm2/content/features/quick-start.html
- https://www.jianshu.com/p/43d04d8baaf7
- https://linuxeye.com/124.html
