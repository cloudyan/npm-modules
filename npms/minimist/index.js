const parseArgs = require('minimist');

// 从第三个参数开始截取，process.argv的第一个参数为node，第二个参数为当前执行的js文件名
const argv = parseArgs(process.argv.slice(2), opts={});

// 打印命令行解析后的对象信息
console.log(argv);
for (let key in argv) {
  console.log('key：%s | value:%s', key, argv[key] );
}
