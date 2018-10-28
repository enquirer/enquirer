'use strict';

const Store = require('data-store');
const colors = require('ansi-colors');
const ansi = require('../lib/ansi');
const AutoComplete = require('../lib/prompts/autocomplete');
const { timeout } = require('../lib/utils');
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

prompt.state.header = 'KEYPRESS: ';
prompt.on('keypress', (ch, key) => {
  prompt.state.header = 'KEYPRESS: ' + colors.yellow(`<${key.name}>`);
});

prompt.once('run', async() => {
  for (let step of store.get(prompt.name)) {
    await timeout(() => prompt.keypress(...step.keypress), step.interval);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
