const Prompt = require('../../lib/prompts/list');
const prompt = new Prompt({
  name: 'keywords',
  message: 'Type comma-separated keywords'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
