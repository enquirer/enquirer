'use strict';

const { Input } = require('enquirer');
const prompt = new Input({
  message: 'What is your username?',
  initial: 'jonschlinkert'
});

prompt.run()
  .then(answer => console.log('ANSWER:', answer))
  .catch(console.log);
