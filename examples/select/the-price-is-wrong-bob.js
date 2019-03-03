'use strict';

const { Select } = require('enquirer');
const colors = require('ansi-colors');
const timeout = (fn, ms = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => fn().then(resolve).catch(reject), ms);
  });
};

const prompt = new Select({
  name: 'color',
  message() {
    let i = prompt.state.i;
    let suffix = i > 30 ? ' now' : '';
    if (i > 55) suffix = ' or now';
    if (i > 80) suffix = ' okay now';
    if (i > 250) suffix = '';
    return 'Pick a color' + suffix;
  },
  index: 2,
  choices: ['red', 'white', 'green', 'cyan', 'yellow', 'blue'].map(n => ({
    name: n,
    message: colors[n](n)
  }))
});

prompt.once('run', async() => {
  let max = 300;
  let n = 1;
  let i = 0;
  while (i < max && !prompt.state.submitted) {
    let e = i < (max * 0.3) ? 1 : i < (max * 0.5) ? 1.3 : (i * 0.7) ? 1.15 : 1;
    n *= e;
    prompt.state.i = i;
    await timeout(() => prompt.shiftDown(), i += n);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
