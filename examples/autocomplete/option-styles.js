'use strict';

const colors = require('ansi-colors');
const { prompt } = require('enquirer');

(async() => {

  const answers = await prompt({
    type: 'autocomplete',
    name: 'flavor',
    message: 'Pick your favorite flavor',
    styles: { primary: colors.blue },
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
    ]
  });

  console.log(answers);

})().catch(console.log);
