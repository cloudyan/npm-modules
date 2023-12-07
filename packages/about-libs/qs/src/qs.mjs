
export default {
  parse,
  stringify,
}

// interface IParams {
//   [prop: string]: any
// }

// URLSearchParams 兼容性还不错 iOS10.3+ Android5+
// 完全可用

var str = new URLSearchParams({a: 1, b: true}).toString()
console.log(new URLSearchParams(str))

/**
 * 将参数对象转换为URL编码字符串
 * @description 原则: 编码然后解码，尽可能获取原值
 * @description obj原值 => 编码 => URL编码字符串 => 解码 => 尽可能获取原值
 * @param {Object} params - 包含要转换为查询字符串的参数的对象。
 * @return {string} - 生成的查询字符串。
 *
 * @example
 * 类型 =编码=> 编码字符串 =解码=> 类型
 * string => string => string 支持还原
 * number => string => string 注意项，数字还原时被转为字符串
 * true  => 转为单 key => true 支持还原
 * false  => 会被过滤 => 无
 * undefined  => 会被过滤 => 无
 * object/array => 先 JSON.stringify 再 encodeURIComponent，支持还原
 * 默认不编码的特殊字符，加强编码
 * `!'()` => `%21%27%28%29` => `!'()` 支持还原
 */
function stringify(params = {}) {
  const result = [];
  Object.entries(params).forEach(([key, value]) => {
    // 以下 value 值，会被过滤
    if (![undefined, false].includes(value)) {
      if (value === true) {
        result.push(encode(key));
      } else if (typeof value === 'object') {
        result.push(encode(key) + '=' + encode(JSON.stringify(value)));
      } else {
        result.push(encode(key) + '=' + encode(value));
      }
    }
  })
  return result.join('&')
}

/**
 * 解析URL 查询字符串并返回一个包含键值对的对象
 * @description 原则: 编码然后解码，尽可能获取原值
 * @param {string} queryStr - 要解析的查询字符串。默认为空字符串。
 * @param {object} params - 与解析后的键值对合并的附加参数。默认为空对象。
 * @return {object} - 包含从查询字符串和附加参数中解析出的键值对的对象。
 * @example
 * 类型 =编码=> 编码字符串 =解码=> 类型
 * string => string => string 支持还原
 * number => string => string 注意项，数字还原时被转为字符串
 * true  => 转为单 key => true 支持还原
 * false  => 会被过滤 => 无
 * undefined  => 会被过滤 => 无
 * object/array => 先 JSON.stringify 再 encodeURIComponent，支持还原
 * 默认不编码的特殊字符，加强编码
 * `!'()` => `%21%27%28%29` => `!'()` 支持还原
 */
function parse(
  queryStr = '',
  params = {}
) {
  const result = {}
  const arr = queryStr.replace(/^\?/, '').split('&');
  arr.forEach(item => {
    const [key, value] = item.split('=');
    // key 必须存在
    if (key) {
      // 只有 key，则为 true
      if (typeof value === 'undefined') {
        result[decodeURIComponent(key)] = true;
      } else {
        try {
          const temp = JSON.parse(decodeURIComponent(value));
          result[decodeURIComponent(key)] = temp;
        } catch (err) {
          // console.log(err
          result[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      }
    }
  })
  return {...result, ...params}
}

/**
 * 使用URL编码替换字符串中的特定字符。
 * @param {string} str - 需要编码的字符串。
 * @return {string} 编码后的字符串。
 * @description
 * 默认不编码的特殊字符，加强编码 `!'()` => `%21%27%28%29`
 */
function encode(str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

console.log(parse('?a=1&b=2'))

let c;
const str = stringify({
  a: 1, // 转字符串 '1'
  b: 0, // 转字符串 '0'
  c, // 过滤 undefined, null, false
  d: undefined, // 过滤
  e: null,
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
// 除了 boolean, 对象, 数组的编码方式与 qs 不一致，其他基本一致
// a=1&b=0&e=null&g&h=&i=%7B%7D&j=%7B%22a%22%3A1%7D&k=%5B%5D&l=%5Btrue%2Cfalse%2C%22%22%2Cnull%2C1%2C0%5D&m=1&n=0&o=%7B%7D&p=%7Ba%7D&q=%5B%5D&r=%5Babaa%5D&s=alipay%28-1%2F-1%29&ca=%21&cb=%27&cc=%28&cd=%29&ce=%60&cf=%2F&cg=%7C

// qs:
// a=1&b=0&e=&f=false&g=true&h=&j%5Ba%5D=1&l%5B0%5D=true&l%5B1%5D=false&l%5B2%5D=&l%5B3%5D=&l%5B4%5D=1&l%5B5%5D=0&m=1&n=0&o=%7B%7D&p=%7Ba%7D&q=%5B%5D&r=%5Babaa%5D&s=alipay%28-1%2F-1%29&ca=%21&cb=%27&cc=%28&cd=%29&ce=%60&cf=%2F&cg=%7C

// qs 库对特殊字符都会编码
// (,),!,',`,/,|

const obj = parse(str + '&aa=alipay(-1/-1)&=1');
console.log(obj);

// qs 库
const qsStr = 'a=1&b=0&e=&f=false&g=true&h=&j%5Ba%5D=1&l%5B0%5D=true&l%5B1%5D=false&l%5B2%5D=&l%5B3%5D=&l%5B4%5D=1&l%5B5%5D=0&m=1&n=0&o=%7B%7D&p=%7Ba%7D&q=%5B%5D&r=%5Babaa%5D&s=alipay%28-1%2F-1%29&ca=%21&cb=%27&cc=%28&cd=%29&ce=%60&cf=%2F&cg=%7C'
console.log(parse(qsStr));
