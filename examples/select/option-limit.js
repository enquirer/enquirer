'use strict';

const { Select } = require('enquirer');

const prompt = new Select({
  name: 'alphabet',
  message: 'Favorite color?',
  choices: ['Blue', 'Green', 'Orange', 'Red', 'Violet'],
  limit: 3
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
