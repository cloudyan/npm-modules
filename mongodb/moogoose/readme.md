# mongoose

[mongoose](https://mongoosejs.com/) 是一款为异步工作环境设计的 MongoDB 对象建模工具。

schema是mongoose里会用到的一种数据模式，可以理解为表结构的定义；每个schema会映射到mongodb中的一个collection，它不具备操作数据库的能力

定义好了Schema，接下就是生成Model。model是由schema生成的模型，可以对数据库的操作

- Schema  : 一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
- Model   : 由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
- Entity  : 由Model创建的实体，他的操作也会影响数据库

**提示：** `Schema`、`Model`、`Entity`的关系请牢记，`Schema`生成`Model`，`Model`创造`Entity`，`Model`和`Entity`都可对数据库操作造成影响，但`Model`比`Entity`更具操作性。

验证端口能否访问方式

```bash
telnet your.machine.open.ip 27017
```

## Schema.Types

`Schema.Type`是由Mongoose内定的一些数据类型，基本数据类型都在其中，他也内置了一些Mongoose特有的`Schema.Type`。当然，你也可以自定义`Schema.Type`，只有满足`Schema.Type`的类型才能定义在Schema内。

```js
// 举例：
var ExampleSchema = new Schema({
  name: String,
  binary: Buffer,
  living: Boolean,
  updated: Date,
  age: Number,
  mixed: Schema.Types.Mixed,   // 该混合类型等同于nested
  _id: Schema.Types.ObjectId,  // 主键
  _fk: Schema.Types.ObjectId,  // 外键
  array: [],
  arrOfString: [String],
  arrOfNumber: [Number],
  arrOfDate: [Date],
  arrOfBuffer: [Buffer],
  arrOfBoolean: [Boolean],
  arrOfMixed: [Schema.Types.Mixed],
  arrOfObjectId: [Schema.Types.ObjectId]
  nested: {
    stuff: String,
  }
});
```

参考：

- https://mongoosejs.com/docs/index.html
- [Mongoose学习参考文档](https://cnodejs.org/topic/504b4924e2b84515770103dd)
- [Mongoose介绍和入门](https://www.cnblogs.com/zhongweiv/p/mongoose.html)
- https://developer.mozilla.org/zh-CN/docs/learn/Server-side/Express_Nodejs/mongoose
- https://expressjs.com/en/guide/database-integration.html
