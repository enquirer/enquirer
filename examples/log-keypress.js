'use strict';

const colors = require('ansi-colors');
let timeout;

const press = str => colors.red('<') + str + colors.red('>');

module.exports = prompt => {
  if (!prompt.state.buffer) return '';
  let key = prompt.state.keypress;
  let keypress = '';
  clearTimeout(timeout);

  if (key) {
    if (key.shift) keypress = press('shift') + colors.bold('+');
    if (key.ctrl) keypress = press('ctrl') + colors.bold('+');
    if (key.name === 'number') {
      keypress = press(key.name + ' ' + key.raw);
    } else {
      keypress = press(key.name || key.raw);
    }
  }

  timeout = setTimeout(async() => {
    prompt.state.keypress = '';
    await prompt.render();
  }, 500);

  prompt.on('close', () => clearTimeout(timeout));
  return !prompt.state.submitted ? keypress : '';
};
