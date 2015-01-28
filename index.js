/*jslint indent:2*/
/*global require:true, module:true, console:true, process:true*/

(function () {
  'use strict';

  var Diehard = require('./diehard');

  if (!global._diehardHandlers) {
    global._diehardHandlers = [];
  }

  module.exports = new Diehard(global._diehardHandlers);

}());

