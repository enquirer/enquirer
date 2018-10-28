'use strict';

const placeholder = require('../placeholder');
const Prompt = require('../prompt');
const { isPrimitive } = require('../utils');

class StringPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.initial = isPrimitive(this.initial) ? String(this.initial) : '';
    if (this.initial) this.cursorHide();
    this.prevCursor = 0;
  }

  moveCursor(n = 0) {
    this.cursor += n;
  }

  reset() {
    this.input = this.value = '';
    this.cursor = 0;
    this.render();
  }

  dispatch(ch, key) {
    if (key.ctrl && key.name === 'x') return this.toggleCursor();
    if (!ch || key.ctrl || key.code) return this.alert();
    this.append(ch);
  }

  append(ch) {
    let { cursor, input } = this.state;
    this.input = `${input}`.slice(0, cursor) + ch + `${input}`.slice(cursor);
    this.moveCursor(String(ch).length);
    this.render();
  }

  delete() {
    let { cursor, input } = this.state;
    if (cursor <= 0) return this.alert();
    this.input = `${input}`.slice(0, cursor - 1) + `${input}`.slice(cursor);
    this.moveCursor(-1);
    this.render();
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.input.length - 1;
    this.render();
  }

  toggleCursor() {
    if (this.prevCursor) {
      this.cursor = this.prevCursor;
      this.prevCursor = 0;
    } else {
      this.prevCursor = this.cursor;
      this.cursor = 0;
    }
    this.render();
  }

  next() {
    if (!this.initial || !this.initial.startsWith(this.input)) return this.alert();
    this.input = this.initial;
    this.cursor = this.initial.length;
    this.render();
  }

  prev() {
    if (!this.input) return this.alert();
    this.reset();
  }

  right() {
    if (this.cursor >= this.input.length) return this.alert();
    this.moveCursor(1);
    this.render();
  }

  left() {
    if (this.cursor <= 0) return this.alert();
    this.moveCursor(-1);
    this.render();
  }

  isValue(value) {
    return !!value;
  }

  format(input = this.input) {
    if (!this.state.submitted) {
      return placeholder(this, input, this.initial, this.cursor);
    }
    return this.styles.submitted(input || this.initial);
  }

  async render() {
    let size = this.state.size;

    let prefix = await this.prefix();
    let separator = await this.separator();
    let message = await this.message();

    let prompt = [prefix, message, separator].filter(Boolean).join(' ');
    this.state.prompt = prompt;

    let header = await this.header();
    let output = await this.format();
    let help = await this.error() || await this.hint();
    let footer = await this.footer();

    if (output || !help) prompt += ' ' + output;
    if (help && !prompt.includes(help)) prompt += ' ' + help;

    this.clear(size);
    this.write([header, prompt, footer].filter(Boolean).join('\n'));
    this.restore();
  }
}

module.exports = StringPrompt;
