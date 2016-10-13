'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.register('password', require('prompt-password'));

var questions = {
  type: 'password',
  message: 'Enter your git password',
  name: 'password'
};

enquirer.ask(questions)
  .then(function(answers) {
    console.log(answers)
  });
