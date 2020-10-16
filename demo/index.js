const crypto = require('crypto');

const md5 = crypto.createHash('md5');

md5.update('Hello, world!');

console.log(md5.digest('hex'));