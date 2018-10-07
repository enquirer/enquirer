'use strict';

const Prompt = require('../prompt');
const { first } = require('../utils');

class StringPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.initial = String(first([this.options.initial, '']));
    this.cursorHide();
    this.prev = 0;
  }

  moveCursor(n = 0) {
    this.cursor += n;
  }

  dispatch(s, key) {
    if (key.ctrl && key.name === 'x') return this.toggleCursor();

    if (!s || key.ctrl || key.code) return this.alert();
    this.append(s);
  }

  append(s) {
    let { cursor, input } = this.state;
    this.input = input.slice(0, cursor) + s + input.slice(cursor);
    this.moveCursor(1);
    this.render();
  }

  delete() {
    if (!this.input) return this.alert();
    let { cursor, input } = this.state;
    this.input = input.slice(0, cursor - 1) + input.slice(cursor);
    this.moveCursor(-1);
    this.render();
  }

  reset() {
    this.input = this.value = '';
    this.cursor = 0;
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
    if (this.prev) {
      this.cursor = this.prev;
      this.prev = 0;
    } else {
      this.prev = this.cursor;
      this.cursor = 0;
    }
    this.render();
  }

  next() {
    let { initial, input } = this.state;
    if (!initial || !initial.startsWith(input)) return this.alert();
    this.input = initial;
    this.cursor = initial.length;
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

  render() {
    this.clear();

    let prompt = [
      this.element('prefix'),
      this.element('message'),
      this.element('separator'),
      this.format(this.value),
      this.error() || this.hint()
    ];

    this.write(this.header());
    this.write(prompt.filter(Boolean).join(' '));
    this.write(this.footer());
    this.write(this.resetCursor());
  }
}

module.exports = StringPrompt;
