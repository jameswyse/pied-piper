var through = require('through2');

module.exports = function skip(num) {
  var count   = 0;

  function write(chunk, enc, callback) {

    if(count < num) {
      count++;
      return callback();
    }

    this.push(chunk);
    callback();
  }

  return through.obj(write);
};
