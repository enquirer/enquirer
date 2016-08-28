'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.question('first', 'First name?');
enquirer.question('last', 'last name?');

enquirer.ask()
  .then(function(answers) {
    console.log(answers)
  });
