var through = require('through2');

module.exports = function count(stream, callback) {

  var counters = {
    chunks: 0,
    chars: 0,
    bytes: 0
  };

  function write(chunk, enc, next) {
    var type = typeof chunk;

    counters.chunks++;

    if(type === 'number' || type === 'boolean') {
      chunk = chunk.toString();
    }

    if(type === 'string') {
      counters.chars += chunk.length;
      counters.bytes += Buffer.byteLength(chunk);
    }
    else if(Buffer.isBuffer(chunk)) {
      counters.chars += chunk.toString().length;
      counters.bytes += chunk.length;
    }

    next();
  }

  function flush() {
    callback(counters);
    this.push(null);
  }

  stream.pipe(through(write, flush));
  
  return stream;
};
