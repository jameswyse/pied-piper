var map = require('./map');

module.exports = function toLowerCase() {
  return map(function(chunk) {
    return chunk
      .toString()
      .toLowerCase();
  });
};
