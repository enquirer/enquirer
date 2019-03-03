'use strict';

const { Rating } = require('enquirer');
const colors = require('ansi-colors');
const prompt = new Rating({
  name: 'experience',
  message: 'Please rate your experience',
  margin: [1, 1, 1, 1],
  styles: { primary: colors.yellow },
  choices: [
    { name: 'shipping', message: '1. Shipping', initial: 3 },
    { name: 'price', message: '2. Price', initial: 3 },
    { name: 'quality', message: '3. Quality', initial: 3 },
    { name: 'communication', message: '4. Communication', initial: 3 },
    { name: 'experience', message: '5. Overall Experience', initial: 3 }
  ]
});

prompt.run()
  .then(value => console.log(value))
  .catch(console.error);
