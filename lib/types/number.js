'use strict';

const StringPrompt = require('./string');

class NumberPrompt extends StringPrompt {
  constructor(options = {}) {
    super({ style: 'number', ...options });
    this.min = this.isValue(options.min) ? this.toNumber(options.min) : -Infinity;
    this.max = this.isValue(options.max) ? this.toNumber(options.max) : Infinity;
    this.delay = options.delay != null ? options.delay : 1000;
    this.float = options.float !== false;
    this.round = options.round === true || options.float === false;
    this.major = options.major || 10;
    this.minor = options.minor || 1;
    this.initial = options.initial != null ? options.initial : '';
    this.value = this.input = String(this.initial);
    this.cursorShow();
  }

  dispatch(ch) {
    if (!/[-+.]/.test(ch) || (ch === '.' && this.input.includes('.'))) {
      return this.alert('invalid number');
    }
    return this.append(ch);
  }

  number(ch) {
    this.append(ch);
  }

  delete() {
    super.delete();
    if (this.input === '' && this.initial != null) {
      this.input = String(this.initial);
      this.render();
    }
  }

  next() {
    if (!this.initial) return this.alert();
    this.input = this.initial;
    this.cursor = String(this.initial).length;
    this.render();
  }

  up(number) {
    let step = number || this.minor;
    let num = this.toNumber(this.input);
    if (num > this.max + step) return this.alert();
    this.input = `${num + step}`;
    this.render();
  }

  down(number) {
    let step = number || this.minor;
    let num = this.toNumber(this.input);
    if (num < this.min - step) return this.alert();
    this.input = `${num - step}`;
    this.render();
  }

  shiftDown() {
    this.down(this.major);
  }

  shiftUp() {
    this.up(this.major);
  }

  format(value = this.input) {
    return this.styles.em(super.format(value));
  }

  toNumber(value = '') {
    return this.float ? +value : Math.round(+value);
  }

  isValue(value) {
    return /^[-+]?[0-9]+(\.[0-9]+)?$/.test(value);
  }

  submit() {
    if (this.isValue(this.input)) this.value = this.input;
    if (!this.isValue(this.value)) this.value = this.initial;
    this.value = this.toNumber(this.value || 0);
    return super.submit();
  }
}

module.exports = NumberPrompt;
