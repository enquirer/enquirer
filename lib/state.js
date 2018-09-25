'use strict';

class State {
  constructor(prompt) {
    let options = prompt.options;

    this.cursor = prompt.cursor || 0;
    this.index = prompt.index || 0;
    this.typed = '';

    this.prefix = options.prefix || prompt.symbols.questionSmall;
    this.message = options.message;
    this.separator = options.separator || prompt.symbols.pointerSmall;
    this.hint = options.hint || '';
    this.footer = options.footer || '';

    this.header = options.header || '';
    this.initial = prompt.initial;
    this.terminal = '';
    this.rows = [];

    if (options.choices) {
      this.choices = choices(options.choices);
      this.limit = options.limit || this.choices.length;
    }
  }
}

function choices(choices = []) {
  if (!Array.isArray(choices)) {
    throw new Error('expected choices to be an array');
  }

  return choices.map(choice => {
    return typeof choice === 'string' ? { name: choice } : { ...choice };
  });
}

module.exports = State;
