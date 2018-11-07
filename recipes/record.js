'use strict';

const Store = require('data-store');
const AutoComplete = require('../lib/prompts/autocomplete');
const store = new Store({ path: __dirname + '/recordings.json' });

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

let prev = Date.now();
let steps = [];

prompt.on('submit', () => store.set(prompt.name, steps));
prompt.on('keypress', (ch, key) => {
  let now = Date.now();
  steps.push({ keypress: [ch, key], interval: now - prev });
  prev = now;
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
