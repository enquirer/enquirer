'use strict';

const { Confirm } = require('enquirer');

const prompt = new Confirm({
  name: 'toast',
  message: 'Do you like toast?'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
