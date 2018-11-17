'use strict';

const yosay = require('yosay');
const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Pick a color',
  header: yosay('Welcome to my awesome generator!'),
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
