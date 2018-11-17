'use strict';

const { Input } = require('enquirer');
const prompt = new Input({
  message: 'What is your username?',
  multiline: true
});

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log);
