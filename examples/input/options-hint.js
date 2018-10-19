'use strict';

const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/input');
const prompt = new Prompt({
  message: 'What is your username?',
  hint: '(start typing)'
});

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log)
