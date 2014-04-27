//
// pied-piper: Stream and pipeline utilities for node.js
// ======================================================
//
// Licence:  http://opensource.org/licenses/MIT
// NPM:      http://npmjs.org/package/pied-piper
// GitHub:   http://github.com/jameswyse/pied-piper
//


//
// Module dependencies
//
var path       = require('path');
var from       = require('from2');
var through    = require('through2');
var duplex     = require('duplexer2');
var pipeline   = require('multipipe');
var requireAll = require('require-all');


//
// Shortcuts
//
var slice      = Array.prototype.slice;
var resolve    = path.resolve.bind(null, __dirname);
var loader     = function(dir) { return requireAll(resolve(dir)); };


//
// Import functions
//
var inputs     = loader('inputs');
var outputs    = loader('outputs');
var transforms = loader('transforms');
var consumers  = loader('consumers');


//
// Create a new stream
//
function createStream() {
  var streams = slice.call(arguments);
  return new Stream(streams);
}


//
// Exports
//
module.exports = exports = createStream;

exports.Stream   = Stream;
exports.pipeline = pipeline;
exports.through  = through;
exports.duplex   = duplex;
exports.from     = from;


//
// Stream constructor
//
function Stream(streams, options, input) {
  options = options || {};

  var len = Array.isArray(streams) ? streams.length : 0;

  // No streams passed, create one
  if(!len) {
    this._wrapped = through.obj();
  }
  else {
    // Convert Stream instances to node streams
    streams = streams.map(function(item) {
      return item && item.toStream ? item.toStream() : item;
    });

    // Assign _wrapped
    if(len === 1) {
      this._wrapped = streams[0];
    }
    else {
      this._wrapped = pipeline.apply(this, streams);
    }
  }

  // The original input stream is passed when chaining.
  // This is so toStream() can return a duplex stream covering
  // the entire pipeline and not just the last stream added.
  if(input) {
    this._input = input;
  }
  else {
    this._input = through.obj();
    this._input.pipe(this._wrapped);
  }
}


//
// Return a duplex Stream which writes to
// the first stream and reads from the last.
//
Stream.prototype.toStream = function() {
  return duplex(this._input, this._wrapped);
};


//
// Return the raw stream, piped to the stream provided
//
Stream.prototype.pipe = function(stream) {
  return this._wrapped.pipe(stream);
};


//
// Add input functions to Stream
// Input functions return a readable Stream.
//
Object.keys(inputs).forEach(function(fn) {
  exports[fn]           = inputs[fn];
  Stream.prototype[fn]  = createChainableInput(fn);
});


//
// Add output functions to Stream
// Output functions return a writeable Stream.
//
Object.keys(outputs).forEach(function(fn) {
  exports[fn]          = outputs[fn];
  Stream.prototype[fn] = createChainableOutput(fn);
});


//
// Add transform functions to Stream
// Transform functions return a duplex/through Stream
//
Object.keys(transforms).forEach(function(fn) {
  exports[fn]          = transforms[fn];
  Stream.prototype[fn] = createChainableTransform(fn);
});


//
// Add consumer functions to Stream
// Consumer functions return the unmodified Stream they are passed
//
Object.keys(consumers).forEach(function(fn) {
  exports[fn]          = consumers[fn];
  Stream.prototype[fn] = createChainableConsumer(fn);
});


//
// Create a chainable version of an output function
//
function createChainableOutput(fn) {
  return function() {
    var next = exports[fn].apply(null, arguments);

    if(this._wrapped && this._wrapped.readable) {
      this._wrapped.pipe(next);
      this._wrapped.on('error', next.emit.bind(next, 'error'));
    }

    if(next.readable) {
      return new Stream([next], {}, this._input);
    }

    return this;
  };
}


//
// Create a chainable version of an input function
//
function createChainableInput(fn) {
  return function() {
    var next  = exports[fn].apply(null, arguments);

    if(this._input && this._input.writable) {
      next.pipe(this._input);
    }

    return this;
  };
}


//
// Create a chainable version of a consumer function
//
function createChainableConsumer(fn) {
  return function() {
    if(this._wrapped) {
      var args = slice.call(arguments);
      args.unshift(this._wrapped);
      exports[fn].apply(null, args);
    }

    return this;
  };
}


//
// Create a chainable version of a transform function
//
function createChainableTransform(fn) {
  return function() {
    var next = exports[fn].apply(null, arguments);

    if(this._wrapped && this._wrapped.readable) {
      this._wrapped.pipe(next);
      this._wrapped.on('error', next.emit.bind(next, 'error'));
    }

    return new Stream([next], {}, this._input);
  };
}
