'use strict';

const Select = require('./select');

class AutoComplete extends Select {
  constructor(options = {}) {
    super(options);
    this.cursorShow();
  }

  moveCursor(n) {
    this.state.cursor += n;
  }

  dispatch(ch) {
    return this.append(ch);
  }

  space(ch) {
    return this.append(ch);
  }

  append(ch) {
    let { cursor, input } = this.state;
    this.state.input = input.slice(0, cursor) + ch + input.slice(cursor);
    this.moveCursor(1);
    return this.complete();
  }

  delete() {
    let { cursor, input } = this.state;
    if (!input) return this.alert();
    this.state.input = input.slice(0, cursor - 1) + input.slice(cursor);
    this.moveCursor(-1);
    return this.complete();
  }

  async complete() {
    this.completing = true;
    this.choices = (await this.suggest(this.state.input, this.state._choices));
    this.state.limit = void 0; // allow getter/setter to reset limit
    this.completing = false;
    this.index = Math.min(Math.max(this.visible.length - 1, 0), this.index);
    await this.render();
  }

  suggest(input = this.state.input, choices = this.state._choices) {
    if (typeof this.options.suggest === 'function') {
      return this.options.suggest.call(this, input, choices);
    }
    return choices.filter(choice => choice.message.startsWith(input));
  }

  pointer() {
    return '';
  }

  format() {
    if (!this.focused) return this.input;
    if (this.state.submitted) {
      let value = this.value = this.state.input = this.focused.value;
      return this.styles.primary(value);
    }
    return this.state.input;
  }

  async render() {
    this.visible = !this.state.submitted ? await this.suggest() : [];
    return super.render();
  }

  submit() {
    if (!this.focused) return this.alert();
    return super.submit();
  }
}

module.exports = AutoComplete;
