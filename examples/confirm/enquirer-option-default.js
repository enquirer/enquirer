'use strict';

const { Confirm } = require('enquirer');

const prompt = new Confirm({
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

prompt.run()
  .then(console.log)
  .catch(console.error);