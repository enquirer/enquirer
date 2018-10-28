'use strict';

const moment = require('moment');
const Prompt = require('./number');
const isNumber = val => /[0-9]/.test(val);

const digits = [
  { unit: 'day', method: 'day', length: 2, format: 'ddd', offset: 1 },
  { unit: 'day', method: 'date', length: 2, format: 'DD' },
  { unit: 'month', method: 'month', length: 2, format: 'MMM', offset: 1 },
  { unit: 'year', method: 'year', length: 4, format: 'YYYY' },
  { unit: 'hour', method: 'hour', length: 2, format: 'HH', separator: ':' },
  { unit: 'minute', method: 'minute', length: 2, format: 'mm', separator: '' }
];

class DatePrompt extends Prompt {
  constructor(options) {
    super(options);
    this.index = this.options.index || 0;
    this.state.prev = 0;
    this.moment = moment();
    this.cursorHide();
  }

  resetInput() {
    this.state.prev = 0;
    this.input = '';
  }

  reset() {
    this.resetInput();
    this.moment = moment();
    this.render();
  }

  first() {
    if (this.index !== 0) this.resetInput();
    this.index = 0;
    this.render();
  }

  last() {
    if (this.index !== digits.length - 1) this.resetInput();
    this.index = digits.length - 1;
    this.render();
  }

  left() {
    if (this.index === 0) return this.alert();
    this.resetInput();
    this.index--;
    this.render();
  }

  right() {
    if (this.index === digits.length - 1) return this.alert();
    this.resetInput();
    this.index++;
    this.render();
  }

  prev() {
    let len = digits.length;
    this.resetInput();
    this.index = ((this.index - 1 % len) + len) % len;
    this.render();
  }

  next() {
    let len = digits.length;
    this.resetInput();
    this.index = (this.index + 1) % len;
    this.render();
  }

  up() {
    this.resetInput();
    this.moment.add(1, digits[this.index].unit);
    this.render();
  }

  down() {
    this.resetInput();
    this.moment.subtract(1, digits[this.index].unit);
    this.render();
  }

  dispatch(ch) {
    if (!isNumber(ch)) return this.alert();

    this.input += ch;
    let d = digits[this.index];
    let v = parseInt(this.input, 10) - (d.offset || 0);
    let typedLength = String(Math.abs(parseInt(this.input, 10))).length;

    if (typedLength >= d.length) {
      this.resetInput();
      this.moment[d.method](v);
      if (this.index < digits.length - 1) {
        this.index++;
      }
    }

    this.render();
  }

  format() {
    let str = '';
    for (let i = 0; i < digits.length; i++) {
      let digit = digits[i];
      let sep = digit.separator || ' ';
      if (!this.state.submitted && i === this.index) {
        str += this.styles.em(this.moment.format(digit.format)) + sep;
      } else if (this.state.submitted) {
        str += this.styles.primary(this.moment.format(digit.format)) + sep;
      } else {
        str += this.moment.format(digit.format) + sep;
      }
    }
    return str;
  }

  async render() {
    let { size } = this.state;

    let prefix = await this.prefix();
    let separator = await this.separator();
    let message = await this.message();
    let prompt = (this.state.prompt = [prefix, message, separator].join(' '));

    let header = await this.header();
    let footer = await this.footer();
    let output = await this.format(this.value);
    let help = (await this.error()) || (await this.hint());

    if (output) prompt += ' ' + output;
    if (help) prompt += ' ' + help;

    this.clear(size);
    this.write([header, prompt, help, footer].filter(Boolean).join('\n'));
    this.restore();
  }

  set index(i) {
    this.state.index = i;
  }
  get index() {
    return Math.max(0, this.state ? this.state.index : 0);
  }
}

module.exports = DatePrompt;
