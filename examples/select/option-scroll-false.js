'use strict';

const yosay = require('yosay');
const colors = require('ansi-colors');
const { Select } = require('enquirer');

/**
 * This prompt shows how to disable scrolling.
 */

const prompt = new Select({
  name: 'color',
  message: 'Pick a color',
  scroll: false,
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
