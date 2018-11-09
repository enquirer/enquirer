const Prompt = require('../../lib/prompts/horizontal-select');
const prompt = new Prompt({
  message: 'Keywords:',
  choices: ['foo', 'bar', 'baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
