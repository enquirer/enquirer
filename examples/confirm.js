'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.register('confirm', require('prompt-confirm'));

var questions = [
  {type: 'confirm', name: 'foo', message: 'Foo?'},
  {type: 'confirm', name: 'bar', message: 'Bar?'}
];

enquirer.ask(questions)
  .then(function(answers) {
    console.log(answers)
  });
