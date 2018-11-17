'use strict';

const { hSelect } = require('enquirer');
const prompt = new hSelect({
  message: 'Keywords:',
  choices: ['foo', 'bar', 'baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
