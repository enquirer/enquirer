'use strict';

const { Input } = require('enquirer');
const prompt = new Input({
  message: 'What is your username?'
});

prompt.run()
  .then(answer => console.log('Username:', answer))
  .catch(console.log);
