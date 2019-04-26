'use strict';
/* This example is similar to `prompt.js`, the only difference is that it filters out the empty string added in the result */
const { List } = require('enquirer');
const prompt = new List({
  name: 'keywords',
  message: 'Type comma-separated keywords',
  result(answers) {
    const lastArrElement = answers[answers.length - 1];
    if (lastArrElement === '') {
      return answers.slice(0, answers.length - 1);
    }
    return answers;
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
