const Prompt = require('../../lib/prompts/select');
const prompt = new Prompt({
  name: 'alphabet',
  message: 'Favorite color?',
  choices: ['Blue', 'Green', 'Orange', 'Red', 'Violet'],
  limit: 3
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
