/*jslint indent:2*/
/*global require:true, console:true, process:true, setInterval:true*/

(function () {
  'use strict';

  setInterval(function () {
    console.log('Only one cleanup handler will be called.');
  }, 250);

  process.on('SIGINT', function () {
    console.log('cleanup #1');
    process.exit(0);
  });

  process.on('SIGINT', function () {
    console.log('cleanup #2');
    process.exit(0);
  });

  setTimeout(function () {
    process.kill(process.pid, 'SIGINT');
  }, 1000);

}());

