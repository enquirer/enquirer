const Prompt = require('../../lib/prompts/confirm');
const prompt = new Prompt({ name: 'answer', message: 'Want to answer?' });

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
