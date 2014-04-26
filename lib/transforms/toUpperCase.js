var map = require('./map');

module.exports = function toUpperCase() {
  return map(function(chunk) {
    return chunk
      .toString()
      .toUpperCase();
  });
};
