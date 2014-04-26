var fs = require('fs');

module.exports = function toFile(filename, options) {
  options = options || {};
  return fs.createWriteStream(filename, options);
};
