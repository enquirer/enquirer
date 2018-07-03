'use strict';

const colors = require('ansi-colors');
const Prompt = require('prompt-base/lib/types/string');
const { extras, symbols, ansi } = Prompt.utils;
const { history, flash } = extras;

class Text extends Prompt {
  constructor(options) {
    super(options);
    this.flash = flash.bind(this, this);
    let hist = this.options.history;
    if (hist) {
      this.history = history(this.name, { ...hist, type: this.type });
      this.autosave = hist.autosave;
    }
  }

  async save() {
    if (!this.typed) return !this.answered && this.alert();
    if (this.history.has(this.typed)) {
      return !this.answered && this.flash(this.style.warning('already exists'));
    }

    this.history('save', this.typed);
    await this.flash(this.style.success('saved'));
    if (!this.answered) {
      this.typed = '';
      this.render();
    }
  }

  async remove() {
    if (!this.typed || !this.history.has(this.typed)) return;
    if (this.history.past.length < 1) return;
    const next = this.history('remove', this.typed) || '';
    await this.flash(this.style.danger('removed'));
    this.typed = next || '';
    this.cursor = this.typed.length;
    this.render();
  }

  async next() {
    const history = this.history.past.concat(this.history.future);
    const value = await this.suggest(this.typed, history);
    if (value) {
      this.typed = value;
      this.cursor = this.typed.length;
      this.render();
    }
  }

  suggest(typed, history = []) {
    return history.find(item => {
      return item.toLowerCase().indexOf(typed.toLowerCase()) === 0;
    });
  }

  shiftUp() {
    if (!this.history) return this.alert();
    if (this.history.past.length === 0) return this.alert();
    this.typed = this.history('prev', this.typed);
    this.cursor = this.typed.length;
    this.render();
  }

  shiftDown() {
    if (!this.history) return this.alert();
    if (!this.history.future.length && !this.history.present) {
      if (this.placeholder) return this.alert();
      this.typed = '';
      this.render();
      return;
    }
    this.typed = this.history('next', this.typed) || '';
    this.cursor = this.typed.length;
    this.render();
  }

  submit() {
    this.answered = true;
    let v = this.value = !this.placeholder ? this.typed : this.initial;

    if (v && this.autosave && !this.placeholder && !this.history.has(v)) {
      return this.save(v)
        .then(() => this.history.update())
        .then(() => super.submit());
    }

    if (this.history) this.history.update();
    return super.submit();
  }

  static get Text() {
    return Text;
  }
}

module.exports = Text;
