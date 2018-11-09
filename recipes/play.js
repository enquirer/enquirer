'use strict';

const Store = require('data-store');
const colors = require('ansi-colors');
const ansi = require('../lib/ansi');
const AutoComplete = require('../lib/prompts/autocomplete');
const store = new Store({ path: __dirname + '/recordings.json' });

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

prompt.once('run', async() => {
  for (let step of store.get(prompt.name)) {
    await timeout(() => prompt.keypress(...step.keypress), step.interval);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
