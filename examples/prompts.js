'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.use(require('prompt-confirm'));

var questions = [
  {type: 'confirm', name: 'winter', message: 'Do you like winter?'},
  {type: 'input', name: 'name', message: 'What is your name?'},
];

enquirer.ask(questions)
  .then(function(answers) {
    console.log(answers)
  });
