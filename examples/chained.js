'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.question('first', 'First name?', {default: 'Jon'});
enquirer.question('middle', 'Middle name?');
enquirer.question('last', 'Last name?');

enquirer.prompt('first')
  .then(function() {
    return enquirer.prompt('middle');
  })
  .then(function() {
    return enquirer.prompt('last');
  })
  .then(enquirer.finish())
  .then(function(answers) {
    console.log(answers);
    return answers;
  })
