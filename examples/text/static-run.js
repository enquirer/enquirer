const { prompt } = require('../../lib/prompts/text');

prompt({ message: 'What is your name?', initial: 'Jane Doe' })
  .then(answer => console.log('answer:', answer))
  .then(() => prompt({ message: 'What is your name?', initial: 'Jane Doe' }))
  .then(answer => console.log('answer:', answer))
  .catch(console.error);
