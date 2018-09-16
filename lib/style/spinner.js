'use strict';

const readline = require('readline');
const ansi = require('./ansi');
const identity = val => val;

module.exports = (msg = '', options = {}) => {
  let output = options.output || process.stdout;
  let frames = options.frames || ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let interval = options.interval || 80;
  let timeout = options.timeout || null;
  let format = options.format || identity;
  let frame = options.frame || identity;
  let cleared = false;
  let index = -1;
  let count = index;

  let clearLine = hide => {
    if (hide) output.write(ansi.cursor.hide);
    if (options.clearFn) {
      options.clearFn();
    } else {
      readline.clearLine(output);
      readline.cursorTo(output, 0);
    }
  };

  clearLine(true);
  let spinner = setInterval(() => {
    count = count < frames.length ? count + 1 : 0;
    clearLine();
    output.write(frame(frames[++index % frames.length], count, frames));
    output.write(' ' + format(msg, 'spinning', index));
  }, interval);

  let clear = (doneMsg = msg) => {
    if (cleared) return;
    cleared = true;
    clearLine();
    clearInterval(spinner);
    output.write(format(doneMsg, 'finished') + '\n');
    output.write(ansi.cursor.show);
  };

  if (timeout && isFinite(timeout)) {
    setTimeout(clear, timeout);
  }
  return clear;
};
