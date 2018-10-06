const Prompt = require('../../lib/prompts/rawlist');
const prompt = new Prompt({
  name: 'colors',
  message: 'Favorite flavor?',
  choices: [
    'chocolate',
    'strawberry',
    'vanilla'
  ]
});

prompt.run()
  .then(answer => console.log('ANSWER:', answer))
  .catch(console.log);
