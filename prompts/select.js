'use strict';

const colors = require('ansi-colors');
const ArrayPrompt = require('prompt-base/lib/types/array');
const { first } = ArrayPrompt.utils;

/**
 * Select prompt.
 * @param {Object} options Options
 * @param {String} options.message Prompt message
 * @param {Array}  options.choices Array of choice objects
 * @param {String} [options.hint] Hint to display
 * @param {Number} [options.initial] Index of default value
 * @param {Number} [options.limit] Number of choices lines that should render.
 * @api public
 */

class Select extends ArrayPrompt {
  constructor(options = {}) {
    super(options);
    this.hint = first(options.hint, colors.dim('(Use arrow keys, press <return> to submit)'));
    this.footer = first(options.footer, colors.dim('(Move up and down to reveal more choices)'));
    this.cursor = this.findIndex(first(options.value, options.initial, 0));
    this.maxSelected = 1;
  }

  reset() {
    this.moveCursor(this.initial);
  }

  render(first) {
    this.clear();
    const selected = this.selected;
    const value = this.answered && selected ? colors.cyan(selected.value) : this.hint;
    const prompt = this.renderHeader()
      + this.renderMessage(value)
      + this.renderChoices()
      + this.renderFooter();
    this.write(prompt);
  }

  submit() {
    if (!this.selected) return this.alert();
    this.value = this.selected.value;
    return super.submit();
  }

  get selected() {
    return this.list[this.cursor];
  }

  static get Select() {
    return Select;
  }
}

module.exports = Select;
