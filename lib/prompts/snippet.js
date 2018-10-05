'use strict';

const interpolate = require('../utils/interpolate');
const Prompt = require('../prompt');

class SnippetPrompt extends Prompt {
  constructor(options) {
    super(options);
    this.state.keys = [];
    this.state.required = new Set();
    this.state.missing = new Set();
    this.state.invalid = new Set();
    this.state.errors = [];
    this.state.values = {};
    this.interpolate = interpolate(this.options);
  }

  moveCursor(n) {
    let choice = this.getChoice();
    this.cursor += n;
    choice.cursor += n;
  }

  dispatch(ch, key) {
    if (!key.code && !key.ctrl && ch != null && this.getChoice()) {
      this.append(ch, key);
      return;
    }
    this.alert();
  }

  append(ch, key) {
    let choice = this.getChoice();
    let prefix = choice.input.slice(0, this.cursor);
    let suffix = choice.input.slice(this.cursor);
    this.input = choice.input = `${prefix}${ch}${suffix}`;
    this.moveCursor(1);
    this.update();
    this.render();
  }

  delete() {
    let choice = this.getChoice();
    if (this.cursor <= 0 || !choice.input) {
      return this.alert();
    }
    let suffix = choice.input.slice(this.cursor);
    let prefix = choice.input.slice(0, this.cursor - 1);
    this.input = choice.input = `${prefix}${suffix}`;
    this.moveCursor(-1);
    this.update();
    this.render();
  }

  increment(i) {
    return (i >= this.state.keys.length - 1 ? 0 : (i + 1));
  }

  decrement(i) {
    return (i <= 0 ? this.state.keys.length - 1 : (i - 1));
  }

  first() {
    this.state.index = 0;
    this.render();
  }
  last() {
    this.state.index = this.state.keys.length - 1;
    this.render();
  }

  right() {
    if (this.cursor >= this.input.length) {
      return this.alert();
    }
    this.moveCursor(1);
    this.render();
  }
  left() {
    if (this.cursor <= 0) {
      return this.alert();
    }
    this.moveCursor(-1);
    this.render();
  }

  prev() {
    this.state.index = this.decrement(this.state.index);
    this.getChoice();
    this.render();
  }
  next() {
    this.state.index = this.increment(this.state.index);
    this.getChoice();
    this.render();
  }

  up() {
    this.prev();
  }
  down() {
    this.next();
  }

  update() {
    if (this.state.key && this.input) {
      this.state.missing.delete(this.state.key);
      return;
    }
    if (this.state.key && this.state.required.has(this.state.key)) {
      this.state.missing.add(this.state.key);
    }
  }

  format(value) {
    return this.answered ? '' : super.format(value);
  }

  render() {
    this.clear();

    let output = this.interpolate(this.state);

    let prompt = [
      this.element('prefix'),
      this.element('message'),
      this.element('separator'),
      this.format(),
      this.error() || !this.input && this.hint()
    ];

    this.write(this.header());
    this.write(prompt.filter(Boolean).join(' '));
    this.write('\n' + output);
    this.write(this.footer());
    this.write(this.resetCursor());
  }

  getChoice(name) {
    let choice = this.state.choices.find(ch => ch.name === this.state.keys[this.state.index]);
    if (choice && choice.input != null) {
      this.input = choice.input;
      this.cursor = choice.cursor;
    }
    return choice;
  }

  submit() {
    this.value = this.state.values;
    return super.submit();
  }
}

module.exports = SnippetPrompt;
