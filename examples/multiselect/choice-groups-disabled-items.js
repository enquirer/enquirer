'use strict';

const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  initial: 'b',
  limit: 8,
  symbols: { check: '$' },
  choices: [
    {
      name: 'foo',
      choices: ['a', 'b', { name: 'c', disabled: true }]
    }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
