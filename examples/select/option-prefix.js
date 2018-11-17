'use strict';

const { symbols, green, red, yellow } = require('ansi-colors');
const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Pick a flavor',
  choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange'],
  prefix(state) {
    let style = { pending: red, submitted: green, cancelled: yellow };
    return style[state.status](symbols.heart);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
