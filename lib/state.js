'use strict';

const colors = require('ansi-colors');
const symbols = require('./style/symbols');
const styles = require('./style/styles');
const utils = require('./utils');

class State {
  constructor(options) {
    Object.assign(this, options);
    this.submitted = false;
    this.cancelled = false;
    this.answered = false;

    this.missing = new Set();
    this.invalid = new Set();
    this.errors = [];

    this.terminal = '';
    this.searchIndex = 0;
    this.cursor = 0;
    this.index = 0;

    this.name = options.name || options.message || options.title || options.value;
    this.value = options.value || '';

    this.header = options.header || '';
    this.prefix = options.prefix || '';
    this.message = options.message || options.title || options.name || options.value;
    this.separator = options.separator || '';

    this.typed = '';
    this.hint = options.hint || '';
    this.footer = options.footer || '';

    if (!utils.isStyled(this.message)) {
      this.message = colors.bold(this.message);
    }
  }

  /**
   * Get or set the limit of the visible choices to show at one time in the
   * in the prompt.
   * @set {Number}
   * @get {Number}
   * @api public
   */

  set limit(value) {
    this._limit = value;
  }
  get limit() {
    return this._limit || this.choices ? this.choices.length : 0;
  }
}

module.exports = State;
