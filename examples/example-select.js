'use strict';

const Prompt = require('../lib/prompts/select');
const prompt = new Prompt({
  name: 'username',
  message: 'Favorite?',
  choices: ['apple', 'orange', 'watermelon']
});

prompt.run()
  .then(answer => console.error('ANSWER:', answer))
  .catch(console.error);
