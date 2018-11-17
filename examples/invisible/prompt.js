'use strict';

const { Invisible } = require('enquirer');
const prompt = new Invisible({
  name: 'secret',
  message: 'What is your secret?'
});

prompt.run()
  .then(answer => console.log('Answer:', { secret: answer }))
  .catch(console.error);
