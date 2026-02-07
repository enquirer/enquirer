'use strict';

const StringPrompt = require('../types/string');

class PasswordPrompt extends StringPrompt {
  constructor(options) {
    super(options);
    this.cursorShow();
  }

  format(input = this.input) {
    // Show initial value (masked) before any keypress, but only during active prompt
    if (!this.keypressed && !this.state.submitted && this.initial) {
      let color = this.styles.muted;
      return color(this.symbols.asterisk.repeat(this.initial.length));
    }
    if (!this.keypressed) return '';
    let color = this.state.submitted ? this.styles.primary : this.styles.muted;
    return color(this.symbols.asterisk.repeat(input.length));
  }
}

module.exports = PasswordPrompt;
