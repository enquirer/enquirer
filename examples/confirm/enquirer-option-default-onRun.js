'use strict';

const { Confirm } = require('enquirer');

const prompt = new Confirm({
  name: 'really',
  message: 'Wirklich?',
  initial: 'j',
  default: '(J/n)',
  onRun() {
    this.isTrue = input => input === 'j';
    this.isFalse = input => input === 'n';
  }
})

prompt.run()
  .then(console.log)
  .catch(console.log);