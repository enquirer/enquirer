const Prompt = require('../../lib/prompts/list');
const prompt = new Prompt({ message: 'Keywords:' });

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
