'use strict';

const Prompt = require('./prompts/text');
const prompt = new Prompt({
  name: 'username',
  message: 'What is your username?',
  hint: '(this is a hint)',
  footer: 'This is the footer'
});

prompt.run()
  .then(answer => console.error('ANSWER:', answer))
  .catch(console.error);
