/*jslint indent:2*/
/*global require:true, module:true, console:true, process:true*/

(function () {
  'use strict';

  var async = require('async'),
    debug = require('debug')('diehard'),
    handlers = [];

  module.exports.register = function (handler) {
    if (!handler) {
      throw new Error('You must pass a handler to diehard#register.');
    } else if (handler.length === 0) {
      /*jslint unparam:true*/
      handlers.push(function (signal, uncaughtErr, done) {
        handler();
        done();
      });
      /*jslint unparam:false*/
    } else if (handler.length === 1) {
      /*jslint unparam:true*/
      handlers.push(function (signal, uncaughtErr, done) {
        handler(done);
      });
      /*jslint unparam:false*/
    } else if (handler.length === 2) {
      /*jslint unparam:true*/
      handlers.push(function (signal, uncaughtErr, done) {
        handler(signal, done);
      });
      /*jslint unparam:false*/
    } else if (handler.length === 3) {
      handlers.push(handler);
    } else {
      throw new Error('Invalid handler passed to diehard.');
    }
    debug('Handler registered.');
  };

  module.exports.die = function (signal, uncaughtErr) {
    if (uncaughtErr) {
      console.log(uncaughtErr);
    }

    handlers = handlers.map(function (handler) {
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

  module.exports.listen = function (options) {
    var ON_DEATH = require('death')(options || { uncaughtException: true });
    ON_DEATH(module.exports.die);
  };

}());

