'use strict';

const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Pick a flavor',
  choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange'],
  margin: [2, 0, 2, 2]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
