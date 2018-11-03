'use strict';

const colors = require('ansi-colors');
const SelectPrompt = require('./select');
const placeholder = require('../placeholder');
const utils = require('../utils');

class FormPrompt extends SelectPrompt {
  constructor(options) {
    super({ ...options, multiple: true });
    this.initial = this.options.initial;
    this.values = {};
  }

  async reset(first) {
    await super.reset();
    if (first === true) this._index = this.index;
    this.index = this._index;
    this.values = {};
    this.choices.forEach(choice => choice.reset && choice.reset());
    return this.render();
  }

  // async toChoice(...args) {
  //   let choice = await super.toChoice(...args);

  //   if (this.store) {
  //     choice.state = this.store.get(choice.name, { past: [], present: '' });
  //     choice.initial = choice.initial || choice.state.present;
  //     choice.state.present = choice.initial;
  //   } else if (!choice.initial) {
  //     choice.initial = choice.value;
  //   }

  //   return choice;
  // }

  dispatch(ch) {
    return !!ch && this.append(ch);
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

  deleteForward() {
    let choice = this.focused;
    if (!choice) return this.alert();
    let { cursor, input } = choice;
    if (input[cursor] === void 0) return this.alert();
    let str = `${input}`.slice(0, cursor) + `${input}`.slice(cursor + 1);
    choice.value = choice.input = str;
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
    return this.dispatch(ch, key);
  }

  number(ch, key) {
    return this.dispatch(ch, key);
  }

  next() {
    let choice = this.focused;
    if (!choice) return this.alert();
    let { initial, input } = choice;
    if (initial && initial.startsWith(input) && input !== initial) {
      choice.value = choice.input = choice.initial;
      choice.cursor = choice.value.length;
      return this.render();
    }
    if (input) {
      return super.next();
    }
    this.alert();
  }

  prev() {
    let choice = this.focused;
    if (!choice) return this.alert();
    if (choice.cursor === 0) {
      return super.prev();
    }
    choice.value = choice.input = '';
    choice.cursor = 0;
    return this.render();
  }

  pointer() {
    return '';
  }

  format(value) {
    return !this.state.submitted ? super.format(value) : '';
  }

  async renderChoice(choice, i) {
    await this.onChoice(choice, i);

    let { state, styles, symbols } = this;
    let { cursor, initial = '', name, input = '', separator = ':', validate } = choice;
    let { muted, submitted, primary, danger } = styles;

    // re-populate the values (answers) object
    this.values[name] = input || initial;

    let message = choice.message.padStart(this.longest + 1, ' ');
    let dotColor = choice.input ? 'success' : 'dark';

    if (typeof validate === 'function' && !(await validate.call(choice, input || initial))) {
      dotColor = 'danger';
    }

    let symbol = choice.prefix || symbols.bullet;
    let prefix = await utils.resolve(state, symbol, state, choice, i);
    let dot = styles[dotColor](prefix);
    if (!input && initial) {
      input = !state.submitted ? muted(initial) : initial;
    }

    if (state.submitted) {
      return [dot, colors.unstyle(message) + separator, submitted(input)].join(' ');
    }

    input = placeholder(this, choice.input, initial, cursor, this.index === i);

    if (this.index === i) {
      message = primary(message);
    }

    if (choice.error) {
      input += (input ? ' ' : '') + danger(choice.error.trim());
    } else if (choice.hint) {
      input += (input ? ' ' : '') + muted(choice.hint.trim());
    }

    return [dot, message + separator, input, choice.help].filter(Boolean).join(' ');
  }

  // async renderChoices() {
  //   let choices = await Promise.all(this.visible.map(this.renderChoice.bind(this)));
  //   let visible = choices.join('\n');
  //   this.action = void 0;
  //   return visible;
  // }

  async submit() {
    this.value = this.values;
    return super.base.submit.call(this);
  }
}

module.exports = FormPrompt;
