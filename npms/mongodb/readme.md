# mongodb

## 安装

- https://docs.mongodb.com/guides/server/install/

下载社区版解压安装

```bash
tar -zxvf mongodb-osx-ssl-x86_64-4.0.11.tgz

mkdir -p mongodb

cp -R -n mongodb-osx-ssl-x86_64-4.0.11/ mongodb

# 检查运行
mongod -v
mongod

# 命令行
mongo

> db.test.save( { a: 1 } )
> db.test.find()
```

或使用 `brew install mongodb`

## 配置

```bash
# 创建数据目录
mkdir -p /data/db

# 运行之前确保mongod拥有数据目录读写权限
mongod
# 默认情况下，该 mongod进程使用该/data/db目录，如果不是，需要制定--dbpath
mongod --dbpath /data/db

# 使用配置文件
mongod --config /etc/mongod.conf
```

`/usr/local/etc/mongod.conf` 为Mac 上Homebrew tap安装时的默认[配置文件](https://docs.mongodb.com/manual/reference/configuration-options/)

也可以命令查看当前配置 `db._adminCommand({getCmdLineOpts: 1})` [getCmdLineOpts](https://docs.mongodb.com/manual/reference/command/getCmdLineOpts/)

TODO: 目前还有几个问题

- 没法直接查看当前配置所在路径
  - 查询半天，应该是没命令直接查询当前所使用的配置文件路径
- 没法直接查看生效的配置是什么
  - 命令刚启动时，能看到当前配置的输出
  - 或进数据库后使用getCmdLineOpts查看，但不一定全

## 添加用户

进入数据库命令行添加

```bash
mongo
> use nblog
> db.createUser(
  {
    user: "test1",
    pwd: "test1",
    roles: [{ role: "readWrite", db: "nblog" }]
  }
)
```

使用图形化界面

```bash
Open Shell

输入命令后 `cmd + R` 执行

或 选择 Users 右键 -> Add User
```

**注意：**对于非 admin 库，不能拥有 clusterAdmin、readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase 这些角色。

参见：https://www.cnblogs.com/clsn/p/8214194.html#auto_id_30

MongoDB 目前内置了 7 个角色。

- 数据库用户角色：read、readWrite;
- 数据库管理角色：dbAdmin、dbOwner、userAdmin；
- 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；
- 备份恢复角色：backup、restore；
- 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase
- 超级用户角色：root；这里还有几个角色间接或直接提供了系统超级用户的访问（dbOwner、userAdmin、userAdminAnyDatabase）
- 内部角色：__system

这些角色对应的作用如下：

- Read：允许用户读取指定数据库
- readWrite：允许用户读写指定数据库
- dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile
- userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户
- clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。
- readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限
- readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限
- userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
- dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。
- root：只在admin数据库中可用。超级账号，超级权限

## 部署

```bash
mongod --auth

mongo -u test_user -p [password]
```

参考：

- https://www.cnblogs.com/clsn/p/8214194.html
- https://www.cnblogs.com/huangxincheng/category/355399.html
- https://docs.mongodb.com/guides/
- https://www.mongodb.org.cn/manual/
- https://www.runoob.com/mongodb/mongodb-create-database.html
