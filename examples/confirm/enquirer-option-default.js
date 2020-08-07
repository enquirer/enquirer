'use strict';

const { prompt } = require('enquirer');

prompt({
  type: 'confirm',
  name: 'really',
  message: 'Wirklich?',
  initial: 'j',
  default: '(J/n)',
  isTrue(input) {
    return typeof input === 'boolean' ? input : input.toLowerCase() === 'j';
  },
  isFalse(input) {
    return typeof input === 'boolean' ? !input : input.toLowerCase() === 'n';
  }
})
  .then(console.log)
  .catch(console.log);
