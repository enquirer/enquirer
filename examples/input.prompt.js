'use strict';

const Enquirer = require('..');
const enquirer = new Enquirer();
const Prompt = require('../lib/input');

var question = {
  type: 'input',
  name: 'first',
  message: 'First name?'
};

var prompt = new Prompt(question)
  .ask(function(answer) {
    console.log(answer)
  })
