'use strict';

const Store = require('data-store');
const AutoComplete = require('../lib/prompts/autocomplete');
const store = new Store({ path: __dirname + '/recordings.json' });

const prompt = new AutoComplete({
  name: 'flavor',
  message: 'Pick your favorite flavor',
  suggest(typed, choices) {
    return choices.filter(item => item.message.includes(typed));
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

let interval = 750;
let steps = [];

prompt.on('keypress', (ch, key) => steps.push({ keypress: [ch, key], interval }));
prompt.on('submit', () => store.set(prompt.name, steps));

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
