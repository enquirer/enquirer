'use strict';

const Prompt = require('..');
const { cyan, dim, red } = require('ansi-colors');
const { utils } = Prompt;
const { ansi } = utils;

class Wizard extends Prompt {
  constructor(options = {}) {
    super(options);
  }

  async init(...args) {
    await super.init(...args);
    this.choices = [];
    this.cursor = 0;
    this.typed = '';
    this.hint = this.hint || '';
    this.footer = dim('(Scroll up and down to reveal more choice)');
    this.step = 0;
    this.value = {};
  }

  dispatch(ch, key) {
    if (!this.isInput) return this.alert();
    if (this.typed) {
      let before = this.typed.slice(0, this.cursor);
      let after = this.typed.slice(this.cursor);
      this.typed = `${before}${ch}${after}`;
      this.cursor += this.scale;
    } else {
      this.typed += ch;
      this.cursor = this.typed.length;
    }
    this.render();
  }

  delete() {
    if (!this.isInput) return this.alert();
    let before = this.typed.slice(0, this.cursor - this.scale);
    let after = this.typed.slice(this.cursor);
    this.typed = `${before}${after}`;
    this.cursor -= this.scale;
    this.render();
  }

  moveCursor(i) {
    if (i < 0) i = this.choices.length - 1;
    if (i === this.choices.length) i = 0;
    this.cursor = i;
  }

  up() {
    if (this.isInput) return this.alert();
    this.moveCursor(this.cursor - 1);
    this.render();
  }
  down() {
    if (this.isInput) return this.alert();
    this.moveCursor(this.cursor + 1);
    this.render();
  }

  left() {
    if (!this.isInput || this.cursor === 0) return this.alert();
    this.cursor--;
    this.render();
  }

  right() {
    if (!this.isInput || this.cursor === this.typed.length) return this.alert();
    this.cursor++;
    this.render();
  }

  async prev() {
    await this.update(true);
  }

  async next() {
    await this.update();
  }

  get isInput() {
    return this.steps[this.step].type === 'input';
  }

  find(value) {
    return this.choices.find(choice => choice.value === value);
  }

  findIndex(value) {
    const choice = this.find(value);
    if (choice) return choice.index;
    return -1;
  }

  toChoice(choice, i) {
    if (typeof choice === 'string') {
      choice = { name: choice, message: choice, value: choice };
    }
    choice.index = i;
    return choice;
  }

  renderChoice(choice, i) {
    let on = this.cursor === i;
    let pointer = cyan(this.symbols.pointer[on ? 'on' : 'off']);
    let message = on ? cyan(choice.message) : choice.message;
    return pointer + ' ' + message;
  }

  renderChoices() {
    let visible = this.choices.map((choice, i) => this.renderChoice(choice, i));
    return visible.length ? ('\n' + visible.join('\n')) : '';
  }

  renderFooter() {
    if (this.isInput) return '';
    return !this.answered && this.footer ? '\n' + this.footer : '';
  }

  render() {
    this.clear();
    if (this.isInput) {
      this.cursorShow();
    } else {
      this.cursorHide();
    }

    const step = this.steps[this.step];
    const sep = this.options.separator || ` ${this.symbols.rightAngle} `;
    const header = this.steps.reduce((acc, step) => {
      if (this.value[step.name]) {
        acc += `${acc === '' ? '' : sep}${this.value[step.name]}`;
      }
      return acc;
    }, '');

    this.header = this.answered ? '' : dim(header);
    this.message = step.message;

    let value = '';
    if (this.answered) {
      value = header.split(sep).map(seg => cyan(seg)).join(sep);
    } else if (this.isInput) {
      value = this.typed || dim(step.placeholder || ' ');
    } else {
      value = this.selected ? cyan(this.selected.value) : '';
    }

    if (this.loading) {
      value = red(`Please wait until all ${step.name} are loaded`);
    }

    this.write(this.renderHeader());
    this.write(this.renderMessage(value + this.hint));
    this.write(this.renderChoices());
    this.write(this.renderFooter());
    if (this.isInput) {
      this.write(ansi.cursor.move(-(this.typed || step.placeholder || ' ').length + this.cursor));
    }
  }

  get selected() {
    return this.choices[this.cursor];
  }

  submit() {
    return this.update();
  }

  async update(back) {
    const current = this.steps[this.step];
    const val = await current.submit.call(this);
    if (!back && typeof current.validate === 'function' && !await current.validate.call(this, val)) {
      return this.alert();
    }
    this.value[current.name] = val;

    const next = this.steps[this.step + (back ? -1 : 1)];
    if (!next) return back ? this.alert() : super.submit();

    this.choices = [];
    this.typed = this.value[next.name] || '';
    this.cursor = this.typed.length;

    if (typeof next.init === 'function') {
      const initial = await next.init.call(this);
      if (next.type === 'choices' && Array.isArray(initial)) {
        this.choices = initial.map(this.toChoice.bind(this));
        const idx = this.findIndex(this.value[next.name]);
        this.moveCursor(idx === -1 ? 0 : idx);
      } else if (initial) {
        this.typed = initial;
        this.cursor = this.typed.length;
      }
    }

    this.step += (back ? -1 : 1);
    this.render();
  }
}

module.exports = Wizard;
