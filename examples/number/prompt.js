'use strict';

const { NumberPrompt } = require('enquirer');

const prompt = new NumberPrompt({
  name: 'number',
  message: 'Please enter a number'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
