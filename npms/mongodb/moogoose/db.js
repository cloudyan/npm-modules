const mongoose = require('mongoose');    // 引用mongoose模块
const config = require('./config');

// 创建一个数据库连接
// mongodb://user:pass@localhost:port/database
const DB_URL = `mongodb://${config.host}:${config.port}/${config.db}`;

// 连接
// mongoose.createConnection(uri, { poolSize: 4 })
mongoose.connect(DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;

// 连接成功
db.on('connected', res => {
  console.log('Mongoose connection open to ' + DB_URL);
})
db.on('disconnected', res => {
  console.log('Mongoose connection disconnected');
})

// 连接异常
db.on('error', err => {
  console.log('Mongoose connection error: ' + err);
})
db.once('open', function() {
  // we're connected!
})

// var kittySchema = new mongoose.Schema({
//   name: String
// });
// var Kitten = mongoose.model('Kitten', kittySchema);
// var silence = new Kitten({ name: 'Silence' });
// console.log(silence.name); // 'Silence'
