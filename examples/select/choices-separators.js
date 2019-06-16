'use strict';

const { Select } = require('enquirer');

const prompt = new Select({
  name: 'separator-example',
  message: 'Pick your favorite color',
  choices: [
    'apple',
    'grape',
    { role: 'separator' },
    'watermelon',
    'cherry',
    'strawberry',
    { role: 'separator' },
    'lemon',
    'orange'
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
