# `js-cookie` Cookie 的封装，简单、轻量、好用

- https://www.npmjs.com/package/js-cookie
- https://github.com/js-cookie/js-cookie#readme

参考好文：

- MDN: [HTTP Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)
- rfc6265: [HTTP State Management Mechanism](https://datatracker.ietf.org/doc/html/rfc6265)
- [【源码阅读系列】js-cookie库](https://github.com/yeyp/blog/issues/7)
- [造一个 js-cookie 轮子](https://github.com/haixiangyan/my-js-cookie)

这个 `js-cookie` 使用很简单，看源码发现需要考虑的事儿不少，我之前有简单处理过 `url query` 参数解析的逻辑，着重考虑一些点（url 的 `hash`, `?` 以及编解码不规范等），这里看到这个库，感觉又需要可以去完善一波了。

## 目标

- 作用
- 源码分析

## 作用

Cookie 使基于[无状态](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#http_is_stateless_but_not_sessionless)的HTTP协议记录稳定的状态信息成为了可能。

了解更多查看：MDN [HTTP Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)

这里不做更多信息的展示，建议通过 MDN 学习**第一手知识**。

下面留几个问题：

- cookie 的作用
- cookie 可以设置[哪些值](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)，有什么特点
- 如何限制访问 cookie
- cookie 的跨域问题涉及到什么，怎么处理
- 通过 cookie 来实现身份验证，怎么考虑安全性？
  - 有哪些风险，怎么防护？[攻击类型 (en-US)](https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks)
    - 会话固定攻击
    - 会话劫持和 XSS
    - 跨站请求伪造（CSRF）
  - 其他的可替代方案
- 跟踪和隐私，实现原理，怎么防护

### 使用

```js
import cookie from 'js-cookie'

cookie.set('foo', 'bar')
cookie.set('name', 'value', { expires: 7, path: '' })
cookie.set('name', 'value', { expires: 7, path: '' })

cookie.get('foo', { domain: 'sub.example.com' }) // `domain` won't have any effect...!

cookie.set('name', 'value', { path: '' })
cookie.remove('name') // fail!
cookie.remove('name', { path: '' }) // removed!
```

注意：

Please note that the default encoding/decoding strategy is meant to be interoperable [only between cookies that are read/written by js-cookie](https://github.com/js-cookie/js-cookie/pull/200#discussion_r63270778). To override the default encoding/decoding strategy you need to use a [converter](https://github.com/js-cookie/js-cookie#converters).

## 源码分析

`js-cookie/dist/js.cookie.mjs`

```js
/*! js-cookie v3.0.1 | MIT */
// 合并对象
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}

/* 特殊字符

- `/(%[\dA-F]{2})+/gi`                         decodeURIComponent 解码
- `/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g` decodeURIComponent
    %23 %24 %26 %2B %2F %3A %3C %3D %3E %3F %40 %5B %5D %5E %60 %7B %7C %7D
      #   $   &   +   /   :   <   =   >   ?   @   [   ]   ^   `   {   |   }
- `/%(2[346B]|5E|60|7C)/g`                     decodeURIComponent
    %23 %24 %26 %2B %5E %60 %7C
      #   $   &   +   ^   `   |
- `/[()]/g`                                    escape 编码
    ( => %28
    ) => %29

*/

// 默认转换规则
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent) // 解码所有 ASCII 字符
  },
  write: function (value) {
    // <cookie-value> 是可选的，如果存在的话，那么需要包含在双引号里面。
    // 支持除了控制字符（CTLs）、空格（whitespace）、双引号（double quotes）、逗号（comma）、分号（semicolon）以及反斜线（backslash）之外的任意 US-ASCII 字符。
    // 注意: 属性值中不应该包括分号（,），根据规范要求，如果存在分号，取分号前面的内容
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, // 这些不需要编码
      decodeURIComponent
    )
  }
};

// 入口文件
function init (converter, defaultAttributes) {
  function set (key, value, attributes) {
    // 非浏览器，直接返回 undefined
    if (typeof document === 'undefined') {
      return
    }

    // 合并参数
    attributes = assign({}, defaultAttributes, attributes);

    // 支持设置数字，单位为天，允许小数
    if (typeof attributes.expires === 'number') {
      // 864e5 科学计数法， 一天的毫秒数 86400000 = 1000*60*60*24
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    // 将 Date 类型 转为 toUTCString
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    // 编码 cookie key,
    // <cookie-name> 可以是除了控制字符 (CTLs)、空格 (spaces) 或制表符 (tab)之外的任何 US-ASCII 字符。
    //                同时不能包含以下分隔字符： `( ) < > @ , ; : \ " /  [ ] ? = { }`
    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      key + '=' + converter.write(value, key) + stringifiedAttributes)
  }

  function get (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    //   1. 获取 document.cookie
    //   2. 通过 `, ` 分割字符串
    //   3. 通过 `=` 再次分割，对 key 做 decodeURIComponent 解码，对 value 做 converter.read 处理
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var foundKey = decodeURIComponent(parts[0]);
        jar[foundKey] = converter.read(value, foundKey);

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (key, attributes) {
        set(
          key,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
/* eslint-enable no-var */

export default api;
```

## 知识点

- `document.cookie`
- `正则`
- `defaultConverter`
- `replace`
- `noConflict`
- [`RFC 6265`](http://tools.ietf.org/html/rfc6265#section-4.1.1)
- `escape()` 返回一个字符的Unicode编码值。它不对加号`+`编码
- `encodeURI()` 输出符号的utf-8形式，并且在每个字节前加上%。它不对 `; / ? : @ & = + $ , #` 编码，也不对单引号`'`编码
- `encodeURIComponent()` 对 `; / ? : @ & = + $ , #` 编码

## 扩展

- 阮一峰 [关于URL编码](https://www.ruanyifeng.com/blog/2010/02/url_encoding.html)
  - URL 只能使用 ASCII 字符集来通过因特网进行发送。
  - 非 ASCII 转为 ASCII 格式，`%`+两位的十六进制数
  - URL 不能包含空格。URL 编码通常使用 + 来替换空格。
    - 网址路径的编码，用的是utf-8编码
    - 查询字符串的编码，用的是操作系统的默认编码
- 阮一峰 [字符编码笔记：ASCII，Unicode 和 UTF-8](https://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)
- [Web客户端追踪（上）—Cookie追踪](https://paper.seebug.org/227/)
- [你是如何被广告跟踪的？](https://zhuanlan.zhihu.com/p/34591096)
- [从前端视角看浏览器隐身模式下你是如何被追踪的](https://segmentfault.com/a/1190000040475726)

扩展知识

- `escape()` 返回一个字符的Unicode编码值。

除了ASCII字母、数字、标点符号"@ * _ + - . /"以外，对其他所有字符进行编码。在\u0000到\u00ff之间的符号被转成%xx的形式，其余符号被转成%uxxxx的形式。对应的解码函数是unescape()。

escape()不对"+"编码。
