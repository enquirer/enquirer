'use strict';

const { Scale } = require('enquirer');
const prompt = new Scale({
  name: 'experience',
  message: 'Please rate your experience',
  linebreak: true,
  scale: [
    { name: '1', message: 'Strongly Disagree' },
    { name: '2', message: 'Disagree' },
    { name: '3', message: 'Neutral' },
    { name: '4', message: 'Agree' },
    { name: '5', message: 'Strongly Agree' }
  ],
  choices: [
    {
      name: 'interface',
      message: 'A. The website has a friendly interface.',
      initial: 2
    },
    {
      name: 'navigation',
      message: 'B. The website is easy to navigate.',
      initial: 2
    },
    {
      name: 'images',
      message: 'C. The website usually has good images.',
      initial: 2
    },
    {
      name: 'upload',
      message: 'D. The website makes it easy to upload images.',
      initial: 2
    },
    {
      name: 'colors',
      message: 'E. The website has a pleasing color palette.',
      initial: 2
    }
  ]
});

prompt.run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
