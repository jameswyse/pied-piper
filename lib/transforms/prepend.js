var map = require('./map');

module.exports = function prepend(str) {
  return map(function(chunk) {
    return str + chunk.toString();
  });
};
