'use strict';

class State {
  constructor(prompt) {
    let options = prompt.options;
    this.cursor = prompt.cursor || 0;
    this.index = prompt.index || 0;
    this.value = options.value;
    this.input = options.input || this.value || '';

    this.prefix = options.prefix || prompt.symbols.questionSmall;
    this.message = options.message;
    this.separator = options.separator || prompt.symbols.pointerSmall;
    this.hint = options.hint;
    this.footer = options.footer;
    this.error = null;

    this.header = options.header;
    this.initial = prompt.initial;
  }

  clone(state = {}) {
    let res = { ...this, ...state };
    res.__proto__ = this;
    return res;
  }
}

module.exports = State;
