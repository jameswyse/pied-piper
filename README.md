![pied-piper](https://raw.githubusercontent.com/jameswyse/pied-piper/master/docs/images/pied-piper.png)

# pied-piper
*Stream and pipeline utilities for node.js*

## Install
```bash
$ npm install --save pied-piper
```

## Examples
```javascript
var stream = require('pied-piper');

//
// Pipeline Style
//
stream(
  process.stdin,
  stream.split(),
  stream.prepend('-> '),
  stream.append(' <-\n'),
  process.stdout
);

//
// Chaining Style
//
stream()
  .stdin()
  .split()
  .filter(function(chunk) { return chunk && chunk != '' })
  .prepend('-> ')
  .append(' <-\n')
  .stdout();

//  
// Stream Style
//
process.stdin
  .pipe(stream.split())
  .pipe(stream.filter(function(chunk) { return chunk && chunk != '' }))
  .pipe(stream.prepend('-> '))
  .pipe(stream.append(' <-\n'))
  .pipe(process.stdout);

//
// Mix 'n' Match Style
//
var getLines = stream()
  .split()
  .filter(function(chunk) { return chunk && chunk != '' })
  .toStream();

var makePretty = stream(
  stream.prepend(' -> '),
  stream.append(' <-\n')
);

process.stdin
  .pipe(getLines)
  .pipe(makePretty)
  .pipe(stream.stdout);
```

## Quick & Dirty API Reference

```javascript
  // Create a new stream pipeline from 0 or more streams
  // Streams can any of type that makes sense in a pipeline.
  stream();
  stream(input, transform1, transform2, output);
  stream(transform1, transform2, transform3, etc);

  // Inputs
  stream.readFile(filename);
  stream.readObject(object);
  stream.readArray(array);
  stream.stdin();

  // Outputs
  stream.writeFile(filename);
  stream.stdout();
  stream.stderr();
  stream.collect(function(array) {});

  // Transforms
  stream()
    .append('string')
    .each(function(chunk) { })
    .filter(function(chunk) { return true; })
    .invoke('method', arg1, arg2, etc)
    .join('\n')
    .limit(5)
    .map(function(chunk) { return chunk; })
    .prepend('string')
    .replace('teh', 'the')
    .skip(10)
    .split('\n')
    .toJSON()
    .toLowerCase()
    .toString()
    .toUpperCase()
    .createHash('md5');

  // Or as static methods:
  stream.append('string');
  stream.skip(10);
  // etc

  // Consumers
  // When using as static methods pass the stream as the first argument.
  stream()
    .count(function(resultObject) { });

  // Or as static methods:
  stream.count(process.stdin function(resultObject) { });
```

## Licence

The MIT License (MIT)

Copyright (c) 2014 James Wyse <james@jameswyse.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
