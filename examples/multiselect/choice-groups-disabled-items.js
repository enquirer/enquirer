const Prompt = require('../../lib/prompts/multiselect');
const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  initial: 'b',
  limit: 8,
  symbols: { check: '$' },
  choices: {
    foo: ['a', 'b', { name: 'c', disabled: true }]
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
