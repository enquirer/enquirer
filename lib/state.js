'use strict';

const { define, width } = require('./utils');

class State {
  constructor(prompt) {
    let options = prompt.options;
    define(this, '_prompt', prompt);
    this.message = options.message || '';
    this.header = options.header || '';
    this.footer = options.footer || '';
    this.error = options.error || '';
    this.hint = options.hint || '';
    this.cursor = options.cursor || 0;
    this.input = '';
    this.index = 0;
    this.lines = 0;
    this.prompt = '';
    this.buffer = '';
    this.tick = 0;
    this.width = width(options.stdout || process.stdout);
    Object.assign(this, options);
    this.message = prompt.styles.strong(this.message);
    this.symbols = prompt.symbols;
    this.styles = prompt.styles;
    this.timer = { tick: 0, frames: [] };
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

  get status() {
    if (this.cancelled) return 'cancelled';
    if (this.submitted) return 'submitted';
    return 'pending';
  }
}

module.exports = State;
