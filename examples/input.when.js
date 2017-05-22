'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

var questions = [
  {
    type: 'input',
    name: 'flavor',
    message: 'Favorite flavor?',
    default: 'chocolate'
  },
  {
    type: 'input',
    name: 'other',
    message: 'Anything else?',
    when: function() {
      var first = this.answers.first;
      if (typeof first === 'string') {
        this.message = `And your last name, ${first}?`;
        return true;
      }
    },
    default: 'Woodward'
  }
];

enquirer.ask(questions)
  .then(function(answers) {
    console.log(answers)
  });
