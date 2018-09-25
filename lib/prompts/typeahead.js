'use strict';

const first = (...args) => args.find(v => v != null);
const colors = require('ansi-colors');
const ansi = require('../style/ansi');
const symbols = require('../style/symbols');
const ArrayPrompt = require('../types/array');
const utils = require('../utils');

class SelectPrompt extends ArrayPrompt {
  constructor(options) {
    super({ multiple: false, ...options });
    this.hint = first(this.state.hint, 'Use arrow keys, <return> to submit.');
  }

  typeahead(ch, key) {
    // if (!this.options.typeahead) return this.alert();
    let typed = this.state.typed + ch;
    let choice = this.find(choice => choice.message.startsWith(typed));
    if (!choice) return this.alert();
    this.index = choice.index;
    this.state.placeholder = choice.message;
    this.state.typed = typed;
    this.state.cursor++;
    this.render();
  }

  delete() {
    let { cursor, typed } = this.state;
    if (!typed) return this.alert();
    let prefix = typed.slice(0, cursor - 1);
    let suffix = typed.slice(cursor);
    typed = prefix + suffix;
    cursor--;
    if (cursor === 0) {
      this.state.placeholder = '';
      typed = '';
    }
    this.state.cursor = cursor;
    this.state.typed = typed;
    this.render();
  }

  next() {
    // let { choices, index } = this.state;
    let idx = this.findIndex(ch => ch.message.startsWith(this.state.typed));
    if (idx > -1) {
      this.state.typed = this.state.choices[idx].message;
      this.state.cursor = this.state.typed.length;
      this.state.index = idx;
      this.render();
      return;
    }
    // let choice = choices[index];
    // if (choice) {
    //   this.typed = choice.message;
    //   return this.render();
    // }
    this.alert();
  }

  pointer(choice, i) {
    return this.index === i ? choice.pointer : ' ';
  }

  renderChoice(choice, i) {
    let hint = choice.hint ? this.styles.hint(choice.hint) : '';
    let focused = this.index === i;
    let pointer = this.pointer(choice, i);
    let message = choice.message;
    let render = () => [pointer, message, hint].filter(Boolean).join(' ');

    if (choice.disabled) {
      message = this.styles.disabled(message);
      return render();
    }

    if (focused && this.multiple) {
      message = this.styles.selected(message);
      return render();
    }

    if (focused && !this.multiple) {
      pointer = this.styles.active(pointer);
      message = this.styles.active(message);
      choice.enabled = true;
    }

    return render();
  }

  renderChoices() {
    if (this.answered) return '';
    return '\n' + this.visible.map(this.renderChoice.bind(this)).join('\n');
  }

  renderBody() {
    // if (this.options.typeahead) return '';
    return Promise.resolve(this.renderChoices());
  }

  renderPrompt() {
    let { prefix, message, separator } = this.state;
    return [colors.cyan(prefix), colors.bold(message), colors.dim(separator)].filter(Boolean).join(' ');
  }

  async render() {
    this.clear();
    this.write(ansi.cursor.hide);

    let { typed, choices, index, placeholder } = this.state;
    let choice = choices[index];
    let value = this.answered ? this.styles.answered(choice.value) : utils.unmask(typed, placeholder);
    // console.log([this.state.limit])
    this.write(this.renderPrompt() + ' ');
    this.write([value, this.hint].filter(Boolean).join(' '));
    this.write(await this.renderBody());
  }
}

module.exports = SelectPrompt;
