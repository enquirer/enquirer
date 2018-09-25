const Prompt = require('../../lib/prompts/select');
const prompt = new Prompt({
  name: 'color',
  message: 'Pick a color',
  choices: ['Red', 'Green', 'Blue'],
  typeahead: true
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
