'use strict';

const colors = require('ansi-colors');
const ArrayPrompt = require('prompt-base/lib/types/array');
const { first } = ArrayPrompt.utils;

/**
 * Select prompt.
 * @param {Object} options Options
 * @param {String} options.message Prompt message
 * @param {Array} options.choices Array of choice objects
 * @param {String} [options.hint] Hint to display
 * @param {Number} [options.initial] Index of default value
 * @param {Number} [options.limit] Number of choices lines that should render.
 * @api public
 */

class Select extends ArrayPrompt {
  constructor(options = {}) {
    super(options);
    this.style.set('pointers', { off: ' ', on: this.style.pointers.default });

    this.hint = first(options.hint, colors.dim('(Use arrow keys, press <return> to submit)'));
    this.footer = first(options.footer, colors.dim('(Move up and down to reveal more choices)'));
    this.cursor = this.findIndex(first(options.value, options.initial, 0));
    this.maxSelected = 1;
  }

  reset() {
    this.moveCursor(this.initial);
  }

  pointer(choice, i) {
    return this.cursor === i ? colors.cyan(this.symbols.pointer) + ' ' : '  ';
  }

  // Return the header to be rendered before the prompt, if defined on options
  renderHeader() {
    return this.options.header ? this.options.header + '\n' : '';
  }

  // Return the footer to be rendered after the prompt, if defined on options
  renderFooter() {
    if (!this.answered && this.list.length < this.choices.length) {
      return this.footer ? '\n' + this.footer : '';
    }
    return '';
  }

  renderChoice(choice, i) {
    choice.enabled = this.cursor === i;
    const message = this.style.message(choice, choice.enabled);
    const pointer = this.style.pointer(choice);
    const hint = this.style.hint(choice.hint);
    return pointer + message + hint;
  }

  // renderChoice(choice, i) {
  //   if (choice.disabled) return `  ${colors.gray(choice.message)}`;
  //   let message = this.cursor === i ? colors.cyan(choice.message) : choice.message;
  //   let pointer = this.pointer(choice, i);
  //   let hint = choice.hint ? (' ' + choice.hint) : '';
  //   return (choice.group ? '  ' : '') + `${pointer}${message}` + hint;
  // }

  renderChoices() {
    if (this.answered) return '';
    return '\n' + this.list.map(this.renderChoice.bind(this)).join('\n');
  }

  render(first) {
    this.clear();
    // ~ Render header
    this.write(this.renderHeader());

    // ? Render prompt message
    const selected = this.selected;
    const value = this.answered && selected ? colors.cyan(selected.value) : this.hint;
    this.write(this.renderMessage(value));

    // > Render choices
    this.write(this.renderChoices());

    // ~ render footer
    this.write(this.renderFooter());
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
