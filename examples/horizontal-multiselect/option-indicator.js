const { cyan, green } = require('ansi-colors');
const { hMultiSelect } = require('../..');

const prompt = new hMultiSelect({
  message: 'Keywords:',
  choices: ['foo', 'bar', 'baz'],
  indicator() {
    return '';
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
