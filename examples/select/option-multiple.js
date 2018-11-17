'use strict';

const { Select } = require('enquirer');

/**
 * Shows how to enable multiple choices with the `multiple` option
 */

const prompt = new Select({
  name: 'color',
  message: 'Pick a flavor',
  multiple: true,
  choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
