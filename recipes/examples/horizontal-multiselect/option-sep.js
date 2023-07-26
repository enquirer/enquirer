'use strict';

const colors = require('ansi-colors');
const HorizontalMultiSelect = require('../../HorizontalMultiSelect');

const prompt = new HorizontalMultiSelect({
  message: 'Keywords:',
  sep: colors.red(' ~ '),
  choices: ['foo', 'bar', 'baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
