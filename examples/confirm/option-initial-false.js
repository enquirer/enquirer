const Prompt = require('../../lib/prompts/confirm');
const prompt = new Prompt({ message: 'Want to answer?', initial: false });

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
