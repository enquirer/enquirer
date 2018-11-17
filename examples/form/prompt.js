'use strict';

const { Form } = require('enquirer');

const prompt = new Form({
  name: 'user',
  message: 'Please provide the following information:',
  choices: [
    { name: 'firstname', message: 'First Name', initial: 'Jon' },
    { name: 'lastname', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'username', message: 'GitHub username', initial: 'jonschlinkert' }
  ]
});

prompt.run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
