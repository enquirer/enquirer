const { hMultiSelect } = require('../..');

const prompt = new hMultiSelect({
  message: 'Keywords:',
  choices: ['foo', 'bar', 'baz'],
  horizontal: true,
  symbols: { indicator: '' }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
