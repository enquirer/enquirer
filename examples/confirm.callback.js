'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();
enquirer.register('confirm', require('enquirer-prompt-confirm'));

var questions = [
  {type: 'confirm', name: 'foo', message: 'Foo?'},
  {type: 'confirm', name: 'bar', message: 'Bar?'}
];

// TODO
enquirer.ask(questions, function(err, answers) {
  console.log(err);
});
