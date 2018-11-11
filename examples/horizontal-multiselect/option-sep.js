const colors = require('ansi-colors');
const { hMultiSelect } = require('../..');

const prompt = new hMultiSelect({
  message: 'Keywords:',
  sep: colors.red(' ~ '),
  choices: ['foo', 'bar', 'baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
