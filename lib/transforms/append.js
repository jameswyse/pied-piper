var map = require('./map');

module.exports = function append(str) {
  return map(function(chunk) {
    return chunk.toString() + str;
  });
};
