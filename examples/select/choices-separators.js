'use strict';

const colors = require('ansi-colors');
const { Select } = require('enquirer');
const separator = () => ({ value: colors.dim('────'), role: 'separator' });

const prompt = new Select({
  name: 'separator-example',
  message: 'Pick your favorite color',
  choices: [
    'apple',
    'grape',
    separator(),
    'watermelon',
    'cherry',
    'strawberry',
    separator(),
    'lemon',
    'orange'
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer === 'insult' ? 'You stink!' : answer))
  .catch(console.error);
