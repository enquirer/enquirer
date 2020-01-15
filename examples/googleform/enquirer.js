'use strict';

const Enquirer = require('enquirer');
const GoogleFormPrompt = require('..');
const { FORM_ID } = require('./constants');

const enquirer = new Enquirer();
enquirer.register('google', GoogleFormPrompt);

enquirer
  .prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Would you like fill out our Survey?'
    },
    {
      name: 'Google Form',
      message: 'Please provide the information:',
      formId: process.argv[2] || FORM_ID,
      type: 'google',
      skip() {
        return this.state.answers.confirm !== true;
      }
    }
  ])
  .then(res => console.log(res))
  .catch(err => console.log(err));
