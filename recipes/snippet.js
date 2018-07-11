'use strict';

const colors = require('ansi-colors');
const Prompt = require('prompt-base');
const { ansi } = Prompt.utils;
const first = (...args) => args.find(v => v != null && v !== '');

class Snippet extends Prompt {
  constructor(options = {}) {
    super(options);
    this.typed = '';
    this.cursor = this.typed.length;
    this.values = this.options.initial || {};
    this.original = Object.assign({}, this.values);

    if (typeof this.options.template === 'function') {
      this.options.template = this.options.template();
    }

    let str = this.tmpl = (this.options.template || '').toString();
    this.typed = '';
    this.index = 0;

    this.matches = [];
    this.items = [];
    this.keys = [];
    let match;

    while ((match = /{{([^}]+)}}/.exec(str))) {
      this.items.push(match[0]);
      if (!this.matches.includes(match[0])) this.matches.push(match[0]);
      if (!this.keys.includes(match[1])) this.keys.push(match[1]);
      str = str.slice(match.index + match[0].length);
    }
  }

  dispatch(ch, key) {
    if (this.cursor > 0) {
      const prefix = this.typed.slice(0, this.cursor);
      const suffix = this.typed.slice(this.cursor);
      this.typed = `${prefix}${ch}${suffix}`;
    } else {
      this.typed += ch;
    }

    this.moveCursor(1);
    if (this.placeholder) {
      this.cursor = 0;
    }
    this.updateValues();
    this.render();
  }

  updateValues() {
    if (this._key && this.typed) {
      this.values[this._key] = this.typed;
    }
  }

  delete() {
    this.typed = this.typed.slice(0, this.typed.length - 1);
    this.values[this._key] = first(this.typed, this.original[this._key]);
    this.updateValues();
    this.render();
  }

  reset() {
    this.cursor = 0;
    this.typed = '';
    this.values = {};
    this.tmpl = this.options.template;
    this.render();
  }

  moveCursor(n) {
    if (!this.placeholder) {
      this.cursor += n;
    }
  }

  up() {
    this.prev();
  }
  down() {
    this.next();
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.typed.length;
    this.render();
  }

  left() {
    if (this.cursor <= 0 || this.placeholder) return this.alert();
    this.moveCursor(-1);
    this.render();
  }

  right() {
    if (this.cursor * this.width >= this.typed.length || this.placeholder) {
      return this.alert();
    }
    this.moveCursor(1);
    this.render();
  }

  next() {
    this.updateValues();
    this.typed = '';
    this.index++;
    if (this.index > this.items.length - 1) {
      this.index = 0;
    }
    this.render();
  }

  prev() {
    this.updateValues();
    this.typed = '';
    this.index--;
    if (this.index < 0) {
      this.index = this.items.length - 1;
    }
    this.render();
  }

  submit(...args) {
    const tmpl = this.options.template;
    this.value = this.values;
    this.value.result = tmpl.replace(/{{([^}]+)}}/g, (m, $1, i) => {
      return this.values[$1] || m;
    });
    return super.submit(...args);
  }

  template() {
    let index = 0;
    this.tmpl = this.options.template.replace(/{{([^}]+)}}/g, (m, $1, i) => {
      if (this.answered) {
        return this.values[$1] ? colors.green(this.values[$1]) : colors.cyan(m);
      }

      this.cursor = i;
      let num = index;
      index++;

      if (!this.typed && !this.values[$1]) {
        this.values[$1] = '';
      }

      let val = first(this.typed, this.values[$1], m);
      if (num === this.index) {
        this._key = $1;
        return colors.underline(val);
      }

      if (this.values[$1]) {
        return colors.green(this.values[$1]);
      }
      return colors.cyan(m);
    });
    return this.tmpl;
  }

  renderMessage(input = '') {
    const prefix = this.style.prefix();
    const msg = this.options.message;
    const sep = this.style.separator();
    const prompt = [prefix, msg, sep, input, this.help].filter(Boolean);
    return prompt.join(' ');
  }

  render() {
    this.clear();
    this.write(this.renderMessage(this.typed + '\n' + this.template()));
    this.write(ansi.cursor.move(-(colors.unstyle(this.typed).length) + this.cursor * this.width));
  }
}

module.exports = Snippet;
