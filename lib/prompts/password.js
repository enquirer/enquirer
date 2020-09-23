import StringPrompt from '../types/string.js';

class PasswordPrompt extends StringPrompt {
  constructor(options) {
    super(options);
    this.cursorShow();
  }

  format(input = this.input) {
    if (!this.keypressed) return '';
    let color = this.state.submitted ? this.styles.primary : this.styles.muted;
    return color(this.symbols.asterisk.repeat(input.length));
  }
}

export default PasswordPrompt;
