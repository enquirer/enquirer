'use strict';

const colors = require('ansi-colors');
const Prompt = require('./select');
const { ansi } = Prompt.utils;
const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);

/**
 * AutoComplete prompt.
 * @param {Object} options Options
 * @param {String} options.message Message
 * @param {Array} options.choices Array of auto-complete choices objects
 * @param {Function} [options.suggest] Filter function. Defaults to sort by title
 * @param {Number} [options.limit=10] Max number of results to show
 * @param {Number} [options.cursor=0] Cursor start position
 * @param {String} [options.style='default'] Render style
 * @param {String} [options.fallback] Fallback message - initial to default value
 * @param {String} [options.initial] Index of the default value
 */

class AutoComplete extends Prompt {
  constructor(options = {}) {
    super(options);
    this.render = this.render.bind(this);
    this.complete = this.complete.bind(this);
    this.suggest = (this.options.suggest || this.suggest).bind(this);
    this.style.set('pointers', { off: '', on: '', default: '' });
    this.typed = '';
    this.hint = '';
  }

  moveCursor(i) {
    this.cursor = i;
    if (this.choices.length > 0) {
      this.value = getVal(this.choices, i);
    } else {
      this.value = this.initial !== void 0 ? getVal(this.choices, this.initial) : null;
    }
  }

  async complete(callback) {
    const promise = this.completing = this.suggest(this.typed, this.choices);
    const choices = await promise;
    if (this.completing !== promise) return;

    this.list = choices.slice(0, this.limit).map(s => ansi.strip(s));
    this.completing = false;

    const l = Math.max(choices.length - 1, 0);
    this.moveCursor(Math.min(l, this.cursor));

    if (callback) {
      callback();
    }
  }

  reset() {
    this.typed = '';
    this.complete(() => {
      this.moveCursor(this.initial !== void 0 ? this.initial : 0);
      this.render();
    });
    this.render();
  }

  dispatch(ch) {
    this.typed += ch;
    this.complete(this.render);
    this.render();
  }

  number(ch, key) {
    if (key.shift && /^[*+?]$/.test(ch)) {
      this.dispatch(ch);
    } else {
      super.number(ch);
    }
  }

  delete() {
    if (!this.typed) return this.alert();
    this.typed = this.typed.slice(0, -1);
    this.complete(this.render);
    this.render();
  }

  suggest(typed) {
    return this.choices.filter(item => {
      return item.message.toLowerCase().indexOf(typed.toLowerCase()) === 0;
    });
  }

  render() {
    this.pointer = () => '';
    this.hint = this.typed || colors.gray(this.selected && this.selected.value || '');
    super.render();
  }

  static get AutoComplete() {
    return AutoComplete;
  }
}

module.exports = AutoComplete;
