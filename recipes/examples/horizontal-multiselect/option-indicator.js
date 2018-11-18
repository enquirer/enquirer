'use strict';

const { hMultiSelect } = require('enquirer');

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
