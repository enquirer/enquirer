'use strict';

const colors = require('ansi-colors');
const keypress = require('../lib/keypress');
const symbol = require('../lib/symbols');
const utils = require('../lib/utils');
const ansi = require('../lib/ansi');

const state = {
  message: colors.bold('What is your username?'),
  prefix: colors.cyan(symbol.question),
  separator: colors.dim(symbol.pointerSmall),
  cursor: 0,
  input: '',
  buffer: '',
  prompt: '',
  width: utils.width(process.stdout)
};

const alert = () => process.stdout.write('\u0007');

const write = str => {
  if (!str) return;
  process.stdout.write(str);
  state.buffer += str;
};

const clear = n => {
  if (n > 0) process.stdout.write(ansi.cursor.down(n));
  process.stdout.write(ansi.clear(state.buffer));
  state.buffer = '';
};

const render = () => {
  let header = !state.submitted ? (state.header || '') : '';
  let prompt = [state.prefix, state.message, state.separator];
  let footer = !state.submitted ? (state.footer || '') : '';

  state.prompt = prompt.join(' ');
  let lines = [header, prompt.join(' ') + ' ' + state.input, footer];

  clear();
  write(lines.filter(Boolean).join('\n'));
};

render();

const stop = keypress.listen(process.stdin, (ch, key) => {
  let { action } = keypress.action(ch, key);

  switch (action) {
    case 'cancel':
    case 'return':
    case 'submit':
      let value = state.input;
      state.input = colors.cyan(value);
      state.submitted = true;
      render();
      stop();
      console.log();
      console.log('USERNAME:', value);
      return;
    case 'delete':
    case 'backspace':
      if (state.cursor <= 0) return alert();
      state.input = state.input.slice(0, state.input.length - 1);
      state.cursor--;
      break;
    default: {
      if (key.shift && !/[\w\-!"#$%&\'()\*+,./:;<=>?@[\]^_`{|}~]/.test(ch)) return alert()
      if (key.ctrl) return alert();
      state.input += ch;
      state.cursor++;
      break;
    }
  }

  render();
});
