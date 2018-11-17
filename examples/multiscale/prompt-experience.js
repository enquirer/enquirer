'use strict';

const { MultiScale } = require('enquirer');
const prompt = new MultiScale({
  name: 'experience',
  message: 'How would you rate your experience?',
  hint: '(0=bad, 10=awesome)',
  scale: 11,
  edgeLength: 2,
  choices: [
    {
      name: 'none',
      message: 'The website has a friendly interface.',
      initial: 5
    },
    {
      name: 'navigation',
      message: 'The website is easy to navigate.',
      initial: 5
    },
    {
      name: 'images',
      message: 'The website usually has good images.',
      initial: 5
    },
    {
      name: 'upload',
      message: 'The website makes it easy to upload images.',
      initial: 5
    },
    {
      name: 'colors',
      message: 'The website has a pleasing color palette.',
      initial: 5
    }
  ]
});

prompt.run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
