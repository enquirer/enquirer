const Prompt = require('../lib/prompt');
const prompt = new Prompt({ name: 'error', message: 'Should throw an error' });

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(err => console.error(err));
