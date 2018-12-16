'use strict';

const { Confirm } = require('enquirer');

const prompt = new Confirm({
  type: 'confirm',
  name: 'really',
  message: 'Wirklich?',
  initial: 'j',
  default: '(J/n)'
});

prompt.isTrue = input => input === 'j';
prompt.isFalse = input => input === 'n';

prompt.run()
  .then(console.log)
  .catch(console.log);
