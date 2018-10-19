'use strict';

const colors = require('ansi-colors');
const yosay = require('yosay');
const Prompt = require('../../lib/prompts/input');
const prompt = new Prompt({
  message: 'What is your username?',
  header: yosay('Welcome to my awesome generator!'),
  footer: colors.yellow('This is a footer\nwith a\nfew\nextra\nlines'),
  initial: 'jonschlinkert'
});

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log)
