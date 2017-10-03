/*jslint indent:2*/
/*global require:true, module:true, console:true, process:true*/

(function () {
  'use strict';

  var async = require('async'),
    debug = require('debug')('diehard'),
    Diehard;

  Diehard = function (handlers) {
    this.handlers = handlers;
  };

  Diehard.prototype.register = function (handler) {
    if (!handler) {
      throw new Error('You must pass a handler to diehard#register.');
    }
    this.handlers.push(handler);
    debug('Handler registered.');
  };

  Diehard.prototype.die = function (signal, uncaughtErr) {
    debug('die called.  signal:' + JSON.stringify(signal) + ', uncaughtErr' + JSON.stringify(uncaughtErr));
    if (this.timeout > 0 && !this.timeoutHandler) {
      this.timeoutHandler = setTimeout(function () {
        console.log('Timed out.  Exiting with error code 2.');
        process.exit(2);
      }, this.timeout);
    }

    if (uncaughtErr) {
      console.log(uncaughtErr);
    }

    var handlers = [];

    // remove all handlers from shared state
    while (this.handlers.length) {
      handlers.push(this.handlers.pop());
    }

    handlers = handlers
      .map(function (handler) {
        debug('handler.length: ' + handler.length);
        // transform given handler into a function that takes the signature: (signal, uncaughtErr, done)
        switch (handler.length) { // handle handler differently depending upon argument list length
        case 0:
          // we were passed a synchronous handler
          /*jslint unparam:true*/
          return function (signal, uncaughtErr, done) {
            handler();
            done();
          };
        case 1:
          /*jslint unparam:true*/
          return function (signal, uncaughtErr, done) {
            handler(done);
          };
        case 2:
          /*jslint unparam:true*/
          return function (signal, uncaughtErr, done) {
            handler(signal, done);
          };
        case 3:
          return handler;
        default:
          throw new Error('Invalid handler passed to diehard.');
        }
      })
      .map(function (handler) {
        // wrap the handler in a function that async.parallel can call
        return function (done) {
          debug('Calling handler...');
          handler(signal, uncaughtErr, done);
        };
      });

    debug(handlers.length + ' handlers are registered.');
    debug('Attempting to exit gracefully...');
    async.parallel(handlers, function (err) {
      if (err) {
        console.log(err);
      } else {
        debug('... graceful exit completed successfully.');
      }

      if (uncaughtErr || err) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  };

  Diehard.prototype.listen = function (options) {
    options = options || {uncaughtException: true};
    this.timeout = options.timeout;
    var ON_DEATH = require('death')(options);
    ON_DEATH(this.die.bind(this));
  };

  module.exports = Diehard;

}());

