'use strict';

const HorizontalMultiSelect = require('../../HorizontalMultiSelect');

const prompt = new HorizontalMultiSelect({
  message: 'Keywords:',
  choices: ['foo', 'bar', 'baz'],
  indicator() {
    return '';
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
