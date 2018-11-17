'use strict';

const Prompt = require('../types/string');
const placeholder = require('../placeholder');
const completer = require('../completer');

class Input extends Prompt {
  constructor(options) {
    super(options);

    let history = this.options.history;
    if (history && history.store) {
      let initial = history.values || this.initial;
      this.autosave = !!history.autosave;
      this.store = history.store;
      this.data = this.store.get('values') || { past: [], present: initial };
      this.initial = this.data.present || this.data.past[this.data.past.length - 1];
    }
  }

  completion(action) {
    if (!this.store) return this.alert();
    this.data = completer(action, this.data, this.input);
    if (!this.data.present) return this.alert();
    this.input = this.data.present;
    this.cursor = this.input.length;
    return this.render();
  }

  altUp() {
    return this.completion('prev');
  }

  altDown() {
    return this.completion('next');
  }

  prev() {
    this.save();
    return super.prev();
  }

  save() {
    if (!this.store) return;
    this.data = completer('save', this.data, this.input);
    this.store.set('values', this.data);
  }

  format(input = this.input) {
    if (!this.state.submitted) {
      return placeholder(this, input, this.initial, this.cursor);
    }
    return this.styles.submitted(input || this.initial);
  }

  async render() {
    let size = this.state.size;

    let prefix = await this.prefix();
    let separator = await this.separator();
    let message = await this.message();

    let prompt = [prefix, message, separator].filter(Boolean).join(' ');
    this.state.prompt = prompt;

    let header = await this.header();
    let output = await this.format();
    let help = await this.error() || await this.hint();
    let footer = await this.footer();

    if (help && !output.includes(help)) output += ' ' + help;
    prompt += ' ' + output;

    this.clear(size);
    this.write([header, prompt, footer].filter(Boolean).join('\n'));
    this.restore();
  }

  submit() {
    let value = super.submit();
    if (this.store && this.autosave === true) this.save();
    return value;
  }
}

module.exports = Input;
