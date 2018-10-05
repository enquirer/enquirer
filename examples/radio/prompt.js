const Prompt = require('../../lib/prompts/radio');
const prompt = new Prompt({
  name: 'color',
  message: 'Pick a color',
  choices: ['a', 'b', 'c', { name: 'add', message: 'Add option' }]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
