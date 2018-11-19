'use strict';

const { MultiSelect } = require('enquirer');
const log = require('../log-keypress');

const prompt = new MultiSelect({
  name: 'items',
  message: 'Choose your items',
  header: () => 'Keypress: ' + log(prompt),
  choices: [
    { name: 'foo', choices: ['a', 'b', { name: 'c', disabled: true }] },
    { name: 'bar', choices: ['d', 'e', 'f'] },
    { name: 'baz', choices: ['g', { name: 'h', disabled: true }, 'i'] },
    {
      name: 'fez',
      choices: [
        { name: 'faz', choices: ['j', 'k', 'l'] },
        { name: 'bip', choices: ['m', { name: 'n', disabled: true }] },
        { name: 'zam', choices: [{ name: 'one', choices: ['o', 'p'] }] }
      ]
    }
  ]
});

prompt
  .run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
