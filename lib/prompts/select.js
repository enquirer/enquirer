'use strict';

const ArrayPrompt = require('../types/array');
const utils = require('../utils');
const hint = '(Use arrow keys, <return> to submit)';
const footer = '(Move up and down to reveal more choices)';

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

class SelectPrompt extends ArrayPrompt {
  constructor(options = {}) {
    super(options);
    this.hint = utils.first(this.options.hint, this.colors.hint(hint));
    this.footer = utils.first(this.options.footer, this.colors.hint(footer));
    this.maxSelected = 1;
  }

  renderChoice(choice, i) {
    let enabled = choice.enabled = this.cursor === i;
    let pointer = this.symbols.pointer.off;
    let message = choice.message;

    if (choice.disabled) {
      message = this.colors.hint(message);

    } else if (enabled) {
      pointer = this.colors.active(this.symbols.pointer.on);
      message = this.colors.active(choice.message);
    }

    if (choice.hint) {
      message += ' ' + this.colors.hint(choice.hint);
    }
    return pointer + ' ' + message;
  }

  render(help) {
    this.clear();
    let selected = this.selected ? this.selected.value : '';
    let value = (this.answered && selected) ? this.colors.answered(selected) : '';
    this.write(this.renderHeader());
    this.write(this.renderMessage(value, this.renderHelp(help)));
    this.write(this.renderChoices());
    this.write(this.renderFooter());
  }

  async submit(value) {
    if (!this.selected) return this.alert();
    this.value = utils.isValue(value) ? value : this.selected.value;
    return super.submit(this.value);
  }

  get selected() {
    return this.list && this.list[this.cursor];
  }

  static get SelectPrompt() {
    return SelectPrompt;
  }
}

module.exports = SelectPrompt;
