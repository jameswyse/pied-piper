var invoke = require('./invoke');

module.exports = function join(sep) {
  sep = sep || ', ';
  return invoke('join', sep);
};
