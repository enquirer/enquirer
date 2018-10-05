'use strict';

const colors = require('ansi-colors');
const utils = require('../utils');

module.exports = (prompt, input = '', initial = '', pos, showCursor = true) => {
  let inverse = utils.inverse(prompt.styles.primary);
  let output = input;

  let placeholder = initial && initial.startsWith(input) && initial !== input;
  let cursor = placeholder ? inverse(colors.black(initial[input.length])) : inverse(' ');
  let len = input.length;

  if (pos !== input.length && showCursor === true) {
    output = input.slice(0, pos) + inverse(colors.black(input[pos])) + input.slice(pos + 1);
    cursor = '';
  }

  if (showCursor === false) {
    cursor = '';
    len--;
  }

  if (placeholder) {
    return output + cursor + prompt.styles.placeholder(initial.slice(len + 1));
  }

  return output + cursor;
};
