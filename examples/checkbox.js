'use strict';

var Separator = require('enquirer-separator');
var Enquirer = require('..');
var enquirer = new Enquirer();
enquirer.register('checkbox', require('enquirer-prompt-checkbox'));

var questions = [
  {
    type: 'checkbox',
    message: 'Select toppings',
    name: 'toppings',
    choices: [
      new Separator(' = The Meats = '),
      {name: 'Pepperoni'},
      {name: 'Ham'},
      {name: 'Ground Meat'},
      {name: 'Bacon'},
      new Separator(' = The Cheeses = '),
      {name: 'Mozzarella', checked: true },
      {name: 'Cheddar'},
      {name: 'Parmesan'},
      new Separator(' = The usual ='),
      {name: 'Mushroom'},
      {name: 'Tomato'},
      new Separator(' = The extras = '),
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
