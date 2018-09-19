'use strict';

const colors = require('ansi-colors');
const symbols = require('../lib/style/symbols');

class State {
  constructor(options = {}) {
    this.submitted = false;
    this.cancelled = false;
    this.answered = false;

    this.missing = new Set();
    this.invalid = new Set();
    this.errors = [];

    this.terminal = '';
    this.cursor = 0;
    this.searchIndex = 0;
    this.index = 0;

    this.header = options.header || '';
    this.prefix = options.prefix || colors.cyan(symbols.questionSmall);
    this.message = colors.bold(options.message || options.name || options.value);
    this.separator = options.separator || colors.dim(symbols.ellipsis);
    this.typed = '';
    this.hint = options.hint || '';
    this.body = options.body || '';
    this.footer = options.footer || '';

    this.value = options.value || options.initial;
  }

  set status(value) {
    throw new Error('prompt.status is a getter and may not be defined');
  }
  get status() {
    if (this.cancelled) return 'cancelled';
    if (this.answered) return 'answered';
    return 'pending';
  }
}

module.exports = State;
