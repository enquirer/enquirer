'use strict';

const Prompt = require('../../lib/prompts/horizontal-list');
const prompt = new Prompt({
  message: 'Keywords:',
  choices: ['foo', 'bar', 'baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
