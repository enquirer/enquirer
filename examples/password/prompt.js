'use strict';

const { Password } = require('enquirer');

const prompt = new Password({
  name: 'password',
  message: 'What is your password?'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
