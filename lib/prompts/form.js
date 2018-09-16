'use strict';

const colors = require('ansi-colors');
const SelectPrompt = require('./select');
const utils = require('../utils');
const { flash, history } = require('../extras');

/**
 * Create a new Form prompt with the given options
 */

class FormPrompt extends SelectPrompt {
  constructor(options = {}) {
    super(options);
    this.hint = this.options.hint || '';
    this.flash = flash.bind(this, this);
    this.symbols.separator = {};
    this.separator = this.symbols.middot;
    this.pointer = () => '';

    this.store = this.options.history && this.options.history.store;
    this.color('remove', this.colors.danger);
    this.color('save', this.colors.success);
  }

  toChoice(...args) {
    let choice = super.toChoice(...args);
    let { typed } = choice;

    if (this.store) {
      choice.state = this.store.get(choice.name, { past: [], present: '' });
      choice.initial = choice.initial || choice.state.present;
      choice.state.present = choice.initial;
    }

    choice.reset = (val = (typed || '')) => {
      choice.typed = val;
      choice.value = val;
    };

    choice.reset();
    return choice;
  }

  dispatch(ch = '', key) {
    let choice = this.choices[this.cursor];
    if (!choice) return this.alert();
    this.typed = choice.value = (choice.typed += ch);
    this.render();
  }

  reset() {
    this.value = '';
    this.typed = '';
    this.choices.forEach(choice => choice.reset());
    super.reset();
  }

  delete() {
    let choice = this.choices[this.cursor];
    if (!choice) return this.alert();
    this.typed = choice.value = choice.typed = choice.typed.slice(0, -1);
    this.render();
  }

  number(ch, key) {
    this.dispatch(ch, key);
  }

  next() {
    super.next();
    let choice = this.choices[this.cursor];
    this.typed = choice.typed;
  }

  prev() {
    super.prev();
    let choice = this.choices[this.cursor];
    this.typed = choice.typed;
  }

  shiftUp() {
    this.updateHistory('undo');
  }

  shiftDown() {
    this.updateHistory('redo');
  }

  save() {
    return this.updateStore('save');
  }

  remove() {
    return this.updateStore('remove');
  }

  updateHistory(action) {
    if (!this.store) return this.alert();
    let choice = this.choices[this.cursor];
    let data = this.store.get(choice.name);
    let state = history(action, data, choice.value);
    this.value = state.present;
    this.typed = state.present;
    choice.reset(state.present);
    this.store.set(choice.name, state);
    this.render();
  }

  updateStore(action) {
    if (!this.store) return this.alert();

    const pos = this.cursor;
    const choice = this.choices[pos];
    if (!choice) return this.alert();

    const flash = (msg, ms = 1500) => {
      let help = choice.help;
      choice.help = msg;
      return this.flash(void 0, ms)
        .then(() => {
          choice.help = help;
          this.cursor = pos;
          this.render();
        });
    };

    if (!this.store) {
      return flash(this.colors.danger(`(cannot ${action}, store is disabled on options)`));
    }

    if (!choice.value) {
      return flash(this.colors.danger(`(nothing to ${action})`));
    }

    if (action === 'save') {
      let data = this.store.get(choice.name);
      if (data.present === choice.value || data.past.includes(choice.value)) {
        return flash(this.colors.danger('(already saved)'));
      }
    }

    this.updateHistory(action);
    return flash(this.colors[action](` ${this.symbols.check} ${action}d ${choice.value}`));
  }

  values() {
    let values = {};
    for (let choice of this.choices) {
      values[choice.name] = colors.unstyle(choice.value || choice.initial || '');
    }
    return values;
  }

  renderChoice(choice, i) {
    let sep = utils.toValue(this, 'separator', choice.separator, choice, i).trim();
    let message = utils.resolveValue(this, choice.message, choice, i);
    let msg = ' ' + utils.trim(message).padStart(this.longest + 1, ' ');
    let value = choice.value || '';
    let prefix = msg;

    if (!value && choice.initial) {
      value = !this.answered ? this.colors.hint(choice.initial) : choice.initial;
    }

    if (this.answered) {
      return [prefix, sep, this.colors.answered(value)].join(' ');
    }

    if (this.cursor === i) {
      prefix = this.colors.active(prefix);
    }

    if (!value && choice.hint) {
      value = this.colors.hint(choice.hint);
    }

    return [prefix, sep, value, choice.help].filter(Boolean).join(' ');
  }

  renderChoices() {
    let list = '\n' + this.list.map(this.renderChoice.bind(this)).join('\n');
    this.action = void 0;
    return list;
  }

  render(help) {
    this.clear();
    this.write(this.renderMessage(this.renderHelp(help)));
    this.write(this.renderChoices());
  }

  submit(value) {
    this.value = utils.isValue(value) ? value : this.values();
    return super.submit(this.value);
  }

  static get FormPrompt() {
    return FormPrompt;
  }
}

module.exports = FormPrompt;

