'use strict';

const colors = require('ansi-colors');
const Prompt = require('../prompt');
const utils = require('../utils');

/**
 * StringPrompt Element
 * @param {Object} options Options
 * @param {String} options.message Message
 * @param {String} [options.style='default'] Render style
 * @param {String} [options.initial] Default value
 */

class StringPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.value = this.typed = '';
    this.cursor = 0;
    this.help = '';
  }

  skip() {
    if (this.options.value !== void 0) {
      this.value = String(this.options.value);
      return true;
    }
  }

  moveCursor(n) {
    this.cursor += n;
  }

  async dispatch(ch, key) {
    if (!ch) return this.alert();
    if (!this.placeholder) {
      let prefix = this.typed.slice(0, this.cursor);
      let suffix = this.typed.slice(this.cursor);
      this.typed = `${prefix}${ch}${suffix}`;
    } else {
      this.typed += ch;
    }
    this.moveCursor(1);
    return this.render();
  }

  delete(render) {
    if (this.placeholder || this.cursor <= 0) return this.alert();
    let prefix = this.typed.slice(0, this.cursor - 1);
    let suffix = this.typed.slice(this.cursor);
    this.typed = `${prefix}${suffix}`;
    this.moveCursor(-1);
    if (render !== false) {
      return this.render();
    }
  }

  reset() {
    if (!this.typed) return this.alert();
    this.typed = '';
    this.cursor = 0;
    return this.render();
  }

  next() {
    if (!this.initial) return this.alert();
    if (this.typed && this.initial.indexOf(this.typed) !== 0) return this.alert();
    this.typed = this.initial;
    this.cursor = this.typed.length;
    return this.render();
  }

  first() {
    this.cursor = 0;
    return this.render();
  }
  last() {
    this.cursor = this.typed.length;
    return this.render();
  }

  left() {
    if (this.cursor <= 0 || this.placeholder) {
      return this.alert();
    }
    this.moveCursor(-1);
    return this.render();
  }
  right() {
    if (this.cursor >= this.typed.length || this.placeholder) {
      return this.alert();
    }
    this.moveCursor(1);
    return this.render();
  }

  async render(help = '') {
    let typed = this.typed || this.initial;
    let value = this.answered
      ? (typed ? this.colors.answered(typed) : '')
      : await this.transform.render(this.placeholder ? this.initial : this.typed);

    this.clear();
    this.cursorShow();
    this.write(this.renderHeader());
    this.write(this.renderMessage(value, this.renderHelp(help)));
    this.write(this.renderFooter());
    this.write(utils.ansi.cursor.move(-colors.unstyle(value).length + this.cursor));
  }

  get raw() {
    return this.typed ? colors.unstyle(this.typed) : '';
  }

  get placeholder() {
    return !!this.initial && !this.typed;
  }

  submit(value = this.value) {
    this.value = utils.isValue(value) ? value : (this.typed || this.options.initial);
    return super.submit(this.value);
  }

  static get StringPrompt() {
    return StringPrompt;
  }
}

module.exports = StringPrompt;
