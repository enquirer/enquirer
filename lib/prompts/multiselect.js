'use strict';

const colors = require('ansi-colors');
const ArrayPrompt = require('../types/array');
const utils = require('../utils');

/**
 * Multiselect prompt.
 * @param {Object} options Options
 * @param {String} options.message Message
 * @param {Array} options.choices Array of choice objects
 * @param {String} [options.hint] Hint to display
 * @param {Number} [options.cursor=0] Cursor start position
 * @param {Number} [options.max] Max choices
 */

class Multiselect extends ArrayPrompt {
  constructor(options = {}) {
    super(options);
    this.enable = this.enable.bind(this);
    this.isEnabled = this.isEnabled.bind(this);
    this.maxChoices = this.options.maxChoices || Infinity;
    this.expandable = this.options.expandable || false;
    this.initial = this.options.initial;
  }

  async init() {
    await super.init();
    let initial = this.options.initial;
    this.footer = utils.first(this.options.footer, this.colors.hint('(Move up and down to reveal more choices)'));
    this.hint = utils.first(this.options.hint, '(Use arrow-keys. Press <space> to select)');

    if (Array.isArray(initial)) {
      this.initial = this.value = initial.map(ele => {
        let choice = this.enable(this.find(ele));
        return choice.value;
      });
    }
  }

  reset() {
    super.reset();
    this.choices = this.toChoices();
    this.list = this.toList();
  }

  dispatch(ch, key) {
    if (ch === void 0) return;

    if (ch === ' ') {
      return this.toggle();
    }

    if (ch === 'g') {
      let choice = this.choices[this.cursor];
      if (choice.parent && !choice.choices) choice = choice.parent;
      this.toggle(choice);
      this.render();
      return;
    }

    if (ch === 'a') {
      if (this.maxChoices < this.choices.length) return this.alert();
      let enabled = this.isEnabled(this);
      this.choices.forEach(choice => (choice.enabled = !enabled));
      this.render();
      return;
    }

    if (ch === 'i') {
      if (this.maxChoices < this.choices.length) return this.alert();
      this.choices.forEach(choice => (choice.enabled = !this.isEnabled(choice)));
      this.render();
      return;
    }

    this.alert();
  }

  number(...args) {
    if (super.number(...args)) {
      this.toggle();
    }
  }

  enable(choice) {
    choice.enabled = true;
    if (choice.choices) choice.choices.forEach(this.enable);
    return choice;
  }

  isEnabled(choice) {
    return choice.choices ? choice.choices.every(this.isEnabled) : !!choice.enabled;
  }

  toggle(choice = this.choices[this.cursor]) {
    let chosen = choice.enabled = !choice.enabled;
    let toggle = choice => {
      choice.enabled = chosen;
      if (this.exceedsMaxSelected()) {
        choice.enabled = false;
        return this.alert();
      }
      if (choice.choices) {
        choice.choices.forEach(toggle);
      }
    };
    this.emit('toggle', choice);
    toggle(choice);
    this.render();
    return choice;
  }

  indicator(choice) {
    let check = this.symbols.check;
    return choice.enabled ? this.colors.success(check) : this.colors.muted(check);
  }

  renderFooter() {
    if (!this.answered && this.footer && this.list.length < this.choices.length) {
      return this.footer ? '\n' + this.footer : '';
    }
    return '';
  }

  renderChoice(choice, i) {
    choice.enabled = this.isEnabled(choice);
    let indicator = choice.indicator || this.indicator(choice, i);
    let message = this.cursor === i ? this.colors.selected(choice.message) : choice.message;
    if (choice.parent) {
      indicator = '  ' + choice.parent.indent + indicator;
    }
    if (choice.disabled) {
      message = this.colors.disabled(message);
      indicator = this.colors.muted(colors.unstyle(indicator));
    }
    return indicator + ' ' + message + (choice.hint ? ' ' + this.colors.disabled(choice.hint) : '');
  }

  render() {
    this.clear();
    let selected = this.selected.map(choice => this.colors.active(choice.message));
    let value = this.answered ? selected.join(', ') : this.colors.hint(this.hint);
    this.write(this.renderHeader());
    this.write(this.renderMessage(value));
    this.write(this.renderChoices());
    this.write(this.renderFooter());
  }

  submit() {
    this.value = this.selected.map(choice => choice.value);
    return this.base.submit.call(this, this.value);
  }
}

module.exports = Multiselect;
