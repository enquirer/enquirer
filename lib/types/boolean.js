'use strict';

const Prompt = require('../prompt');

class BooleanPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.input = this.cast(this.initial);
    this.cursorHide();
  }

  dispatch(ch) {
    this.input = this.cast(ch);
    this.render();
  }

  cast(s) {
    return /^[ty1]/i.test(s);
  }

  isValue(value) {
    return value != null;
  }

  format() {
    return !this.answered ? this.styles.info(this.value) : this.value;
  }

  render() {
    this.clear();

    let prompt = [
      this.element('prefix'),
      this.element('message'),
      this.element('separator'),
      this.format(this.value),
      this.error() || (this.value == null ? this.hint() : void 0)
    ];

    this.write(this.header());
    this.write(prompt.filter(v => v != null).join(' '));
    this.write(this.footer());
    this.write(this.resetCursor());
  }
}

module.exports = BooleanPrompt;
