'use strict';

const Prompt = require('../..');
const { AutoComplete } = Prompt.prompts;
const { timeout } = Prompt.utils;

const prompt = new AutoComplete({
  name: 'flavor',
  message: 'Pick your favorite flavor',
  initial: 3,
  limit: 7,
  suggest(typed) {
    return this.choices.filter(item => item.message.includes(typed));
  },
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
  { keypress: ['a'], timeout: 750 },
  { keypress: ['b'], timeout: 750 },
  { keypress: ['b'], timeout: 750 },
  { keypress: [null, { name: 'backspace' }], timeout: 750 },
  { keypress: [null, { name: 'backspace' }], timeout: 750 },
  { keypress: [null, { name: 'backspace' }], timeout: 750 },
  { keypress: ['c'], timeout: 750 },
  { keypress: ['h'], timeout: 750 },
  { keypress: ['o'], timeout: 750 },
  { keypress: [null, { name: 'enter' }], timeout: 400 }
];

prompt.once('run', async() => {
  for (const step of steps) {
    await timeout(() => prompt.keypress(...step.keypress), step.timeout);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
