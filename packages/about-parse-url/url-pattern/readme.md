# url-pattern

- https://www.npmjs.com/package/url-pattern
- https://github.com/snd/url-pattern#readme

## 目标

- 作用
- 源码分析

## 作用

easier than regex string matching patterns for urls and other strings.
turn strings into data or data into strings.

### 使用

```js
var pattern = new UrlPattern('/api/users(/:id)');

pattern.match('/api/users/10'); // {id: '10'}
pattern.match('/api/users'); // {}
pattern.match('/api/products/5'); // null

pattern.stringify() // '/api/users'
pattern.stringify({id: 20}) // '/api/users/20'


var pattern = new UrlPattern('/v:major(.:minor)/*');
pattern.match('/v1.2/');
// {major: '1', minor: '2', _: ''}

pattern.match('/v2/users');
// {major: '2', _: 'users'}

pattern.match('/v/');
// null


var pattern = new UrlPattern('(http(s)\\://)(:subdomain.):domain.:tld(\\::port)(/*)')

pattern.match('http://mail.google.com:80/mail');
// {subdomain: 'mail', domain: 'google', tld: 'com', port: '80', _: 'mail'}
```

## 源码分析
