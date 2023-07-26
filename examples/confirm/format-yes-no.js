'use strict';

const { Confirm } = require('enquirer');

const prompt = new Confirm({
  name: 'toast',
  message: 'Do you like toast?',
  initial: true,
  format() {
    return /^[ty1]/i.test(prompt.input) ? 'yes' : 'no';
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
