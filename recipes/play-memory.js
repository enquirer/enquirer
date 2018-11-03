'use strict';

const colors = require('ansi-colors');
const AutoComplete = require('../lib/prompts/autocomplete');

const timeout = (fn, ms = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => fn().then(resolve).catch(reject), ms);
  });
};

const prompt = new AutoComplete({
  name: 'flavor',
  message: 'Pick your favorite flavor',
  choices: [
    'almond',
    'apple',
    'banana',
    'cherry',
    'chocolate',
    'cinnamon',
    'coconut',
    'cotton candy',
    'grape',
    'nougat',
    'orange',
    'pear',
    'pineapple',
    'strawberry',
    'vanilla',
    'watermelon',
    'wintergreen'
  ]
});

const steps = [
  { keypress: ['a'], ms: 750 },
  { keypress: ['b'], ms: 750 },
  { keypress: ['b'], ms: 750 },
  { keypress: [null, { name: 'backspace' }], ms: 750 },
  { keypress: [null, { name: 'backspace' }], ms: 750 },
  { keypress: [null, { name: 'backspace' }], ms: 750 },
  { keypress: ['c'], ms: 750 },
  { keypress: ['h'], ms: 750 },
  { keypress: ['o'], ms: 750 },
  { keypress: [null, { name: 'enter' }], ms: 400 }
];

prompt.once('run', async() => {
  for (const step of steps) {
    await timeout(() => prompt.keypress(...step.keypress), step.ms);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
