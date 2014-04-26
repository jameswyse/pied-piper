module.exports = function out(stream) {
  stream.pipe(process.stdout);
  return stream;
};
