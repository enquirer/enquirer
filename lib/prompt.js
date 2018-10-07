'use strict';

const Events = require('events');
const colors = require('ansi-colors');
const State = require('./state');
const prompts = require('./prompts');
const defaults = require('./defaults');
const utils = require('./utils');
const { ansi, theme } = require('./style');

class Prompt extends Events {
  constructor(options = {}) {
    super();
    this.type = options.type;
    this.name = options.name;
    this.options = utils.mixin({ ...defaults }, options);
    theme(this);
    this.validate = this.options.validate.bind(this);
    this.initial = this.options.initial;
    this.stdout = this.options.stdout;
    this.stdin = this.options.stdin;
    this.state = new State(this);
    this.buffer = '';

    for (let key of Object.keys(options)) {
      let val = options[key];
      if (typeof this[key] === 'function' && typeof val === 'function') {
        this[key] = val.bind(this);
      }
    }
  }

  async keypress(s, event = {}) {
    let key = this.pressed = utils.keypress.action(s, event);
    let raw = key.raw != null ? String(key.raw) : '';
    let fn = this.options[key.action] || this[key.action] || this.dispatch;
    this.emit('state', this.state.clone());
    this.emit('keypress', s, { ...key });
    if (typeof fn === 'function') {
      return fn.call(this, raw, { ...key });
    }
    this.alert();
  }

  write(str) {
    if (!str) return;
    if (this.stdout && this.options.show !== false) {
      this.stdout.write(str);
      this.written = true;
    }
    this.buffer += str;
  }

  clear() {
    if (this.written) {
      this.stdout.write(ansi.clear(this.buffer, this.width));
    }
    this.buffer = '';
  }

  resetCursor() {
    let value = -colors.unstyle(this.format(this.value) || '');
    return ansi.cursor.move(value.length + this.cursor);
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
          return;
        }
        await this.initialize();
        this.emit('run');
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

  get width() {
    return this.options.columns || utils.width(this.stdout, 80);
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

  get base() {
    return Prompt.prototype;
  }

  static start(stream, onKeypress) {
    return utils.keypress.listen(stream, onKeypress);
  }

  static prompt(options) {
    return new this(options).run();
  }
}

for (let name of Object.keys(prompts)) {
  Prompt[name.toLowerCase()] = options => new prompts[name](options).run();
}

utils.mixinEmitter(Prompt, new Events());
module.exports = Prompt;
