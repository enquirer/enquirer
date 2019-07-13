const { prompt } = require('enquirer');
const questions = require('./questions');

prompt(questions)
  .then(answers => console.log(answers))
  .catch(console.log);
