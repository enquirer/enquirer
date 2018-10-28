'use strict';

const colors = require('ansi-colors');

const placeholder = (str, colorA, colorB, start = 0) => {
  let i = start;
  return () => {
    if (i > str.length) i = start;
    return colorA(str.slice(0, i)) + colorB(str.slice(i++));
  };
};

const render = placeholder('This is an example sentence', colors.cyan, colors.dim);

let int = setInterval(() => {
  process.stdout.write('\r' + render());
}, 100);

process.stdin.on('data', data => {
  if (data.toString() === '\r' || data.toString() === '\n') {
    clearTimeout(int);
    process.exit();
  }
});
