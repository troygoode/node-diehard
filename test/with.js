/*jslint indent:2*/
/*global require:true, console:true, process:true, setInterval:true*/

(function () {
  'use strict';

  var diehard = require('../');

  setInterval(function () {
    console.log('Both cleanup handlers will be called!');
  }, 1000);

  // synchronous handlers
  diehard(function () {
    console.log('cleanup #1');
  });

  // async handlers
  diehard(function (done) {
    console.log('cleanup #2');
    done();
  });

}());

