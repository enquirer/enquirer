'use strict';

const begoo = require('begoo');
const { BooleanPrompt } = require('enquirer');

const prompt = new BooleanPrompt({
  name: 'answer',
  header: begoo('Welcome to Boolean Prompt'),
  message: 'Did you like enquirer?',
  initial: false
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
