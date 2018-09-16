'use strict';

const Store = require('data-store');
const Prompt = require('../..');
const { AutoComplete } = Prompt.prompts;
const store = new Store('recordings', { path: __dirname + '/recordings.json' });

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

let interval = 750;
let steps = [];

prompt.on('keypress', (ch, key) => steps.push({ keypress: [ch, key], interval }));
prompt.on('submit', () => store.set(prompt.name, steps));

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
