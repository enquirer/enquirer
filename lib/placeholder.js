'use strict';

const colors = require('ansi-colors');
const utils = require('./utils');

/**
 * Render a placeholder value with cursor and styling based on the
 * position of the cursor. This function creates the illusion that
 *
 *
 * @param {Object} `prompt` Prompt instance
 * @param {String} `input`
 * @param {String} `initial`
 * @param {Number} `pos`
 * @param {Boolean} `showCursor`
 * @return {String} Returns the styled placeholder string.
 * @api public
 */

module.exports = (prompt, input = '', initial = '', pos, showCursor = true) => {
  prompt.cursorHide();

  let inverse = utils.inverse(prompt.styles.primary);
  let output = input;

  initial = utils.isPrimitive(initial) ? `${initial}` : '';
  input = utils.isPrimitive(input) ? `${input}` : '';

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
