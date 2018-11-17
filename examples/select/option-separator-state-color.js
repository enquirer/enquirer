'use strict';

const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Pick a flavor',
  choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange'],
  hint: 'Use arrow-keys, <return> to submit',
  separator(state) {
    return this.style(this.symbols.bullet);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
