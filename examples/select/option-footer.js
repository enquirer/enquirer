'use strict';

const colors = require('ansi-colors');
const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Pick a color',
  footer: colors.blue('(Scroll up and down to reveal more choices)'),
  choices: [
    'aqua',
    'black',
    'blue',
    'fuchsia',
    'gray',
    'green',
    'lime',
    'maroon',
    'navy',
    'olive',
    'purple',
    'red',
    'silver',
    'teal',
    'white',
    'yellow'
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
