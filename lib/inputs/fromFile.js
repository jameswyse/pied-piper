var fs = require('fs');

module.exports = function fromFile(filename, options) {
  options = options || {};
  return fs.createReadStream(filename, options);
};
