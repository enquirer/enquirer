'use strict';

const Prompt = require('../prompt');
const { isPrimitive } = require('../utils');

class BooleanPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.state.input = this.cast(this.initial);
    this.cursorHide();
  }

  dispatch(ch) {
    if (!this.isValue(ch)) return this.alert();
    this.state.input = ch;
    return this.submit();
  }

  format(value = this.value) {
    let { styles, state } = this;
    return !state.submitted ? styles.primary(value) : styles.success(value);
  }

  cast(value) {
    return this.isTrue(value);
  }

  isTrue(value) {
    return /^[ty1]/i.test(value);
  }

  isFalse(value) {
    return /^[fn0]/i.test(value);
  }

  isValue(value) {
    return isPrimitive(value) && (this.isTrue(value) || this.isFalse(value));
  }

  async render() {
    let { input, size } = this.state;

    let prefix = await this.prefix();
    let separator = await this.separator();
    let message = await this.message();

    let promptLine = this.state.prompt = [prefix, message, separator].join(' ');

    let header = await this.header();
    let value = this.value = this.cast(input);
    let output = await this.format(value);
    let help = await this.error() || await this.hint();
    let footer = await this.footer();

    if (output || !help) promptLine += ' ' + output;
    if (help && !promptLine.includes(help)) promptLine += ' ' + help;

    this.clear(size);
    this.write([header, promptLine, footer].filter(Boolean).join('\n'));
    this.restore();
  }
}

module.exports = BooleanPrompt;
