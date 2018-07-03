'use strict';

const hint = '(Use arrow keys, press <return> to submit)';
const colors = require('ansi-colors');
const Store = require('data-store');
const history = require('prompt-base/lib/extras/form-history');
const Prompt = require('./select');
const { extras, trim } = Prompt.utils;

/**
 * Create a new Form prompt with the given options
 */

class Form extends Prompt {
  constructor(options = {}) {
    super(options);
    this.hint = this.options.hint || colors.italic.dim(hint);
    this.flash = extras.flash.bind(this, this);
    this.pointer = () => '';

    if (this.options.history) {
      const opts = { ...this.options.history };
      const name = opts.name || `prompt-form-${this.name}`;
      this.store = opts.store || new Store(name, opts, opts.state);
      this.history = history(this);
    }

    this.choices.forEach(choice => {
      if (!choice.initial) choice.initial = choice.value;
      choice.value = '';
      if (this.store && this.options.history && !this.store.has(choice.name)) {
        this.store.set(choice.name, { past: [], present: null, future: [] });
      }
    });
  }

  dispatch(ch, key) {
    const choice = this.choices[this.cursor];
    if (this.choice !== choice) {
      this.typed = choice.value;
    }
    choice.value = this.typed += ch;
    this.choice = choice;
    this.render();
  }

  number(ch, key) {
    this.dispatch(ch, key);
  }

  save() {
    if (!this.typed) {
      this.flash(colors.red('nothing to save'));
      return this.alert();
    }
    this.action = 'save';
    const choice = this.choices[this.cursor];
    choice.alert = colors.green(` ${this.symbols.check} saved ${choice.value}`);
    this.render();
    this.flash()
      .then(() => {
        choice.value = '';
        choice.alert = '';
        this.render();
      });
  }

  remove() {
    if (!this.value) {
      this.flash(colors.red('nothing to remove'));
      return this.alert();
    }
    this.action = 'remove';
    const choice = this.choices[this.cursor];
    choice.alert = colors.yellow(` ${this.symbols.check} removed ${choice.value}`);
    this.render();
    this.flash()
      .then(() => {
        choice.value = '';
        choice.alert = '';
        this.render();
      });
  }

  shiftUp() {
    this.action = 'prev';
    this.render();
  }

  shiftDown() {
    this.action = 'next';
    this.render();
  }

  reset() {
    this.typed = '';
    this.choices.forEach(choice => (choice.value = ''));
    this.render();
    super.reset();
  }

  delete() {
    const choice = this.choices[this.cursor];
    if (!choice) return this.alert();
    choice.value = this.typed = this.typed.slice(0, -1);
    this.render();
  }

  values() {
    const values = {};
    for (const choice of this.choices) {
      const value = colors.unstyle(choice.value || choice.hint);
      if (value != null) {
        values[choice.name] = value;
      }
    }
    return values;
  }

  renderChoice(choice, index) {
    const len = this.longest + 1;
    let message = trim(choice.message).padStart(len, ' ') + ' ';
    let value = choice.value || choice.hint || '';
    let prefix = message;

    if (this.answered) {
      return prefix + colors.cyan(colors.unstyle(value));
    }

    if (this.cursor === index) {
      if (this.action && this.options.history) {
        let state = this.history(this.action, choice.name, choice.value);
        if (state.present) {
          this.store.set(choice.name, state);
          value = this.value = choice.value = state.present;
        }
      }
      prefix = colors.cyan(message);
    }

    if (choice.alert) {
      value += choice.alert;
    }
    return prefix + value;
  }

  renderChoices() {
    const list = this.list.map(this.renderChoice.bind(this));
    this.action = void 0;
    return '\n' + list.join('\n');
  }

  render(first) {
    this.clear();

    // ? render the prompt message line
    let message = this.renderMessage(!this.answered ? this.hint : '');

    // - render the form inputs
    message += this.renderChoices();

    // > write the prompt
    this.write(message);
  }

  submit() {
    this.value = this.values();
    if (this.options.history) {
      this.history.update(this.value);
    }
    return super.submit();
  }

  static get Form() {
    return Form;
  }
}

module.exports = Form;

