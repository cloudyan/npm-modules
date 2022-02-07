
function promisify(original) {
  function fn(...rest) {
    return new Promise((resolve, reject) => {
      rest.push((err, ...values) => {
        if (err) {
          return reject(err)
        }
        resolve(values);
      })
      // original.apply(this, args);
      Reflect.apply(original, this, rest);
    })
  }
  return fn;
}

// test
const callback = (info, cb) => {
  const error = Math.random() > 0.5 ? new Error('cb error') : null;
  cb(error, info);
}

const p1 = promisify(callback);
p1('info').then((res) => {
  console.log(res);
}).catch(err => {
  console.log(err);
})
