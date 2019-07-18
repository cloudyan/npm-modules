const execa = require("execa");

execa("echo",["hello world"]).then(result => {
  console.log(result.stdout);
  //=> 'hello world'
});
execa("grep",["hello", "index.js"]).then(result => {
  console.log(result.stdout);
}).catch(err => console.log(err));

execa("ls").then(result => {
  console.log(result);
  console.log(result.stdout);
});

(async () => {
  const {stdout} = await execa('echo', ['你好！']);
  console.log(stdout);
  //=> 'unicorns'
})();
