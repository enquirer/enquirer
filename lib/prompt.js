'use strict';

const Events = require('events');
const colors = require('ansi-colors');
const transform = require('./style/transform');
const symbols = require('./style/symbols');
const styles = require('./style/styles');
const ansi = require('./style/ansi');
const keypress = require('./keypress');
const keymap = require('./keymap');
const State = require('./state');
const utils = require('./utils');

class Prompt extends Events {
  constructor(options = {}) {
    super();
    this.options = { ...options };

    this.name = options.name || options.message || options.title || '';
    this.message = options.message || this.name || '';
    this.initial = options.initial;

    this.input = options.input || process.stdin;
    this.output = options.output || process.stdout;

    this.transform = transform(this.options.transform);
    this.symbols = symbols(this.options.symbols);
    this.styles = styles(this.options.styles);

    this.state = new State(options);
    // this.prefix = this.state.prefix || colors.cyan(this.symbols.questionSmall);
    // this.separator = this.state.separator || colors.dim(this.symbols.ellipsis);
  }

  async keypress(ch, event) {
    let key = keymap(keypress(ch, event));
    this.emit('keypress', ch, key);
    if (typeof this.options[key.action] === 'function') {
      return this.options[key.action].call(this, ch, key);
    }
    if (typeof this[key.action] === 'function') {
      return this[key.action].call(this, ch, key);
    }
    if (this.dispatch) {
      return this.dispatch(ch, key);
    }
    this.alert();
  }

  write(str = '') {
    if (this.output && this.options.show !== false) {
      this.state.hasRendered = true;
      let output = this.resolve(str);
      if (output) {
        this.output.write(output);
        this.state.terminal += output;
      }
    }
  }

  clear(str = this.state.terminal) {
    if (!this.state.isListening) return;
    if (!this.state.hasRendered) return this.write(ansi.cursor.hide);
    this.write(ansi.clear(str, this.cols));
    this.state.terminal = '';
  }

  alert() {
    this.write(ansi.bell);
  }

  render(help = '') {
    let { state, value = '' } = this;
    this.clear();
    this.write(ansi.cursor.show);
    this.write([state.prefix, state.message, state.separator, value]);
    this.write(ansi.cursor.move(-colors.unstyle(value).length + state.cursor));
  }

  tab() {
    this.next();
  }
  shiftTab() {
    this.prev();
  }

  close() {
    if (this.state.isListening !== true) return;
    this.state.closed = true;
    this.render();
    this.write(`\n${ansi.cursor.show}`);
    this.emit('close');
    this.stopListening();
  }

  cancel(err) {
    this.state.error = err;
    this.state.cancelled = true;
    this.emit('cancel', err);
    this.close();
  }

  async submit(value) {
    this.state.answered = true;
    this.value = await this.format(utils.first([value, this.value, this.initial]));
    if ((await (this.validate(this.value)) === false)) {
      return this.alert();
    }
    this.emit('submit', this.value);
    this.close();
  }

  validate(value) {
    if (this.options.required === true && value === void 0) {
      return false;
    }
    return this.option('validate', value, true);
  }

  format(value) {
    return this.option('format', value);
  }

  startListening() {
    if (this.state.isListening || this.state.submitted) return;
    let state = () => this.emit('state', this.state);
    this.on('keypress', state);
    state();

    this.state.isListening = true;
    let stop = keypress.listen(this.input, this.keypress.bind(this));

    this.stopListening = () => {
      this.state.isListening = false;
      this.off('keypress', state);
      stop();
    };
  }

  initialize() {
    this.render();
  }

  run() {
    return new Promise(async(resolve, reject) => {
      try {
        this.once('submit', resolve);
        this.once('cancel', reject);
        this.emit('run');
        await this.initialize();
        await this.startListening();
      } catch (err) {
        this.cancel(err);
      }
    });
  }

  option(key, value, fallback) {
    return this.resolve(utils.first([this.options[key], fallback, value]));
  }

  resolve(val = '') {
    if (Array.isArray(val)) {
      return val.map(this.resolve.bind(this)).join(' ');
    }
    return typeof val === 'function' ? val.call(this, this.state) : val;
  }

  set value(value) {
    this.state.value = value;
  }
  get value() {
    return this.state.value;
  }
}

module.exports = Prompt;
