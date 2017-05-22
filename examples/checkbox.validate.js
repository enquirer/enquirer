'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.register('checkbox', require('prompt-checkbox'));

var questions = [
  {
    type: 'checkbox',
    message: 'Select toppings',
    name: 'toppings',
    choices: [
      enquirer.separator(' = The Meats = '),
      {name: 'Pepperoni'},
      {name: 'Ham'},
      {name: 'Ground Meat'},
      {name: 'Bacon'},
      enquirer.separator(' = The Cheeses = '),
      {name: 'Mozzarella', checked: true },
      {name: 'Cheddar'},
      {name: 'Parmesan'},
      enquirer.separator(' = The usual ='),
      {name: 'Mushroom'},
      {name: 'Tomato'},
      enquirer.separator(' = The extras = '),
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
