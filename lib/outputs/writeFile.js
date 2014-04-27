var fs = require('fs');

module.exports = function writeFile(filename, options) {
  options = options || {};
  return fs.createWriteStream(filename, options);
};
