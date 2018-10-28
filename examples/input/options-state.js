'use strict';

const yosay = require('yosay');
const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/input');

const prompt = new Prompt({
  message: 'What is your username?',
  header: yosay('Welcome to my awesome generator!'),
  footer: 'This is a footer\nwith a\nfew\nlines',
  initial: 'jonschlinkert'
});

prompt.footer = () => {
  let state = { ...prompt.state };
  delete state.prompt;
  delete state.styles;
  delete state.keypress;
  delete state.symbols;
  delete state.header;
  delete state.footer;
  delete state.buffer;
  return '\n' + prompt.options.footer + '\n' + JSON.stringify(state, null, 2);
};

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log)
