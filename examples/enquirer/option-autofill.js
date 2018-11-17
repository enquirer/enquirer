'use strict';

const options = { autofill: 'show' };
const answers = { name: 'Jon Schlinkert', username: 'jonschlinkert' };

const Enquirer = require('enquirer');
const enquirer = new Enquirer(options, answers);

const questions = [
  { type: 'input', name: 'name', message: 'What is your name?' },
  { type: 'input', name: 'username', message: 'What is your username?' },
  { type: 'input', name: 'email', message: 'What is your email?' },
  { type: 'input', name: 'phone', message: 'What is your phone number?' }
];

enquirer.prompt(questions)
  .then(answers => console.log(answers))
  .catch(console.error);
