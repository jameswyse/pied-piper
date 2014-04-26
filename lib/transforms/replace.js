var map = require('./map');

module.exports = function replace(from, to) {
  return map(function(chunk) {
    return chunk
      .toString()
      .replace(from, to);
  });
};
