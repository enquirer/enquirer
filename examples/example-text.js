'use strict';

const Prompt = require('../lib/prompts/text');
const prompt = new Prompt({
  name: 'username',
  message: 'What is your username?',
  footer: 'This is the footer',
  initial: 'jonschlinkert'
});

prompt.run()
  .then(answer => console.error('ANSWER:', answer))
  .catch(console.error);
