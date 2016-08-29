'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

var questions = [
  {
    type: 'input',
    name: 'first',
    message: 'First name?',
    default: 'Brian'
  },
  {
    type: 'input',
    name: 'last',
    message: 'Last name?',
    default: 'Woodward'
  }
];

enquirer.ask(questions)
  .then(function(answers) {
    console.log(answers)
  });
