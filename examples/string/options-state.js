'use strict';

const yosay = require('yosay');
const colors = require('ansi-colors');
const Prompt = require('../../lib/types/string');

const unstyle = state => {
  for (let key of Object.keys(state)) {
    let val = state[key];
    if (typeof val === 'string') {
      state[key] = colors.unstyle(val);
    }
  }
  return state;
};

const prompt = new Prompt({
  message: 'What is your username?',
  initial: 'jonschlinkert',
  header: yosay('Welcome to my awesome generator!'),
  hint: '(username)',
  footer: 'This is a footer\nwith two lines\nwith two lines\nwith two lines',
  styles: {
    placeholder: colors.dim.blue,
    answered: colors.blueBright.bold
  },
  elements: {
    footer() {
      let state = { ...prompt.state };
      delete state.terminal;
      delete state.header;
      delete state.footer;
      delete state.rows;
      return JSON.stringify(unstyle(state), null, 2);
    }
  }
});


prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log)
