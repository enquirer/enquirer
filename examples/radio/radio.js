const Prompt = require('../../lib/prompts/radio');
const prompt = new Prompt({
  name: 'color',
  message: 'Pick a color',
  choices: ['a', 'b', 'c']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
