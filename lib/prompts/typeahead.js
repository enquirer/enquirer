'use strict';

const colors = require('ansi-colors');
const AutoComplete = require('./autocomplete');
const { placeholder } = require('../utils');

class Typeahead extends AutoComplete {
  constructor(options) {
    super({ allowCustom: true, styles: { placeholder: colors.dim }, ...options });
    this.cursorHide();
  }

  hint() {
    return '';
  }
  footer() {
    return !this.answered && '\n' + this.styles.warning('(Start typing or use arrow keys)');
  }

  next() {
    if (!this.focused) return this.alert();
    this.input = this.focused.value;
    this.cursor = this.input.length;
    return this.render();
  }
  prev() {
    this.input = '';
    this.cursor = 0;
    return this.render();
  }

  up() {
    return this.input ? this.alert() : super.up();
  }
  down() {
    return this.input ? this.alert() : super.down();
  }

  format() {
    if (this.options.format) return super.format(this.input);
    let focused = this.focused ? this.focused.message : '';
    if (this.answered) return this.input || focused;
    return placeholder(this, this.input, focused, this.cursor, !this.answered);
  }

  header() {
    return '';
  }

  renderChoices() {
    return '';
  }
}

module.exports = Typeahead;
