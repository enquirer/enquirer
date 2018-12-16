'use strict';

const { Toggle } = require('enquirer');

const prompt = new Toggle({
  message: 'Want to answer?',
  enabled: 'Yep',
  disabled: 'Nope'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
