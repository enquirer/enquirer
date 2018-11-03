const Prompt = require('../../lib/prompts/multiselect');
const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  initial: 'bar',
  symbols: { indicator: '$' },
  choices: {
    foo: ['a', 'b', { name: 'c', disabled: true }],
    bar: ['d', 'e', 'f'],
    baz: {
      qux: ['g', { name: 'h', disabled: true }, 'i'],
      fez: {
        faz: ['j', 'k', 'l'],
        bip: ['m', { name: 'n', disabled: true }],
        zam: {
          one: ['o', 'p']
        }
      }
    }
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
