'use strict';

const { Select } = require('enquirer');
const colors = require('ansi-colors');

const prompt = new Select({
  name: 'color',
  message: 'Pick a flavor',
  multiple: true,
  choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange'],
  choiceMessage(choice, i) {
    return choice.enabled ? colors.bold.green(choice.message) : choice.message;
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);