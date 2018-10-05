'use strict';

const Prompt = require('../prompt');
const { first, round } = require('../utils');

class NumberPrompt extends Prompt {
  constructor(options) {
    super({ style: 'number', ...options });
    this.min = this.isValue(this.options.min) ? this.toNumber(this.options.min) : -Infinity;
    this.max = this.isValue(this.options.max) ? this.toNumber(this.options.max) : Infinity;
    this.zero = this.options.cursor || 0;
    this.cursor = this.zero;
    this.float = this.options.float !== false;
    this.round = this.options.round === true || this.options.float === false;
    this.major = this.options.major || 10;
    this.minor = this.options.minor || 1;
    this.initial = first([this.initial, '']);
    this.input = this.initial;
    this.cursorHide();
  }

  reset() {
    this.input = '';
    this.cursor = this.zero;
    return this.render();
  }

  dispatch(s) {
    if (s !== '.' || (s === '.' && this.input.includes('.'))) {
      return this.alert('invalid number');
    }
    this.input += s;
    this.cursor++;
    return this.render();
  }

  number(s) {
    this.input += s;
    this.cursor++;
    return this.render();
  }

  delete() {
    if (this.cursor <= this.zero) return this.alert();
    this.input = `${this.input.slice(0, -1)}`;
    this.cursor--;
    return this.render();
  }

  up(n) {
    let step = n || this.minor;
    let num = this.toNumber(this.input);
    if (num > this.max + step) return this.alert();
    this.input = `${num + step}`;
    return this.render();
  }
  down(n) {
    let step = n || this.minor;
    let num = this.toNumber(this.input);
    if (num < this.min - step) return this.alert();
    this.input = `${num - step}`;
    return this.render();
  }

  left() {
    this.down(this.major);
  }
  right() {
    this.up(this.major);
  }

  next() {
    this.input = this.initial;
    return this.render();
  }
  async prev() {
    await this.reset();
    return this.render();
  }

  test(s) {
    return (/[-+.]/.test(s) && this.input === '') || /[0-9.]/.test(s);
  }

  cast(value) {
    let input = String(value);
    if (this.options.format) return input;
    if (this.answered) {
      input = Math.min(Math.max(input, this.min), this.max);
      return this.round ? Math.round(input) : input;
    }
    let num = Number(input);
    num = Math.min(Math.max(num, this.min), this.max);
    if (this.round) {
      return `${round(num, this.round)}`;
    }
    return input;
  }

  toNumber(value = '') {
    return Number(value);
  }
  isValue(value) {
    return /^[-+]?[0-9]*(\.[0-9]+)?$/.test(value);
  }

  render() {
    this.clear();

    let input = this.cast(this.input);
    let prompt = [
      this.element('prefix'),
      this.element('message'),
      this.element('separator'),
      this.format(input),
      this.error() || this.hint()
    ];

    this.write(this.header());
    this.write(prompt.filter(Boolean).join(' '));
    this.write(this.footer());
    this.write(this.resetCursor());
  }

  submit() {
    if (this.value === '') this.value = this.initial;
    if (this.float === false) this.value = Math.round(this.value);
    if (!this.isValue(this.value)) return this.alert();
    return super.submit();
  }
}

module.exports = NumberPrompt;
