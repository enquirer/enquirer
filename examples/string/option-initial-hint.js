'use strict';

const Prompt = require('../../lib/types/string');
const prompt = new Prompt({
  message: 'What is your username?',
  initial: 'jonschlinkert',
  hint: '...start typing'
});

prompt.run()
  .then(answer => console.log('ANSWER:', answer))
  .catch(console.log)
