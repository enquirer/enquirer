const { MultiList } = require('../prompts');

const prompt = new MultiList({
  message: 'Keywords:',
  sep: ' ~ ',
  choices: ['foo', 'bar', 'baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
