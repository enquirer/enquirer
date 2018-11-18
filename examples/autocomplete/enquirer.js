'use strict';

const { prompt } = require('enquirer');

prompt({
  type: 'autocomplete',
  name: 'flavor',
  message: 'Pick your favorite flavor',
  limit: 10,
  choices: [
    'Almond',
    'Apple',
    'Banana',
    'Blackberry',
    'Blueberry',
    'Cherry',
    'Chocolate',
    'Cinnamon',
    'Coconut',
    'Cranberry',
    'Grape',
    'Nougat',
    'Orange',
    'Pear',
    'Pineapple',
    'Raspberry',
    'Strawberry',
    'Vanilla',
    'Watermelon',
    'Wintergreen'
  ]
})
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
