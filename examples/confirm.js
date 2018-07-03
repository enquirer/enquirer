const Prompt = require('../prompts/confirm');
const prompt = new Prompt({ message: 'Want to answer?' });

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
