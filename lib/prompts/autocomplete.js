'use strict';

const SelectPrompt = require('./select');

class AutoCompletePrompt extends SelectPrompt {
  constructor(options = {}) {
    super(options);
    this.cursorShow();
  }

  moveCursor(n = 0) {
    this.cursor += n;
  }

  dispatch(s) {
    return this.append(s);
  }

  append(s) {
    let { cursor } = this.state;
    this.input = this.input.slice(0, cursor) + s + this.input.slice(cursor);
    this.moveCursor(1);
    return this.complete();
  }

  delete() {
    if (!this.input) return this.alert();
    let cursor = this.cursor;
    this.input = this.input.slice(0, cursor - 1) + this.input.slice(cursor);
    this.moveCursor(-1);
    return this.complete();
  }

  pointer() {
    return '';
  }

  async complete() {
    this.completing = true;
    this.choices = (await this.suggest(this.input, this.allChoices));
    this.state.limit = void 0; // allow prompt to reset limit automatically
    this.completing = false;
    this.index = Math.min(Math.max(this.visible.length - 1, 0), this.index);
    await this.render();
  }

  async suggest(input, choices = []) {
    if (typeof this.options.suggest === 'function') {
      return this.options.suggest.call(this, input, choices);
    }
    return choices.filter(ch => ch.message.startsWith(input));
  }

  submit(value) {
    if (this.options.allowCustom === true && value != null) {
      if (value != null) return super.submit(value);
    }
    let choice = this.visible[this.index];
    if (!choice) return this.alert();
    this.value = choice.value;
    return super.submit(this.value);
  }
}

module.exports = AutoCompletePrompt;
