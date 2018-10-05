const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/typeahead');
const prompt = new Prompt({
  name: 'color',
  message: 'What\'s your favorite color?',
  choices: ['Red', 'Green', 'Blue'],
  typeahead: true
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
