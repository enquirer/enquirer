'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

var questions = [
  {
    type: 'input',
    name: 'first',
    default: 'Jon',
    message: 'First name?'
  },
  {
    type: 'input',
    name: 'last',
    default: 'Schlinkert',
    message: 'Last name?'
  }
];

enquirer.ask(questions)
  .then(function(answers) {
    console.log(answers)
  });
