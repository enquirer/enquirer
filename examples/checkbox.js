'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.register('checkbox', require('prompt-checkbox'));

var questions = [
  {
    type: 'checkbox',
    message: 'What is your favorite color?',
    name: 'color',
    choices: [
      'red',
      'blue',
      'yellow'
    ]
  }
];

enquirer.ask(questions)
  .then(function(answers) {
    console.log(answers)
  });
