var map = require('./map');

module.exports = function toString() {
  return map(function(chunk) {
    return chunk.toString();
  });
};
