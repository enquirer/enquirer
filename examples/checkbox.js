'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.register('checkbox', require('prompt-checkbox'));
enquirer.ask({
    type: 'checkbox',
    message: 'What is your favorite color?',
    name: 'color',
    choices: [
      'red',
      'blue',
      'yellow'
    ]
  })
  .then(function(answers) {
    console.log(answers)
  });
