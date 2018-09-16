'use strict';

const Store = require('data-store');
const { yellow } = require('ansi-colors');
const Prompt = require('../..');
const ansi = require('../../lib/style/ansi');
const { AutoComplete } = Prompt.prompts;
const { timeout } = Prompt.utils;
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

prompt.on('keypress', (ch, key) => {
  this.hint = yellow(`<${key.name}>`);
});

prompt.once('run', async() => {
  for (const step of store.get(prompt.name)) {
    await timeout(() => prompt.keypress(...step.keypress), step.interval);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
