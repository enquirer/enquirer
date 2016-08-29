'use strict';

var Prompt = require('enquirer-prompt');

var question = {
  type: 'input',
  name: 'first',
  message: 'First name?'
};

var prompt = new Prompt(question)
  .ask(function(answer) {
    console.log(answer)
  })
