'use strict';

const colors = require('ansi-colors');
const { hMultiSelect } = require('enquirer');

const prompt = new hMultiSelect({
  message: 'Keywords:',
  sep: colors.red(' ~ '),
  choices: ['foo', 'bar', 'baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
