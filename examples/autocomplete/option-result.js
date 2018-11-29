'use strict';

const { prompt } = require('enquirer');

(async() => {

  const answers = await prompt({
    type: 'autocomplete',
    name: 'flavor',
    message: 'Pick your favorite flavor',
    initial: 3,
    choices: [
      'almond',
      'apple',
      'banana',
      'cherry',
      'chocolate',
      'cinnamon',
      'coconut',
      'cotton candy',
      'grape',
      'nougat',
      'orange',
      'pear',
      'pineapple',
      'strawberry',
      'vanilla',
      'watermelon',
      'wintergreen'
    ],
    result(value) {
      return value.toUpperCase();
    }
  });

  console.log('Answers', answers);

})().catch(console.log);
