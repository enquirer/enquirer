const Prompt = require('../../lib/types/number');
const prompt = new Prompt({
  name: 'number',
  message: 'Please enter a number'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
