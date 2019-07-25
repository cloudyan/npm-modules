# pm2

[pm2](https://www.npmjs.com/package/pm2)

pm2是一个带有负载均衡功能的应用进程管理器，类似有supervisor，forever。

对于线上项目，如果直接通过 node app 来启动，如果报错了可能直接停止导致整个服务崩溃，一般监控 node 有几种方案。

- supervisor: 一般用作开发环境的使用。
- forever: 管理多个站点，一般每个站点的访问量不大的情况，不需要监控。
- PM2: 网站的访问量比较大，需要完整的监控页面。

> 公司原来的项目采用的是 forever 的形式，不过如果 node 出现问题的时候，没有办法获取到有效的监控数据进行错误排查，因此新开发的系统准备采用 pm2 的形式进行前端以及 node 层的监控。

## PM2 的主要特性

- 内建负载均衡（使用 Node cluster 集群模块）
- 后台运行
- 0 秒停机重载，我理解大概意思是维护升级的时候不需要停机.
- 具有 Ubuntu 和 CentOS 的启动脚本
- 停止不稳定的进程（避免无限循环）
- 控制台检测
- 提供 HTTP API
- 远程控制和实时的接口 API ( Nodejs 模块,允许和 PM2 进程管理器交互 )

## PM2常用命令

假设你现在已经写好了一个app.js的文件，需要启动，你可以使用pm2进行管理

1. 启动

    ```bash
    pm2 start app.js
    pm2 start app.js --name my-api   #my-api为PM2进程名称
    pm2 start app.js -i 0           #根据CPU核数启动进程个数
    pm2 start app.js --watch   #实时监控app.js的方式启动，当app.js文件有变动时，pm2会自动reload
    ```

2. 查看进程

    ```bash
    pm2 list
    pm2 show 0 或者    # pm2 info 0  #查看进程详细信息，0为PM2进程id
    ```

3. 监控

    ```bash
    pm2 monit
    ```

4. 停止

    ```bash
    pm2 stop all      # 停止PM2列表中所有的进程
    pm2 stop 0        # 停止PM2列表中进程为0的进程
    ```

5. 重载

    ```bash
    pm2 reload all    # 重载PM2列表中所有的进程
    pm2 reload 0      # 重载PM2列表中进程为0的进程
    ```

6. 重启

    ```bash
    pm2 restart all    # 重启PM2列表中所有的进程
    pm2 restart 0      # 重启PM2列表中进程为0的进程
    ```

7. 删除PM2进程

    ```bash
    pm2 delete 0     # 删除PM2列表中进程为0的进程
    pm2 delete all   # 删除PM2列表中所有的进程
    ```

8. 日志操作

    ```bash
    pm2 logs [--raw]   # Display all processes logs in streaming
    pm2 flush          # Empty all log file
    pm2 reloadLogs     # Reload all logs
    ```

9. 升级PM2

    ```bash
    npm install pm2@lastest -g   #安装最新的PM2版本
    pm2 updatePM2                #升级pm2
    ```

10. 更多命令参数请查看帮助

    ```bash
    pm2 --help
    ```

参考：

- https://wohugb.gitbooks.io/pm2/content/features/quick-start.html
- https://juejin.im/post/5be406705188256dbb5176f9
- https://linuxeye.com/435.html
