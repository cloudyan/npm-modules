import qs from 'qs';

let c;
const str = qs.stringify({
  a: 1, // 转字符串 '1'
  b: 0, // 转字符串 '0'
  c, // 过滤 undefined, null, false
  d: undefined, // 过滤
  e: null, // 过滤 null
  f: false, // 过滤 false
  g: true, // boolean
  h: '', //
  i: {}, //
  j: {a: 1}, //
  k: [], //
  l: [true, false, '', null, 1, 0], //
  m: '1',
  n: '0',
  // 似对象字符串
  o: '{}', // 会转为对象
  p: '{a}',
  q: '[]', // 会转为数组
  r: '[abaa]',
  s: 'alipay(-1/-1)',
  ca: '!',
  cb: `'`,
  cc: '(',
  cd: ')',
  ce: '`', // %60
  cf: '/', // %2F
  cg: '|', // %7C
})
console.log(str);

// qs stringify 默认将 boolean number 转为 string，使用 parse 序列化时就无法还原了
// https://www.npmjs.com/package/qs#parsing-primitivescalar-values-numbers-booleans-null-etc
// If you wish to auto-convert values which look like numbers,
// booleans, and other values into their primitive counterparts,
// you can use the query-types Express JS middleware
// which will auto-convert all request query parameters.
const obj = qs.parse(str + '&aa=alipay(-1/-1)&=1');
console.log(obj);
// a=1&b=0&e=&f=false&g=true&h=&j%5Ba%5D=1&l%5B0%5D=true&l%5B1%5D=false&l%5B2%5D=&l%5B3%5D=&l%5B4%5D=1&l%5B5%5D=0&m=1&n=0&o=%7B%7D&p=%7Ba%7D&q=%5B%5D&r=%5Babaa%5D&s=alipay%28-1%2F-1%29&ca=%21&cb=%27&cc=%28&cd=%29&ce=%60&cf=%2F&cg=%7C

const obj2 = qs.parse('?a=1&a=2&b=2'.slice(1));
console.log(obj2);
console.log(qs.parse(''));


// console.log(Boolean(true))
// console.log(Boolean(false))
// console.log(Boolean(c))

const qsStr2 = `a=1&b=0&g&h=&i=%7B%7D&j=%7B%22a%22%3A1%7D&k=%5B%5D&l=%5Btrue%2Cfalse%2C%22%22%2Cnull%2C1%2C0%5D&m=1&n=0&o=%7B%7D&p=%7Ba%7D&q=%5B%5D&r=%5Babaa%5D&s=alipay(-1%2F-1)&ca=!&cb=%60&cc='&cd=%2F&ce=%7C`
console.log(qs.parse(qsStr2));
