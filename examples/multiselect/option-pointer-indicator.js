'use strict';

const colors = require('ansi-colors');
const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'food',
  message: 'What are your favorite foods?',
  choices: [
    { name: 'lasagna', message: 'Lasagna' },
    { name: 'pizza', message: 'Pizza' },
    { name: 'chicken_curry', message: 'Chicken Curry' },
    { name: 'tacos', message: 'Tacos' }
  ],
  pointer(state, choice) {
    if (choice.index === state.index) {
      return colors.cyan(colors.symbols.pointer);
    }
    return ' ';
  },
  indicator(state, choice) {
    if (choice.enabled) {
      return colors.cyan(state.symbols.radio.on);
    }
    return colors.gray(state.symbols.radio.off);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
