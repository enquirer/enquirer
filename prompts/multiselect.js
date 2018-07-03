'use strict';

const ArrayPrompt = require('prompt-base/lib/types/array');
const { green, dim, cyan, gray } = require('ansi-colors');
const { isValidNumberKey, symbols } = ArrayPrompt.utils;

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
    this.style.set('pointers', { off: '', on: '', default: '' });
    this.isEnabled = this.isEnabled.bind(this);
    this.maxChoices = this.options.maxChoices || Infinity;
    this.expandable = this.options.expandable || false;
    this.initial = this.options.initial;
    this.footer = this.options.footer || '(Move up and down to reveal more choices)';
    this.hint = this.options.hint || '(Use arrow-keys. Press <space> to select)';
  }

  reset() {
    super.reset();
    this.toChoices();
  }

  dispatch(ch, key) {
    if (ch === void 0) return;

    if (ch === ' ') {
      return this.space();
    }

    if (ch === 'g') {
      let choice = this.choices[this.cursor];
      if (choice.group && !choice.choices) choice = choice.group;
      this.toggle(choice);
      this.render();
      return;
    }

    if (ch === 'a') {
      if (this.maxChoices < this.choices.length) return this.alert();
      const enabled = this.isEnabled(this);
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

  space() {
    this.toggle();
  }

  number(...args) {
    if (super.number(...args)) this.toggle();
  }

  enable(choice) {
    choice.enabled = true;
    if (choice.choices) choice.choices.forEach(this.enable.bind(this));
  }

  isEnabled(choice) {
    return choice.choices ? choice.choices.every(this.isEnabled) : !!choice.enabled;
  }

  toggle(choice = this.choices[this.cursor]) {
    const chosen = choice.enabled = !choice.enabled;
    const toggle = choice => {
      choice.enabled = chosen;
      if (this.exceedsMaxSelected()) {
        choice.enabled = false;
        return this.alert();
      }
      if (choice.choices) {
        choice.choices.forEach(toggle);
      }
    };
    toggle(choice);
    this.render();
  }

  renderChoice(choice, i) {
    const status = this.cursor === i ? 'on' : 'off';
    choice.enabled = this.isEnabled(choice);
    const prefix = this.style.pointer(choice, status, this.expandable);
    const check = this.style.check(choice, this.cursor === i);
    const msg = this.style.message(choice, this.cursor === i);
    const hint = this.style.hint(choice.hint, choice.status);
    return prefix + check + msg;
  }

  renderChoices() {
    return '\n' + this.list.map(this.renderChoice.bind(this)).join('\n');
  }

  render() {
    this.clear();
    const values = this.selected.map(choice => cyan(choice.message));
    const value = this.answered ? values.join(', ') : dim(this.hint);

    // ? render the prompt message
    let message = this.renderMessage(value);

    // - render the list of choices
    if (!this.answered) {
      message += this.renderChoices();

      if (this.choices.length > this.list.length || this.options.footer) {
        message += '\n' + gray(this.footer.trim());
      }
    }

    // > write the prompt
    this.write(message);
  }

  submit() {
    const submit = this.constructor.base.prototype.submit;

    const reduce = (values = this.selected) => {
      let value = {};

      if (!this.choices.some(choice => choice.choices)) {
        value = values.map(choice => choice.value);
      } else {
        for (const choice of values) {
          if (choice.group) {
            value[choice.group.value] = value[choice.group.value] || [];
            value[choice.group.value].push(choice.value);
          } else if (!choice.choices) {
            value[choice.name] = choice.value;
          }
        }
      }
      return value;
    };

    this.value = reduce(this.selected);
    return submit.call(this);
  }
}

module.exports = Multiselect;
