var from = require('from2');

module.exports = readArray;

function readArray(options, array) {

  if(Array.isArray(options)) {
    array = options;
    options = {};
  }

  options = options || {};
  array   = array   || [];

  return from(options, function(size, next) {
    if(!array.length) return next();
    var chunk = array.shift();

    if(!Buffer.isBuffer(chunk) || typeof chunk !== 'string') {
      chunk = chunk.toString ? chunk.toString() : '' + chunk;
    }
    next(null, chunk);
  });
}

readArray.obj = readArray.bind(null, { objectMode: true });
