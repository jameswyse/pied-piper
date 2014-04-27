var fs = require('fs');

module.exports = function readFile(filename, options) {
  options = options || {};
  return fs.createReadStream(filename, options);
};
