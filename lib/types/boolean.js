'use strict';

const Prompt = require('../prompt');
const render = require('../render');
const { isPrimitive, hasColor } = require('../utils');

class BooleanPrompt extends Prompt {
  constructor(options) {
    super(options);
    this.cursorHide();
    this.default = this.options.default || (this.initial ? '(Y/n)' : '(y/N)');
    this.render = render(this);
  }

  async initialize() {
    let initial = await this.resolve(this.initial, this.state);
    this.input = await this.cast(initial);
    await super.initialize();
  }

  dispatch(ch) {
    if (!this.isValue(ch)) return this.alert();
    this.input = ch;
    return this.submit();
  }

  format(value) {
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

  async hint() {
    if (this.status === 'pending') {
      let hint = await this.element('hint');
      return hasColor(hint) ? hint : this.styles.muted(hint);
    }
  }

  isValue(value) {
    return isPrimitive(value) && (this.isTrue(value) || this.isFalse(value));
  }

  set value(value) {
    super.value = value;
  }
  get value() {
    return this.cast(super.value);
  }
}

module.exports = BooleanPrompt;
