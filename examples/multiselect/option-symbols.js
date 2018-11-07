const { red, dim } = require('ansi-colors');
const Prompt = require('../../lib/prompts/multiselect');
const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  symbols: { indicator: { on: red('❤'), off: dim.red('❤') } },
  choices: ['Foo', 'Bar', 'Baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
