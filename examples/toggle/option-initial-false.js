const Prompt = require('../../lib/prompts/toggle');
const prompt = new Prompt({ message: 'Want to answer?', initial: 'no' });

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
