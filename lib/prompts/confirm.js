'use strict';

const BooleanPrompt = require('../types/boolean');

class ConfirmPrompt extends BooleanPrompt {
  constructor(options = {}) {
    super(options);
    this.state.hint = this.value ? '(Y/n)' : '(y/N)';
  }

  render(help) {
    let state = this.state.clone();
    this.state.hint = '';
    this.state.input = (!this.answered ? this.styles.muted(state.hint) + ' ' : '') + state.input;
    super.render();
    this.state = state;
  }
}

module.exports = ConfirmPrompt;

