const { BooleanPrompt } = require('enquirer');

const prompt = new BooleanPrompt({
  name: 'answer',
  message: 'Want to answer?',
  initial: false
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
