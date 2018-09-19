'use strict';

const colors = require('ansi-colors');
const symbols = require('./style/symbols');
const utils = require('./utils');

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

    this.name = options.name || options.message || options.title || options.value;
    this.initial = utils.first([options.initial, options.default, options.value]);
    this.value = utils.first([options.value, this.initial, options.name]);

    this.header = options.header || '';
    this.prefix = options.prefix || colors.cyan(symbols.questionSmall);
    this.message = options.message || options.title || options.name || options.value;
    this.separator = options.separator || colors.dim(symbols.ellipsis);
    this.typed = '';
    this.hint = options.hint || '';
    this.footer = options.footer || '';

    if (!utils.isStyled(this.message)) {
      this.message = colors.bold(this.message);
    }
  }

  set limit(value) {
    this._limit = value;
  }
  get limit() {
    return this._limit || this.choices ? this.choices.length : 0;
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
