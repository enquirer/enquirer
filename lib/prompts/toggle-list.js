'use strict';

const toString = val => Array.isArray(val) ? val.join(', ') : String(val);
const colors = require('ansi-colors');
const Prompt = require('../prompt');

class ToggleList extends Prompt {
  constructor(options = {}) {
    super(options);
    this.hint = options.hint || '';
    this.cursor = 0;
  }

  async init() {
    await super.init();
    this.choices = this.options.choices.map(this.toChoice.bind(this));
    if (!this.options.symbols || !this.options.symbols.separator) {
      let angle = this.symbols.rightAngleSmall;
      this.symbols.separator = { answered: angle, pending: angle };
    }
  }

  moveCursor(i) {
    if (i < 0) i = this.choices.length - 1;
    if (i === this.choices.length) i = 0;
    this.cursor = i;
  }

  up() {
    this.moveCursor(this.cursor - 1);
    this.render();
  }
  down() {
    this.moveCursor(this.cursor + 1);
    this.render();
  }
  right() {
    this.down();
  }
  left() {
    this.up();
  }
  next() {
    this.down();
  }
  prev() {
    this.up();
  }

  toChoice(choice) {
    if (typeof choice === 'string') choice = { name: choice, value: choice };
    choice.name = choice.name || choice.value;
    choice.message = choice.message || choice.name;
    choice.value = choice.vallue || choice.name;
    return choice;
  }

  renderChoice(choice, i) {
    return this.cursor === i ? colors.underline(choice.message) : choice.message;
  }

  renderChoices() {
    if (this.answered) return ' ' + colors.cyan(toString(this.selected));
    return ' ' + this.choices.map(this.renderChoice.bind(this)).join(this.sep);
  }

  render() {
    this.clear();
    this.write(this.renderMessage());
    this.write(this.renderChoices());
  }

  set sep(sep) {
    this._sep = sep;
  }
  get sep() {
    return this._sep || this.options.sep || ` ${colors.dim(this.symbols.middot)} `;
  }

  get selected() {
    return this.choices[this.cursor].value;
  }

  submit() {
    this.value = this.selected;
    return super.submit();
  }
}

module.exports = ToggleList;
