'use strict';

const yosay = require('yosay');
const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/input');

const prompt = new Prompt({
  message: 'What is your username?',
  initial: 'jonschlinkert',
  header: yosay('Welcome to my awesome generator!'),
  hint: '(username)',
  footer: 'This is a footer\nwith a\nfew\nlines'
});

prompt.footer = () => {
  let state = { ...prompt.state };
  state.terminal = '';
  state.header = '';
  state.footer = '';
  return '\n' + prompt.options.footer + '\n' + JSON.stringify(unstyle(state), null, 2);
};

function unstyle(state) {
  for (let key of Object.keys(state)) {
    let val = state[key];
    if (typeof val === 'string') {
      state[key] = colors.unstyle(val);
    }
  }
  return state;
}

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log)
