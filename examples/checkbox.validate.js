'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.register('checkbox', require('prompt-checkbox'));

var separator = enquirer.separator.bind(enquirer);
var questions = [
  {
    type: 'checkbox',
    message: 'Select toppings',
    name: 'toppings',
    choices: [
      separator(' = The Meats = '),
      {name: 'Pepperoni'},
      {name: 'Ham'},
      {name: 'Ground Meat'},
      {name: 'Bacon'},
      separator(' = The Cheeses = '),
      {name: 'Mozzarella', checked: true },
      {name: 'Cheddar'},
      {name: 'Parmesan'},
      separator(' = The usual ='),
      {name: 'Mushroom'},
      {name: 'Tomato'},
      separator(' = The extras = '),
      {name: 'Pineapple'},
      {name: 'Olives', disabled: 'out of stock'},
      {name: 'Extra cheese'}
    ],
    validate: function (answer) {
      if (answer.length < 1) {
        return 'You must choose at least one topping.';
      }
      return true;
    }
  }
];

enquirer.ask(questions)
  .then(function(answers) {
    console.log(answers)
  });
