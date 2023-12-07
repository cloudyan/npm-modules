import qs from 'querystring'

let c;
const str = qs.stringify({
  a: 1,
  b: 0,
  c,
  d: true,
  e: false,
  f: null,
  g: undefined,
  h: '',
})
console.log(str);

const obj = qs.parse(str);
const obj2 = qs.parse('?a=1&a=2&b=2'.slice(1));
console.log(obj);
console.log(obj2);
console.log(qs.parse(''));


// console.log(Boolean(true))
// console.log(Boolean(false))
// console.log(Boolean(c))
