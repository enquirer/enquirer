'use strict';

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

module.exports = (prompt, options = {}) => {
  prompt.cursorHide();

  let { input = '', initial = '', pos, showCursor = true, color } = options;
  let { blink, styles, shift } = prompt;

  let style = color || styles.placeholder;
  let inverse = utils.inverse(styles.primary);
  let highlight = str => inverse(styles.black(str));
  let output = input;
  let char = ' ';
  let reverse = highlight(char);

  if (blink && blink.off === true) {
    highlight = str => str;
    reverse = '';
  }

  if (showCursor && pos === 0 && initial === '' && input === '') {
    return highlight(char);
  }

  if (showCursor && pos === 0 && (input === initial || input === '')) {
    return highlight(initial[0]) + style(initial.slice(1));
  }

  initial = utils.isPrimitive(initial) ? `${initial}` : '';
  input = utils.isPrimitive(input) ? `${input}` : '';

  let placeholder = initial && initial.startsWith(input) && initial !== input;
  let cursor = placeholder ? highlight(initial[input.length]) : reverse;

  if (pos !== input.length && showCursor === true) {
    output = input.slice(0, pos) + highlight(input[pos]) + input.slice(pos + 1);
    cursor = '';
  }

  if (showCursor === false) {
    cursor = '';
  }

  if (placeholder) {
    let raw = styles.unstyle(output + cursor);
    return output + cursor + style(initial.slice(raw.length));
  }

  // handle text that was captured with "shiftLeft" / "shiftEnd"
  if (shift && shift.end > 0) {
    let raw = styles.unstyle(output + cursor);
    let before = raw.slice(0, shift.start);
    let after = raw.slice(shift.end);
    let middle = raw.slice(shift.start, shift.end);
    return before + highlight(middle) + after;
  }

  return output + cursor;
};
