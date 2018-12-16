'use strict';

const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'food',
  message: 'What are your favorite foods?',
  symbols: { indicator: '$' },
  choices: [
    { name: 'lasagna', message: 'Lasagna' },
    { name: 'pizza', message: 'Pizza' },
    { name: 'chicken_curry', message: 'Chicken Curry' },
    { name: 'tacos', message: 'Tacos' }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
