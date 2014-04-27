var stream = require('../lib');
var path = require('path');
var resolve = path.resolve.bind(path, __dirname, '..');

//
// Pipeline style
//
stream(
  stream.readFile(resolve('package.json')),
  stream.createHash('md5'),
  stream.prepend('package.json: '),
  stream.append('\n'),
  process.stdout
);

//
// Chaining style
//
stream()
  .readFile(resolve('README.md'))
  .createHash('md5')
  .prepend('README.md: ')
  .append('\n')
  .stdout();

//
// Stream style
//
stream.readFile(resolve('LICENSE'))
  .pipe(stream.createHash('md5'))
  .pipe(stream.prepend('LICENSE: '))
  .pipe(stream.append('\n'))
  .pipe(process.stdout);

//
// Mix it up
//
function hashFile(filename, algo) {
  return stream()
    .readFile(resolve(filename))
    .createHash(algo || 'md5')
    .prepend(filename + ': ');
}

hashFile('.gitattributes')
  .append('\n')
  .stdout()
  .prepend('\x1B[31m')
  .append('\x1B[39m')
  .stderr();
