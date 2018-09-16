'use strict';

const lower = (str = '') => str.toLowerCase();
const SelectPrompt = require('./select');
const utils = require('../utils');

/**
 * AutoComplete prompt.
 * @param {Object} options Options
 * @param {String} options.message Message
 * @param {Array} options.choices Array of auto-complete choices objects
 * @param {Function} [options.suggest] Filter function. Filters by choice.message.
 * @param {Number} [options.limit=10] Max number of results to show
 * @param {Number} [options.cursor=0] Cursor start position
 * @param {String} [options.style='default'] Render style
 */

class AutoComplete extends SelectPrompt {
  constructor(options = {}) {
    super(options);
    this.render = this.render.bind(this);
    this.complete = this.complete.bind(this);
    this.suggest = (this.options.suggest || this.suggest).bind(this);
    this.hint = utils.first(this.options.hint, '(Start typing to filter choices)');
    this.typed = '';
    this.index = 0;
    this.pointer = () => '';
  }

  moveCursor(i) {
    this.cursor = i;
    this.value = this.find(i, 'value');
  }

  dispatch(ch) {
    if (!ch) return this.alert();
    if (!this.placeholder && this.scale) {
      let before = this.typed.slice(0, this.index);
      let after = this.typed.slice(this.index);
      this.typed = `${before}${ch}${after}`;
      this.index += this.scale;
    } else {
      this.typed += ch;
      this.index = this.typed.length;
    }
    return this.complete(this.render);
  }

  reset() {
    this.typed = '';
    return this.complete(() => {
      this.moveCursor(this.initial);
      this.render();
    });
  }

  delete() {
    if (this.placeholder) return this.alert();
    if (this.index <= 0) return this.alert();
    let before = this.typed.slice(0, this.index - this.scale);
    let after = this.typed.slice(this.index);
    this.typed = `${before}${after}`;
    this.index -= this.scale;
    return this.complete(this.render);
  }

  left() {
    if (this.index <= 0 || this.placeholder) {
      return this.alert();
    }
    this.index--;
    this.render();
  }

  right() {
    if (this.index * this.scale >= this.typed.length || this.placeholder) {
      return this.alert();
    }
    this.index++;
    this.render();
  }

  async complete(callback) {
    this.render();
    this.choices = await this.toChoices(await this.update(this.typed));
    let promise = this.completing = this.suggest(this.typed, this.choices);
    let choices = await promise;

    this.list = await this.toList(choices);
    this.completing = false;

    this.moveCursor(Math.min(Math.max(this.list.length - 1, 0), this.cursor));
    if (callback) {
      return callback();
    }
  }

  suggest(typed, choices = this.choices) {
    return choices.filter(choice => lower(choice.message).indexOf(lower(typed)) === 0);
  }

  renderFooter() {
    return this.list.length === 0 ? this.colors.danger('\nNo matches found') : '';
  }

  render(help) {
    let hint = this.renderHelp(help);
    let value = this.typed || (hint ? this.colors.hint(hint) : '');
    if (this.answered) value = '';
    super.render(value + this.renderFooter());
  }

  get placeholder() {
    return !!this.initial && !this.typed;
  }

  static get AutoComplete() {
    return AutoComplete;
  }
}

module.exports = AutoComplete;
