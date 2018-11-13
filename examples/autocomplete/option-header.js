const AutoComplete = require('../../lib/prompts/autocomplete');
const yosay = require('yosay');

const prompt = new AutoComplete({
  header: yosay('Welcome to my awesome generator!'),
  message: 'Pick your favorite colors',
  choices: ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime']
});

prompt.run()
  .then(answer => console.log('ANSWER:', answer))
  .catch(err => console.log('ERROR:', err));
