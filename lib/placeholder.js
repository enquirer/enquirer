'use strict';

const colors = require('ansi-colors');
const utils = require('./utils');

/**
 * Render a placeholder value with cursor and styling based on the
 * position of the cursor.
 *
 * @param {Object} `prompt` Prompt instance.
 * @param {String} `input` Input string.
 * @param {String} `initial` The initial user-provided value.
 * @param {Number} `pos` Current cursor position.
 * @param {Boolean} `showCursor` Render a simulated cursor using the inverse primary style.
 * @return {String} Returns the styled placeholder string.
 * @api public
 */

module.exports = (prompt, input = '', initial = '', pos, showCursor = true, color) => {
  prompt.cursorHide();

  let style = color || prompt.styles.placeholder;
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
    return output + cursor + style(initial.slice(raw.length));
  }

  return output + cursor;
};
