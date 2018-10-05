const MultiList = require('../../lib/prompts/multilist');

const prompt = new MultiList({
  message: 'Keywords:',
  choices: ['foo', 'bar', 'baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
