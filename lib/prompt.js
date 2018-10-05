'use strict';

const Events = require('events');
const colors = require('ansi-colors');
const defaults = require('./defaults');
const State = require('./state');
const { keypress, mixin } = require('./utils');
const { ansi, elements, styles, symbols, transform } = require('./style');

class Prompt extends Events {
  constructor(options = {}) {
    super();
    this.name = options.name;
    this.options = mixin({ ...defaults }, options);
    this.styles = styles.mixin(this.options);
    this.symbols = symbols.mixin(this.options);
    this.elements = elements(this);
    this.transform = transform(this);
    this.scale = this.transform.scale;
    this.validate = this.options.validate.bind(this);
    this.initial = this.options.initial;
    this.stdout = this.options.stdout;
    this.stdin = this.options.stdin;
    this.state = new State(this);
    this.history = [this.state];
    this.buffer = '';
    this.on('state', state => this.history.push(state));
  }

  async keypress(s, event = {}) {
    let key = this.pressed = keypress.action(s, event);
    let raw = key.raw != null ? String(key.raw) : '';
    let fn = this.options[key.action] || this[key.action] || this.dispatch;
    this.emit('keypress', key.raw, { ...key });
    this.emit('state', this.state.clone());
    if (typeof fn === 'function') {
      return fn.call(this, raw, { ...key });
    }
    this.alert();
  }

  write(str) {
    if (!str) return;
    this.buffer += str;
    if (this.stdout && this.options.show !== false) {
      this.stdout.write(str);
      this.written = true;
    }
  }

  clear() {
    if (this.written) {
      this.stdout.write(ansi.clear(colors.unstyle(this.header())));
      this.stdout.write(ansi.erase.down);
    }
    this.buffer = '';
  }

  alert() {
    this.emit('alert', this.pressed);
    if (this.options.show !== false) {
      this.stdout.write(ansi.bell);
    }
  }

  async submit() {
    if (this.value === void 0) this.value = this.initial;
    if ((await this.validate(this.value)) === false) {
      return this.alert();
    }
    this.answered = true;
    this.value = await this.transform.result(this.value, this);
    await this.render();
    this.write('\n');
    this.close();
    this.emit('submit', this.value);
  }

  async cancel() {
    this.cancelled = this.answered = true;
    await this.render();
    this.close();
    this.emit('cancel', this.error());
  }

  async close() {
    if (this.closed) return;
    this.closed = true;
    this.emit('close');
    this.stop();
  }

  start() {
    if (this.stopListening) return;
    this.stopListening = this.constructor.start(this.stdin, this.keypress.bind(this));
  }

  stop() {
    this.stopListening && this.stopListening();
  }

  skip() {
    if (this.options.answered) {
      this.value = this.options.value;
      return true;
    }
    return false;
  }

  render() {
    throw new Error('expected prompt to have a custom .render() method');
  }

  async initialize() {
    this.initialState = this.state.clone();
    await this.render();
    this.rendered = true;
    await this.start();
  }

  run() {
    return new Promise(async(resolve, reject) => {
      try {
        this.once('cancel', reject);
        this.once('submit', resolve);
        if ((await this.skip()) === true) {
          await this.submit();
        } else {
          await this.initialize();
          this.emit('run');
        }
      } catch (err) {
        console.error(err);
        reject(err);
        this.stop();
      }
    });
  }

  footer(value = this.state.footer) {
    return value ? '\n' + value : '';
  }
  header(value = this.state.header) {
    return value ? value + '\n' : '';
  }
  hint() {
    return !this.answered && !this.input && !this.initial && this.element('hint');
  }
  error() {
    return !this.answered ? this.styles.danger(this.state.error) : '';
  }

  resetCursor() {
    let { cursor, separator } = this.state;

    let header = colors.unstyle(this.header());
    let buffer = colors.unstyle(this.buffer);
    let prompt = buffer.slice(header.length);
    let first = prompt.slice(0, prompt.indexOf('\n'));
    let idx = prompt.indexOf(separator);
    let after = prompt.slice(idx);
    let lines = after.split('\n');
    let last = lines[lines.length - 1];
    let len = lines.length;
    let n = Math.max(Math.ceil(first.length / this.stdout.columns) - 1, 0);

    for (let line of lines) {
      len += Math.max(Math.ceil(line.length / this.stdout.columns) - 1, 0);
    }

    if (len > 1) {
      len += n;
      return ansi.cursor.move(idx + cursor + 2 - last.length, -len + 1);
    }

    return ansi.cursor.move(-after.length + cursor + 2, -n);
  }

  format(value = this.value) {
    return this.transform.format(value, this);
  }

  element(name, state = this.state, status = this.status) {
    if (Array.isArray(name)) {
      return name.map(n => this.element(n, state, status)).join(' ');
    }
    let ele = this.elements[name] || state[name];
    if (ele) {
      let val = ele[status] || ele.default || ele;
      if (typeof val === 'function') {
        return val.call(this, state, status, this.focused);
      }
      return val;
    }
  }

  cursorHide() {
    ansi.cursor.hide(this.stdout);
  }

  cursorShow() {
    ansi.cursor.show(this.stdout);
  }

  isValue(value) {
    return !!value;
  }

  set value(value) {
    this.state.value = value;
  }
  get value() {
    return [this.state.value, this.input, this.initial].find(this.isValue);
  }

  set input(input) {
    this.state.input = input;
  }
  get input() {
    return this.state.input;
  }

  set cursor(i) {
    this.state.cursor = i;
  }
  get cursor() {
    return Math.max(0, this.state ? this.state.cursor : 0);
  }

  set status(val) {
    this._status = val;
  }
  get status() {
    if (this.cancelled) return 'cancelled';
    if (this.answered) return 'answered';
    if (this._status) return this._status;
    return 'pending';
  }

  static start(stream, onKeypress) {
    return keypress.listen(stream, onKeypress);
  }
}

module.exports = Prompt;
