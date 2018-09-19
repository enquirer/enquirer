'use strict';

const colors = require('ansi-colors');
const ansi = require('../style/ansi');
const Prompt = require('../prompt');
const utils = require('../utils');

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

  render(help = '') {
    let { answered, initial, placeholder, state } = this;
    let { typed = initial, cursor } = state;
    let value = answered ? colors.cyan(typed) : placeholder ? initial : typed;
    this.clear();
    this.write(ansi.cursor.show);
    this.write(this.renderHeader());
    this.write(this.renderMessage(value, this.renderHelp(help)));
    this.write(this.renderFooter());
    this.write(ansi.cursor.move(-colors.unstyle(value).length + cursor));
  }

  submit(value = this.options.value) {
    if (!utils.isValue(value)) {
      value = utils.utils.first(this.state.typed, this.initial);
    }
    return super.submit(String(value));
  }

  get raw() {
    return colors.unstyle(this.state.typed || '');
  }

  get placeholder() {
    return !!this.initial && !this.state.typed;
  }
}

module.exports = StringPrompt;
