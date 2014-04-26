var map = require('./map');

module.exports = function invoke(method) {
  var args = Array.prototype.slice.call(arguments, 1);

  return map(function(chunk) {
    return chunk[method].apply(chunk, args);
  });
};
