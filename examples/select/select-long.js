'use strict';

const yosay = require('yosay');
const colors = require('ansi-colors');
const { Select } = require('enquirer');

/**
 * This prompt shows how you can easily customize the footer
 * to render a different value based on conditions.
 */

let keys = Object.keys(colors.styles);
let idx = 0;

const prompt = new Select({
  name: 'color',
  message: 'Pick a color',
  header: yosay('Welcome to my awesome generator!'),
  footer() {
    let fn = colors[keys[++idx % keys.length]];
    return '\n' + fn('(Scroll up and down to reveal more choices)');
  },
  limit: 5,
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
