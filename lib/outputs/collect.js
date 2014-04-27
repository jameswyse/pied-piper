var through = require('through2');

module.exports = function collect(callback) {
  var chunks = [];

  function write(chunk, enc, next) {
    chunks.push(chunk);
    next();
  }

  function flush() {
    return callback(chunks);
  }

  return through(write, flush);
};
