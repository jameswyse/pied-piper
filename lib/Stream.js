//
// Module dependencies
//
var path       = require('path');
var requireAll = require('require-all');
var from       = require('from2');
var through    = require('through2');
var duplex     = require('duplexer2');
var pipeline   = require('multipipe');
var slice      = Array.prototype.slice;

//
// Import functions
//
var inputs     = requireAll(path.join(__dirname, 'inputs'));
var outputs    = requireAll(path.join(__dirname, 'outputs'));
var transforms = requireAll(path.join(__dirname, 'transforms'));
var consumers  = requireAll(path.join(__dirname, 'consumers'));


//
// Create a new stream
//
function createStream() {
  var streams = slice.call(arguments);
  return new Stream(streams);
}


//
// Export createStream function
//
module.exports = exports = createStream;


//
// Export common utilities
//
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

  switch(streams.length) {
    case 0:
      this._wrapped = through.obj();
      break;
    case 1:
      this._wrapped = streams[0];
      break;
    default:
      this._wrapped = pipeline.apply(this, streams);
      break;
  }

  // The original input stream is passed when chaining.
  // This is so when you call toStream() it returns a
  // stream covering the entire pipeline and not just
  // the last stream added.
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
  exports[fn] = inputs[fn];
});


//
// Add output functions to Stream
// Output functions return a writeable Stream.
//
Object.keys(outputs).forEach(function(fn) {
  exports[fn]             = outputs[fn];
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
// Consumer functions return the unmodified Stream
//
Object.keys(consumers).forEach(function(fn) {
  exports[fn]          = consumers[fn];
  Stream.prototype[fn] = createChainableConsumer(fn);
});


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
