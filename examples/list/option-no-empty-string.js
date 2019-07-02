'use strict';
/* This example filters out all the empty string added in the result */
const { List } = require('enquirer');
const prompt = new List({
  name: 'keywords',
  message: 'Type comma-separated keywords',
  result(answers) {
    return answers.filter(Boolean);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
