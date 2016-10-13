'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

/**
 * TODO
 */

enquirer.register('confirm', require('prompt-confirm'));

var questions = [
  {type: 'confirm', name: 'foo', message: 'Foo?'},
  {type: 'confirm', name: 'bar', message: 'Bar?'}
];

enquirer.ask(questions, function(err, answers) {
  console.log(err);
});
