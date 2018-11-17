'use strict';

const yosay = require('yosay');
const colors = require('ansi-colors');
const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Pick a color',
  header: yosay('Welcome to my awesome generator!'),
  footer: colors.dim('(Scroll up and down to reveal more choices)'),
  limit: 5,
  choices: [
    'aqua',
    'black',
    'blue',
    'fuchsia',
    'gray',
    'green'
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
