'use strict';

var Separator = require('choices-separator');
var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.register('rawlist', require('prompt-rawlist'));

var questions = [
  {
    type: 'rawlist',
    name: 'theme',
    message: 'What do you want to do?',
    choices: [
      'Order a pizza',
      'Make a reservation',
      new Separator(),
      'Ask opening hours',
      'Talk to the receptionist'
    ]
  },
  {
    type: 'rawlist',
    name: 'size',
    message: 'What size do you need',
    choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
    filter: function (val) {
      return val.toLowerCase();
    }
  }
];

enquirer.ask(questions)
  .then(function (answers) {
    console.log(answers);
  });
