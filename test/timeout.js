/*jslint indent:2*/
/*global require:true, console:true, process:true, setInterval:true*/

(function () {
  'use strict';

  process.env.DEBUG = '*';

  var diehard = require('../');

  diehard.register(function () {
    console.log('Async handler called.  I am not calling the callback since this one will never complete.  You should expect to see: "Timed out.  Exiting with error code 2."\n');
  });

  diehard.listen({timeout: 100});

  setTimeout(function () {
    throw new Error('Test has failed since diehard did not use the given timeout');
  }, 2000);

  process.kill(process.pid, 'SIGINT');
}());
