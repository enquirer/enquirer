'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.ask('First name?')
  .then(function(answers) {
    console.log(answers)
  });
