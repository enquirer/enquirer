'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.register('confirm', require('prompt-confirm'));

var questions = [
  {
    type: 'confirm',
    name: 'bacon',
    message: 'Do you like bacon?'
  },
  {
    type: 'input',
    name: 'favorite',
    message: 'Bacon lover, what is your favorite type of bacon?',
    when: function (answers) {
      return answers.bacon;
    }
  },
  {
    type: 'confirm',
    name: 'pizza',
    message: 'Ok... Do you like pizza?',
    when: function (answers) {
      return !likesFood('bacon')(answers);
    }
  },
  {
    type: 'confirm',
    name: 'foo',
    message: 'Ok... Do you like foo?',
    when: function (answers) {
      return !likesFood('bacon')(answers);
    }
  },
  {
    type: 'confirm',
    name: 'bar',
    message: 'Ok... Do you like bar?',
    when: function (answers) {
      return !likesFood('bacon')(answers);
    }
  },
  {
    type: 'input',
    name: 'favorite',
    message: 'Whew! What is your favorite type of pizza?',
    when: likesFood('pizza')
  }
];

function likesFood(key) {
  return function (answers) {
    return answers[key];
  };
}

enquirer.ask(questions)
  .then(function(answers) {
    console.log('answers:', answers);
  })
  .catch(function(err) {
    console.log(err);
  })
