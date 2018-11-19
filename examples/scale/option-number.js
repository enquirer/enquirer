'use strict';

const { Scale } = require('enquirer');
const prompt = new Scale({
  name: 'experience',
  message: 'Please rate your experience',
  number(n) {
    let choice = prompt.focused;
    let i = +n - 1;
    if (i >= prompt.scale.length) return prompt.alert();
    choice.scaleIndex = i;
    return prompt.render();
  },
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
      message: 'The website has a friendly interface.',
      initial: 2
    },
    {
      name: 'navigation',
      message: 'The website is easy to navigate.',
      initial: 2
    },
    {
      name: 'images',
      message: 'The website usually has good images.',
      initial: 2
    },
    {
      name: 'upload',
      message: 'The website makes it easy to upload images.',
      initial: 2
    },
    {
      name: 'colors',
      message: 'The website has a pleasing color palette.',
      initial: 2
    }
  ]
});

prompt.run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
