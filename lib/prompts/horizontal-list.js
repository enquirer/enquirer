'use strict';

const toString = val => Array.isArray(val) ? val.join(', ') : String(val);
const Prompt = require('../prompt');

class HorizontalList extends Prompt {
  constructor(options) {
    super({ showCursor: false, ...options });
    this.multiple = this.options.multiple === true;
    this.choices = [];
    this.index = 0;
    this.cursorHide();
  }

  async initialize() {
    await super.initialize();
    this.choices = this.options.choices.map(this.toChoice.bind(this));
    if (!this.options.symbols || !this.options.symbols.separator) {
      let angle = this.symbols.rightAngleSmall;
      this.symbols.separator = { answered: angle, pending: angle };
    }
    this.render();
  }

  moveIndex(i) {
    if (i < 0) i = this.choices.length - 1;
    if (i === this.choices.length) i = 0;
    this.index = i;
  }

  up() {
    this.moveIndex(this.index - 1);
    this.render();
  }
  down() {
    this.moveIndex(this.index + 1);
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
    return this.index === i ? this.styles.active(choice.message) : choice.message;
  }

  renderChoices() {
    if (this.answered) return ' ' + this.styles.answered(toString(this.selected));
    return ' ' + this.choices.map(this.renderChoice.bind(this)).join(this.sep);
  }

  format() {
    if (this.answered) {
      return this.multiple === true ? this.selected.join(', ') : this.selected.value;
    }
    return super.format();
  }

  async render() {
    this.clear();

    let prompt = [
      this.element('prefix'),
      this.element('message'),
      this.element('separator'),
      await this.format(),
      this.error() || this.hint()
    ];

    this.write(this.header());
    this.write(prompt.filter(Boolean).join(' '));
    this.write(!this.answered && await this.renderChoices());
    this.write(this.footer());
    this.write(this.resetCursor());
  }

  set sep(sep) {
    this.state.sep = sep;
  }
  get sep() {
    return this.state.sep || this.options.sep || ` ${this.styles.muted(this.symbols.middot)} `;
  }

  get selected() {
    return this.choices[this.index];
  }

  submit() {
    this.value = this.multiple ? this.selected : this.selected.value;
    return super.submit();
  }
}

module.exports = HorizontalList;
