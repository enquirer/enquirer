'use strict';

const { Editable } = require('enquirer');

const prompt = new Editable({
  name: 'user',
  message: 'Please provide the following information:',
  choices: [
    {
      name: 'firstname',
      message: 'First Name',
      initial: 'Jon',
      editable: true
    },
    {
      name: 'lastname',
      message: 'Last Name',
      initial: 'Schlinkert',
      editable: true
    }
  ]
});

prompt
  .run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
