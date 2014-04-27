var crypto  = require('crypto');
var through = require('through2');

module.exports = function createHash(algo) {
  var hasher = crypto.createHash(algo);

  function write(chunk, enc, next) {
    hasher.update(chunk);
    next();
  }

  function flush(next) {
    this.push(hasher.digest('hex'));
    this.push(null);
    next();
  }

  return through(write, flush);
};
