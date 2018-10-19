'use strict';

const { define, width } = require('./utils');

class State {
  constructor(prompt) {
    let options = prompt.options;
    define(this, '_prompt', prompt);
    this.message = '';
    this.header = '';
    this.footer = '';
    this.error = '';
    this.hint = '';
    this.input = '';
    this.cursor = 0;
    this.index = 0;
    this.lines = 0;
    this.prompt = '';
    this.buffer = '';
    this.width = width(options.stdout || process.stdout);
    Object.assign(this, options);
    this.message = prompt.styles.strong(this.message);
    this.symbols = prompt.symbols;
    this.styles = prompt.styles;
  }

  set color(val) {
    this._color = val;
  }
  get color() {
    if (this.cancelled) return this.styles.cancelled;
    if (this.submitted) return this.styles.submitted;
    let color = this._color || this.styles[this.status];
    return typeof color === 'function' ? color : this.styles.pending;
  }

  set status(val) {
    this._status = val;
  }
  get status() {
    if (this.cancelled) return 'cancelled';
    if (this.submitted) return 'submitted';
    if (typeof this._status === 'string') {
      return this._status;
    }
    return 'pending';
  }
}

module.exports = State;
