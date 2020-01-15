'use strict';

const GoogleFormPrompt = require('..');
const { FORM_ID } = require('./constants');

const prompt = new GoogleFormPrompt({
  name: 'Google Form',
  message: 'Please provide the information:',
  formId: process.argv[2] || FORM_ID,
});

prompt.run()
  .then(res => console.log(res))
  .catch(err => console.log(err));
