'use strict';

const { prompt } = require('enquirer');

prompt({
  type: 'confirm',
  name: 'really',
  message: 'Wirklich?',
  initial: 'j',
  default: '(J/n)',
  onRun() {
    this.isTrue = input => input === 'j';
    this.isFalse = input => input === 'n';
  }
})
  .then(console.log)
  .catch(console.log);
