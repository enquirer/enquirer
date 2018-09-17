'use strict';

const Prompt = require('../prompt');

class StringPrompt extends Prompt {
  dispatch(ch, key) {
    if (!ch) return this.alert();
    this.placeholder ? this.append(ch) : this.insert(ch);
    this.moveCursor(1);
    this.render();
  }

  reset() {
    if (!this.state.typed) return this.alert();
    this.state.typed = '';
    this.state.cursor = 0;
    return this.render();
  }

  splice(ch = '', n = 0) {
    let { cursor, typed } = this.state;
    this.state.typed = `${typed.slice(0, cursor + n)}${ch}${typed.slice(cursor)}`;
  }

  // append(ch) {
  //   this.typed += ch;
  // }

  insert(ch) {
    this.splice(ch);
  }

  // remove() {
  //   this.splice('', -1);
  // }

  append(ch, key) {
    if (!ch || key.code || key.ctrl) return this.alert();
    let { cursor, typed } = this.state;
    this.typed += ch;
    // this.state.typed = `${typed.slice(0, cursor)}${ch}${typed.slice(cursor)}`;
    this.right();
  }

  delete() {
    if (!this.state.typed) return this.alert();
    let { cursor, typed } = this.state;
    // this.state.typed = `${typed.slice(0, cursor - 1)}${typed.slice(cursor)}`;
    this.splice('', -1);
    this.left();
  }

  moveCursor(n) {
    this.state.cursor += n;
  }

  right() {
    this.moveCursor(1);
    this.render();
  }
  left() {
    this.moveCursor(-1);
    this.render();
  }

  submit() {
    this.state.value = this.state.typed || this.initial;
    return super.submit();
  }
}

module.exports = StringPrompt;
