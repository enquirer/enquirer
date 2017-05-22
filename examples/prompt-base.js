'use strict';

var Prompt = require('prompt-base');

var question = {
  type: 'input',
  name: 'first',
  default: 'Jon',
  message: 'First name?'
};

var prompt = new Prompt(question)
  .ask(function(answer) {
    console.log(answer)
  })
