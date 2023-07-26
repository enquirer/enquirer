'use strict';

const Enquirer = require('enquirer');

const enquirer = new Enquirer();

enquirer.prompt({
  type: 'number',
  name: 'number',
  message: 'Please enter a number'
})
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
