'use strict';

var Separator = require('choices-separator');
var Enquirer = require('..');
var enquirer = new Enquirer({pointer: '♥'});

enquirer.register('list', require('prompt-list'));

var questions = [
  {
    type: 'list',
    name: 'theme',
    message: 'What do you want to do?',
    choices: [
      'Order a pizza',
      'Make a reservation',
      new Separator(),
      'Ask for opening hours',
      {
        name: 'Contact support',
        disabled: 'Unavailable at this time'
      },
      'Talk to the receptionist'
    ]
  },
  {
    type: 'list',
    name: 'size',
    message: 'What size do you need?',
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
