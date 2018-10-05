'use strict';

const colors = require('ansi-colors');
const SelectPrompt = require('./select');
const { placeholder } = require('../utils');

class FormPrompt extends SelectPrompt {
  async reset() {
    this.values = {};
    await super.reset();
    this.choices.forEach(choice => choice.reset());
  }

  toChoice(...args) {
    let choice = super.toChoice(...args);

    if (this.store) {
      choice.state = this.store.get(choice.name, { past: [], present: '' });
      choice.initial = choice.initial || choice.state.present;
      choice.state.present = choice.initial;
    } else if (!choice.initial) {
      choice.initial = choice.value;
    }

    choice.reset = (input = (choice.input || ''), value = (choice.value || '')) => {
      choice.input = input;
      choice.value = value;
      if (choice.value === choice.name) {
        choice.value = input;
      }
    };

    choice.reset();
    return choice;
  }

  dispatch(ch) {
    ch && this.append(ch);
  }

  append(s) {
    let choice = this.focused;
    if (!choice) return this.alert();
    let { cursor, input } = choice;
    choice.value = choice.input = input.slice(0, cursor) + s + input.slice(cursor);
    choice.cursor++;
    return this.render();
  }

  delete() {
    let choice = this.focused;
    if (!choice || choice.cursor <= 0) return this.alert();
    let { cursor, input } = choice;
    choice.value = choice.input = input.slice(0, cursor - 1) + input.slice(cursor);
    choice.cursor--;
    return this.render();
  }

  right() {
    let choice = this.focused;
    if (!choice) return this.alert();
    if (choice.cursor >= choice.input.length) return this.alert();
    choice.cursor++;
    return this.render();
  }
  left() {
    let choice = this.focused;
    if (!choice) return this.alert();
    if (choice.cursor <= 0) return this.alert();
    choice.cursor--;
    return this.render();
  }

  space(ch, key) {
    this.dispatch(ch, key);
  }

  number(ch, key) {
    this.dispatch(ch, key);
  }

  next() {
    let choice = this.focused;
    if (!choice) return this.alert();
    let { initial, input } = choice;

    if (initial.startsWith(input) && input !== initial) {
      choice.value = choice.input = choice.initial;
      choice.cursor = choice.value.length;
      return this.render();
    }

    this.alert();
  }

  prev() {
    let choice = this.focused;
    if (!choice) return this.alert();
    choice.value = choice.input = '';
    choice.cursor = 0;
    return this.render();
  }

  pointer() {
    return '';
  }

  format(value) {
    return !this.answered ? super.format(value) : '';
  }

  async renderChoice(choice, i) {
    let { cursor, initial = '', name, value = '', separator = ':', validate } = choice;
    let { muted, answered, active, danger } = this.styles;

    // re-populate the values (answers) object
    this.values[name] = value || initial;

    let message = choice.message.padStart(this.longest + 1, ' ');
    let dotColor = choice.value ? 'success' : 'dark';

    if (typeof validate === 'function' && !(await validate.call(choice, value || initial))) {
      dotColor = 'danger';
    }

    let dot = this.styles[dotColor](this.symbols.bullet);
    if (!value && initial) {
      value = !this.answered ? muted(initial) : initial;
    }

    if (this.answered) {
      return dot + [colors.unstyle(message) + separator, answered(value)].join(' ');
    }

    value = placeholder(this, choice.value, initial, cursor, this.index === i);

    if (this.index === i) {
      message = active(message);
    }

    if (choice.error) {
      value += ' ' + danger(choice.error.trim());
    } else if (choice.hint) {
      value += ' ' + muted(choice.hint.trim());
    }

    return dot + [message + separator, value, choice.help].filter(Boolean).join(' ');
  }

  async renderChoices() {
    let choices = await Promise.all(this.visible.map(this.renderChoice.bind(this)));
    let visible = '\n' + choices.join('\n');
    this.action = void 0;
    return visible;
  }

  submit(value) {
    this.value = (value != null && value !== '') ? value : this.values;
    return super.submit(this.value);
  }
}

module.exports = FormPrompt;

