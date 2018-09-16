'use strict';

const BooleanPrompt = require('../types/boolean');

/**
 * Confirm prompt.
 * @param {Object} `options`
 * @param {String} `options.message` Message
 * @param {Boolean} [options.initial=true/false]
 */

class ConfirmPrompt extends BooleanPrompt {
  constructor(options = {}) {
    super(options);
    this.hint = this.value ? '(Y/n)' : '(y/N)';
  }

  render(help) {
    this.clear();
    let hint = this.colors.hint(this.hint);
    let typed = !this.hasRendered ? (this.initial || '') : (this.value ? 'yes' : 'no');
    let value = this.answered ? this.colors.answered(typed) : `${hint} ${typed}`;
    this.write(this.renderMessage(value, this.error));
  }

  static get ConfirmPrompt() {
    return ConfirmPrompt;
  }
}

module.exports = ConfirmPrompt;

