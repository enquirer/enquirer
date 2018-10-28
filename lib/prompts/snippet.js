'use strict';

const colors = require('ansi-colors');
const interpolate = require('../interpolate');
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
    this.interpolate = interpolate(this);
    this.cursorHide();
  }

  moveCursor(n) {
    let item = this.getItem();
    this.cursor += n;
    item.cursor += n;
  }

  dispatch(ch, key) {
    if (!key.code && !key.ctrl && ch != null && this.getItem()) {
      this.append(ch, key);
      return;
    }
    this.alert();
  }

  append(ch, key) {
    let item = this.getItem();
    let prefix = item.input.slice(0, this.cursor);
    let suffix = item.input.slice(this.cursor);
    this.input = item.input = `${prefix}${ch}${suffix}`;
    this.moveCursor(1);
    this.update();
    this.render();
  }

  delete() {
    let item = this.getItem();
    if (this.cursor <= 0 || !item.input) return this.alert();
    let suffix = item.input.slice(this.cursor);
    let prefix = item.input.slice(0, this.cursor - 1);
    this.input = item.input = `${prefix}${suffix}`;
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
    if (this.cursor >= this.input.length) return this.alert();
    this.moveCursor(1);
    this.render();
  }

  left() {
    if (this.cursor <= 0) return this.alert();
    this.moveCursor(-1);
    this.render();
  }

  prev() {
    this.state.index = this.decrement(this.state.index);
    this.getItem();
    this.render();
  }

  next() {
    this.state.index = this.increment(this.state.index);
    this.getItem();
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
    return this.state.answered ? '' : super.format(value);
  }

  async render() {
    let { index, keys = [], submitted, size } = this.state;

    let prefix = await this.prefix();
    let separator = await this.separator();
    let message = await this.message();

    let prompt = [prefix, message, separator].filter(Boolean).join(' ');
    this.state.prompt = prompt;

    let header = await this.header();
    let help = await this.error() || await this.hint();
    let body = submitted ? '' : await this.interpolate(this.state);

    let key = this.state.key = keys[index] || '';
    let input = await this.format(key);
    let footer = await this.footer();

    if (input || !help) prompt += ' ' + input;
    if (help && !prompt.includes(help)) prompt += ' ' + help;

    this.clear(size);
    this.write([header, prompt, body, footer].filter(Boolean).join('\n'));
    this.restore();
  }

  getItem(name) {
    let item = this.state.items.find(ch => ch.name === this.state.keys[this.state.index]);
    if (item && item.input != null) {
      this.input = item.input;
      this.cursor = item.cursor;
    }
    return item;
  }

  async submit() {
    let result = colors.unstyle(await this.interpolate(this.state, true));
    let values = this.state.values;
    this.value = { values, result };
    return super.submit();
  }
}

module.exports = SnippetPrompt;
