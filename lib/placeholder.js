'use strict';

const colors = require('ansi-colors');
const utils = require('./utils');

module.exports = (prompt, input = '', initial = '', pos, showCursor = true) => {
  let inverse = utils.inverse(prompt.styles.primary);
  let output = input;

  initial = utils.isPrimitive(initial) ? String(initial) : '';
  input = utils.isPrimitive(input) ? String(input) : '';

  if (!initial) {
    return input;
  }

  let placeholder = initial && initial.startsWith(input) && initial !== input;
  let cursor = placeholder ? inverse(colors.black(initial[input.length])) : inverse(' ');

  if (pos !== input.length && showCursor === true) {
    output = input.slice(0, pos) + inverse(colors.black(input[pos])) + input.slice(pos + 1);
    cursor = '';
  }

  if (showCursor === false) {
    cursor = '';
  }

  if (placeholder) {
    let raw = colors.unstyle(output + cursor);
    return output + cursor + prompt.styles.placeholder(initial.slice(raw.length));
  }

  return output + cursor;
};
