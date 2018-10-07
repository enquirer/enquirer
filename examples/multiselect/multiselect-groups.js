const Prompt = require('../../lib/prompts/multiselect');
const prompt = new Prompt({
  name: 'colors',
  message: 'What are your favorite colors?',
  initial: 'bar',
  limit: 8,
  symbols: { check: '$' },
  choices: {
    foo: [{ symbol: void 0, name: 'a' }, 'b', 'c'],
    bar: ['d', 'e', 'f'],
    baz: {
      qux: ['g', 'h', 'i'],
      fez: {
        faz: ['j', 'k', 'l'],
        bip: ['m', 'n']
      }
    }
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
