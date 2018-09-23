'use strict';

class State {
  constructor(prompt) {
    let options = prompt.options;

    this.prefix = options.prefix || prompt.symbols.questionSmall;
    this.cursor = prompt.cursor || 0;
    this.index = prompt.index || 0;
    this.typed = '';

    this.separator = options.separator || prompt.symbols.ellipsis;
    this.message = options.message;
    this.hint = options.hint || '';
    this.footer = options.footer || '';

    this.header = options.header || '';
    this.initial = prompt.initial;
    this.terminal = '';
  }
}

module.exports = State;
