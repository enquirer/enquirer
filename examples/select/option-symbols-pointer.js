'use strict';

const { red } = require('ansi-colors');
const { Select } = require('enquirer');

const rhythm = [red.dim, red, red.dim, red, red.dim, red.dim];
const frame = (arr, i) => arr[i % arr.length];
let i = 0;

const prompt = new Select({
  name: 'color',
  message: 'Pick a color',
  symbols: {
    pointer: {
      on: () => frame(rhythm, i)('❤'),
      off: ' '
    }
  },
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

prompt.once('close', () => clearTimeout(prompt.state.timeout));
prompt.on('run', () => {
  (function heartbeat(ms) {
    prompt.state.timeout = setTimeout(() => {
      i++;
      prompt.render();
      heartbeat(ms);
    }, ms);
  })(250);
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
