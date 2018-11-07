const Prompt = require('../../lib/prompts/multiselect');
const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  symbols: { indicator: '$' },
  choices: [
    { name: 'foo', choices: ['a', 'b', { name: 'c', disabled: true }] },
    { name: 'bar', choices: ['d', 'e', 'f'] },
    { name: 'baz', choices: ['g', { name: 'h', disabled: true }, 'i'] },
    {
      name: 'fez',
      choices: [
        { name: 'faz', choices: ['j', 'k', 'l'] },
        { name: 'bip', choices: ['m', { name: 'n', disabled: true }] },
        { name: 'zam', choices: [{ name: 'one', choices: ['o', 'p'] }] }
      ]
    }
  ]
});

prompt
  .run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
