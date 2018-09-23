'use strict';

const readline = require('readline');
const colors = require('ansi-colors');
const Prompt = require('../prompt');
const utils = require('../utils');
const ansi = require('../style/ansi');

class StringPrompt extends Prompt {
  constructor(options) {
    super(options);
  }

  dispatch(s, event) {
    if (!s || event.ctrl || event.code) return this.alert();
    let { cursor, typed } = this.state;
    let prefix = typed.slice(0, cursor);
    let suffix = typed.slice(cursor);
    this.state.typed = prefix + s + suffix;
    this.state.cursor++;
    this.render();
  }

  delete() {
    if (!this.state.typed) return this.alert();
    let { cursor, typed } = this.state;
    let prefix = typed.slice(0, cursor - 1);
    let suffix = typed.slice(cursor);
    this.state.typed = prefix + suffix;
    this.state.cursor--;
    this.render();
  }

  reset() {
    this.state.typed = '';
    this.state.cursor = 0;
    this.render();
  }

  next() {
    let { initial, typed } = this.state;
    if (!initial || !initial.startsWith(typed)) return this.alert();
    this.state.typed = initial;
    this.state.cursor = initial.length;
    this.render();
  }
  prev() {
    if (!this.state.typed) return this.alert();
    this.reset();
  }

  left() {
    if (this.state.cursor <= 0) return this.alert();
    this.state.cursor--;
    this.render();
  }

  right() {
    if (this.state.cursor >= this.state.typed.length) return this.alert();
    this.state.cursor++;
    this.render();
  }

  renderHeader() {
    return this.state.header ? this.state.header + '\n' : '';
  }

  renderPrompt() {
    let { prefix, message, separator } = this.state;
    let prompt = [colors.cyan(prefix), colors.bold(message), colors.dim(separator)];
    return prompt.filter(v => v != null).join(' ');
  }

  renderInput() {
    if (!this.answered && this.initial) {
      let fg = this.styles.highlight;
      let bg = this.styles.placeholder;
      let pos = this.state.cursor;
      return utils.unmask(this.state.typed, this.initial, bg, fg, pos);
    }
    return this.answered ? this.styles.answered(this.value) : this.state.typed;
  }

  renderHint() {
    return this.state.hint ? colors.dim(this.state.hint) : '';
  }

  renderBody() {
    let hint = !this.answered && this.renderHint();
    let footer = !this.answered && this.renderFooter();
    let body = this.state.body;
    this.body = [hint, body, footer].filter(Boolean).join('\n');
    return this.body;
  }

  renderFooter() {
    return this.state.footer ? '\n' + this.state.footer : '';
  }

  render() {
    let { header } = this.state;
    let prompt = this.renderPrompt();
    let input = this.renderInput();
    let body = this.renderBody();
    this.write([header, prompt, input, body].filter(Boolean).join(' '));
  }

  submit() {
    return super.submit(this.value);
  }
}

module.exports = StringPrompt;
