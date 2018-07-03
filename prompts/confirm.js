'use strict';

const colors = require('ansi-colors');
const BooleanPrompt = require('prompt-base/lib/types/boolean');

/**
 * Confirm prompt.
 * @param {Object} options
 * @param {String} options.message Message
 * @param {Boolean} [options.initial] Default value (true/false)
 */

class Confirm extends BooleanPrompt {
  constructor(options = {}) {
    super(options);
    this.hint = this.value ? 'Y/n' : 'y/N';
  }

  render(first) {
    this.clear();
    const hint = colors.dim(this.hint);
    const typed = first ? '' : (this.value ? 'yes' : 'no');
    const value = this.answered ? colors.cyan(typed) : `${hint} ${typed}`;
    const message = this.renderMessage(value);
    this.write(message);
  }

  static get Confirm() {
    return Confirm;
  }
}

module.exports = Confirm;

