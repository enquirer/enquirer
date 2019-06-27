'use strict';

const { prompt } = require('enquirer');

prompt({
  type: 'confirm',
  name: 'really',
  message: 'Wirklich?',
  initial: 'j',
  default: '(J/n)',
  isTrue(input) {
    const isString = typeof input === 'string';
    return isString ? input.toLowerCase() === 'j' : false;
  },
  isFalse(input) {
    const isString = typeof input === 'string';
    return isString ? input.toLowerCase() === 'n' : false;
  }
})
  .then(console.log)
  .catch(console.log);
