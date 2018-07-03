const { run } = require('../prompts/text');

run({ message: 'What is your name?', initial: 'Jane Doe' })
  .then(answer => console.log('answer:', answer))
  .then(() => run({ message: 'What is your name?', initial: 'Jane Doe' }))
  .then(answer => console.log('answer:', answer))
  .catch(console.error);
