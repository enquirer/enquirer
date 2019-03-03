'use strict';

const placeholder = require('../placeholder');
const actions = require('../actions/');
const Prompt = require('../prompt');
const { isPrimitive } = require('../utils');

class StringPrompt extends Prompt {
  constructor(options) {
    super(options);

    if (isPrimitive(this.initial)) {
      this.initial = String(this.initial);
      this.cursorHide();
    }

    // Support cut and paste actions
    this.shift = {};
    this.shift.reset = () => {
      this.shift.first = null;
      this.shift.start = 0;
      this.shift.end = 0;
    };

    this.state.prevCursor = 0;
    this.state.clipboard = [];
    this.shift.reset();

    for (let key of Object.keys(actions.string)) {
      this[key] = (...args) => {
        return actions.string[key](this, ...args);
      };
    }
  }

  async keypress(input, key = {}) {
    let prev = this.state.prevKeypress;
    this.state.prevKeypress = key;
    if (this.options.multiline === true && key.name === 'return') {
      if (!prev || prev.name !== 'return') {
        return this.append('\n', key);
      }
    }

    let fn = await super.keypress(input, key);

    // handle shiftLeft + shiftRight
    let shiftKey = ['left', 'right'].includes(key.name) && key.shift === true;
    let ctrlKey = ['copy', 'cut', 'paste'].includes(key.action) && key.ctrl === true;
    key = this.state.keypress;

    if (!shiftKey && !ctrlKey) {
      let { start, end, first } = this.shift;
      if (first !== null) {
        if (key.name === 'left' || key.name === 'right') {
          this.cursor = key.name === 'left' ? start : end;
        }
        this.shift.reset();
        await this.render();
      }
    }

    return fn;
  }

  moveCursor(n) {
    this.cursor += n;
  }

  dispatch(input, key) {
    if (!input || key.ctrl || key.code) return this.alert();
    return this.append(input);
  }

  isValue(value) {
    return !!value;
  }

  async format(input = this.value) {
    let initial = await this.resolve(this.initial, this.state);
    if (!this.state.submitted) {
      return placeholder(this, { input, initial, pos: this.cursor });
    }
    return this.styles.submitted(input || initial);
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
    let help = (await this.error()) || (await this.hint());
    let footer = await this.footer();

    if (help && !output.includes(help)) output += ' ' + help;
    prompt += ' ' + output;

    this.clear(size);
    this.write([header, prompt, footer].filter(Boolean).join('\n'));
    this.restore();
  }

  get selection() {
    if (this.shift.end > this.shift.start) {
      return this.input.slice(this.shift.start, this.shift.end);
    }
    return '';
  }
}

module.exports = StringPrompt;
