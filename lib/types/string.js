'use strict';

const colors = require('ansi-colors');
const ansi = require('../style/ansi');
const Prompt = require('../prompt');
const utils = require('../utils');
const { first, toString } = utils;

class StringPrompt extends Prompt {
  reset() {
    if (!this.state.typed) return this.alert();
    this.state.typed = '';
    this.state.cursor = 0;
    this.render();
  }

  moveCursor(n) {
    this.state.cursor += n;
  }

  dispatch(ch, key) {
    if (!ch || key.code || key.ctrl) return this.alert();
    this.typed ? this.insert(ch, key) : this.append(ch, key);
    this.render();
  }

  splice(ch = '', n = 0) {
    let { cursor, typed } = this.state;
    this.state.typed = `${typed.slice(0, cursor + n)}${ch}${typed.slice(cursor)}`;
  }

  append(ch) {
    this.state.typed += ch;
    this.right();
  }

  insert(ch) {
    this.splice(ch);
  }

  delete() {
    if (!this.state.typed) return this.alert();
    this.splice('', -1);
    this.left();
  }

  next() {
    let typed = this.state.typed;
    if (!this.initial || !this.initial.startsWith(typed)) return this.alert();
    this.state.typed = this.initial;
    this.state.cursor = this.initial.length;
    this.render();
  }

  right() {
    if (this.state.cursor >= this.state.typed.length || this.placeholder) {
      return this.alert();
    }
    this.moveCursor(1);
    this.render();
  }
  left() {
    if (this.state.cursor <= 0 || this.placeholder) {
      return this.alert();
    }
    this.moveCursor(-1);
    this.render();
  }

  first() {
    this.state.cursor = 0;
    this.render();
  }
  last() {
    this.state.cursor = this.state.typed.length;
    this.render();
  }

  async render(help = '') {
    let { state, value = '' } = this;
    this.clear();
    this.write(ansi.cursor.show);
    this.write([state.prefix, state.message, state.separator, value]);
    this.write(ansi.cursor.move(-colors.unstyle(value).length + state.cursor));
  }

  submit(value) {
    return super.submit(first([value, this.raw]));
  }

  set value(value = '') {
    this.state.value = value;
  }
  get value() {
    let value = first([this.state.value, this.state.typed, this.state.initial]);
    if (this.answered) {
      return colors.cyan(value);
    }
    if (this.placeholder) {
      value = first([this.state.value, this.state.initial]);
    }
    return value !== void 0 ? value : '';
  }

  get raw() {
    return colors.unstyle(this.value);
  }

  get placeholder() {
    return this.initial === void 0 && !this.state.typed;
  }
}

module.exports = StringPrompt;
