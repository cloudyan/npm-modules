# loadtest

[loadtest](https://www.npmjs.com/package/loadtest)

实际可以直接使用压力测试工具 **ab工具**

## loadtest

```bash
loadtest -n 1000 -c 100 http://localhost:3000/
loadtest -c 10 --rps 200 http://mysite.com/

pm2 start -i 4 —-name server index
```

## ab 工具

```bash
ab -n 100 -c 10 http://test.com/
# 其中－n表示请求数，－c表示并发数

ab -n 1000 -c 100 -s 1 https://www.baidu.com/event?err=myerror

# 总共100个并发执行1000此请求，超时时间为1s
# -n 1000 即：共发送1000个请求
# -c 100  即：每次并发100个
# -s 1    即：每个请求的超时时间为 1s
```

### Requests per second  [#/sec] (mean) 吞吐率(大家最关心的指标之一)

服务器并发处理能力的量化描述，单位是reqs/s，指的是在某个并发用户数下单位时间内处理的请求数。某个并发用户数下单位时间内能处理的最大请求数，称之为最大吞吐率。

记住：吞吐率是基于并发用户数的。这句话代表了两个含义：

- 吞吐率和并发用户数相关
- 不同的并发用户数下，吞吐率一般是不同的
　　
计算公式：总请求数/处理完成这些请求数所花费的时间，即

- Request per second=Complete requests/Time taken for tests

必须要说明的是，这个数值表示当前机器的整体性能，值越大越好。

### Time per request [ms] (mean)用户平均请求等待时间，大家最关心的指标之二

计算公式：处理完成所有请求数所花费的时间/（总请求数/并发用户数）

### Time per request [ms] (mean, across all concurrent requests) 服务器平均请求处理时间，大家最关心的指标之三

计算公式：处理完成所有请求数所花费的时间/总请求数

### Transfer rate [Kbytes/sec] received 平均每秒网络上的流量

可以帮助排除是否存在网络流量过大导致响应时间延长的问题


总的来说ab工具ab小巧简单，上手学习较快，可以提供需要的基本性能指标，但是没有图形化结果，不能监控。因此ab工具可以用作临时紧急任务和简单测试。


同类型的压力测试工具还有：webbench、siege、http_load等

另有一些压力测试软件，包括LoadRnner、Jmeter等，则是不同程度上包含了服务器处理之外的时间，比如LoadRunner运行在用户PC上，可以录制浏览器行为。

参考：

- https://wohugb.gitbooks.io/pm2/content/features/quick-start.html
- https://www.jianshu.com/p/43d04d8baaf7
- https://linuxeye.com/124.html
