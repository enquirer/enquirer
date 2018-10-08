'use strict';

const Prompt = require('../prompt');
const { first, round } = require('../utils');

class NumberPrompt extends Prompt {
  constructor(options) {
    super({ style: 'number', ...options });
    this.min = this.isValue(this.options.min) ? this.toNumber(this.options.min) : -Infinity;
    this.max = this.isValue(this.options.max) ? this.toNumber(this.options.max) : Infinity;
    this.cursor = 0;
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
    this.cursor = 0;
    this.render();
  }

  dispatch(s) {
    if (s !== '.' || (s === '.' && this.input.includes('.'))) {
      return this.alert('invalid number');
    }
    return this.append(s);
  }

  append(s) {
    let { cursor, input } = this.state;
    this.input = input.slice(0, cursor) + s + input.slice(cursor);
    this.cursor++;
    this.render();
  }

  delete() {
    if (!this.input) return this.alert();
    let { cursor, input } = this.state;
    this.input = input.slice(0, cursor - 1) + input.slice(cursor);
    this.cursor--;
    this.render();
  }

  number(s) {
    return this.append(s);
  }

  up(n) {
    let step = n || this.minor;
    let num = this.toNumber(this.input);
    if (num > this.max + step) return this.alert();
    this.input = `${num + step}`;
    this.render();
  }
  down(n) {
    let step = n || this.minor;
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

  right() {
    if (this.cursor >= this.input.length) return this.alert();
    this.cursor++;
    this.render();
  }
  left() {
    if (this.cursor <= 0) return this.alert();
    this.cursor--;
    this.render();
  }

  next() {
    this.input = this.initial;
    this.render();
  }
  async prev() {
    await this.reset();
    await this.render();
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
      this.styles.answered(this.format(input)),
      this.error() || this.hint()
    ];

    this.write(this.header());
    this.write(prompt.filter(Boolean).join(' '));
    this.write(this.footer());
    this.write(this.resetCursor());
  }

  submit() {
    if (this.input) this.value = this.input;
    if (this.value === '') this.value = this.initial;
    if (this.float === false) this.value = Math.round(this.value);
    if (!this.isValue(this.value)) return this.alert();
    return super.submit();
  }
}

module.exports = NumberPrompt;
