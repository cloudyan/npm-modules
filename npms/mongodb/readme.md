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

https://www.cnblogs.com/clsn/p/8214194.html#auto_id_30

## 使用

参考：

- https://docs.mongodb.com/guides/
- https://www.cnblogs.com/clsn/p/8214194.html
- https://www.mongodb.org.cn/manual/
- https://www.runoob.com/mongodb/mongodb-create-database.html
