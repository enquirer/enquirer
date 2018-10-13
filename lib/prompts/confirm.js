'use strict';

const BooleanPrompt = require('../types/boolean');

class ConfirmPrompt extends BooleanPrompt {
  constructor(options = {}) {
    super(options);
    this.state.set('hint', this.initial ? '(Y/n)' : '(y/N)');
  }

  format() {
    let hint = !this.answered ? this.element('hint') + ' ' : '';
    return hint + this.styles.info(this.input);
  }
}

module.exports = ConfirmPrompt;

