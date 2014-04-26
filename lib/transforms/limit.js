var through = require('through2');

module.exports = function limit(max) {
  var count   = 0;
  var flushed = false;

  function write(chunk, enc, callback) {
    count++;

    if(count <= max) {
      this.push(chunk);
    }
    else if(!flushed) {
      flushed = true;
      this.push(null);
    }

    callback();
  }

  function flush() {
    if(!flushed) this.push(null);
  }

  return through.obj(write, flush);
};
