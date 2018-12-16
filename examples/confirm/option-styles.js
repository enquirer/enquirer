'use strict';

const colors = require('ansi-colors');
const { prompt } = require('enquirer');

const question = {
  type: 'confirm',
  name: 'toast',
  message: 'Do you like toast?',
  styles: { primary: colors.blue },
  initial: true,
  separator: () => '',
  format: () => ''
};

prompt(question)
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
