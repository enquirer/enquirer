'use strict';

const colors = require('ansi-colors');
const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Pick a flavor',
  choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange'],
  pointer(state, choice, i) {
    return state.index === i ? colors.green('→') : ' ';
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
