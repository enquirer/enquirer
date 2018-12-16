'use strict';

const colors = require('ansi-colors');
const { Select } = require('enquirer');

const prompt = new Select({
  name: 'separator-example',
  message: 'Pick your favorite color',
  choices: [
    'apple',
    'grape',
    { role: 'separator', value: colors.dim('────') },
    'watermelon',
    'cherry',
    'strawberry',
    { role: 'separator', value: colors.dim('────') },
    'lemon',
    'orange'
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
