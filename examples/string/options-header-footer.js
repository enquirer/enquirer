'use strict';

const yosay = require('yosay');
const Prompt = require('../../lib/types/string');
const prompt = new Prompt({
  message: 'What is your username?',
  header: yosay('Welcome to my awesome generator!'),
  footer: 'This is a footer\nwith a\nfew\nextra\nlines',
  initial: ''
});

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log)
