const Prompt = require('../../lib/prompts/multiselect');
const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  initial: 'bar',
  symbols: { indicator: '$' },
  choices: {
    foo: ['a', 'b', 'c'],
    bar: ['d', 'e', 'f']
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
