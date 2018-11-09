'use strict';

const Events = require('events');
const colors = require('ansi-colors');
const keypress = require('./keypress');
const timer = require('./timer');
const State = require('./state');
const theme = require('./theme');
const utils = require('./utils');
const ansi = require('./ansi');

/**
 * Base class for creating a new Prompt.
 * @param {Object} `options` Question object.
 */

class Prompt extends Events {
  constructor(options = {}) {
    super();
    this.name = options.name;
    this.type = options.type;
    this.options = options;
    theme(this);
    timer(this);
    this.state = new State(this);
    this.initial = [options.initial, options.default].find(v => v != null);
    this.stdout = options.stdout || process.stdout;
    this.stdin = options.stdin || process.stdin;
    this.scale = options.scale || 1;
    this.validate = (this.options.validate || this.validate).bind(this);
    this.format = (this.options.format || this.format).bind(this);
    this.result = (this.options.result || this.result).bind(this);
    this.render = (this.options.render || this.render).bind(this);
    this.setMaxListeners(0);
  }

  async keypress(ch, event = {}) {
    let key = keypress.action(ch, keypress(ch, event), this.options.actions);
    this.state.keypress = key;
    this.emit('state', this.state.clone());
    let fn = this.options[key.action] || this[key.action] || this.dispatch;
    if (typeof fn === 'function') {
      return fn.call(this, ch, key);
    }
    this.alert();
  }

  alert() {
    if (this.options.show === false) {
      this.emit('alert');
    } else {
      this.stdout.write(ansi.code.beep);
    }
  }

  cursorHide() {
    this.stdout.write(ansi.cursor.hide());
    utils.onExit(() => this.cursorShow());
  }

  cursorShow() {
    this.stdout.write(ansi.cursor.show());
  }

  write(str) {
    if (!str) return;
    if (this.stdout && this.state.show !== false) {
      this.stdout.write(str);
    }
    this.state.buffer += str;
  }

  clear(lines = 0) {
    let buffer = this.state.buffer;
    this.state.buffer = '';
    if ((!buffer && !lines) || this.options.show === false) return;
    this.stdout.write(ansi.cursor.down(lines) + ansi.clear(buffer, this.width));
  }

  restore() {
    if (this.state.closed || this.options.show === false) return;

    let { prompt, after, rest } = this.sections();
    let { cursor, initial = '', input = '', value = '' } = this;

    let size = this.state.size = rest.length;
    let state = { after, cursor, initial, input, prompt, size, value };
    let codes = ansi.cursor.restore(state);
    if (codes) {
      this.stdout.write(codes);
    }
  }

  sections() {
    let { buffer, input, prompt } = this.state;
    prompt = colors.unstyle(prompt);
    let buf = colors.unstyle(buffer);
    let idx = buf.indexOf(prompt);
    let header = buf.slice(0, idx);
    let rest = buf.slice(idx);
    let lines = rest.split('\n');
    let first = lines[0];
    let last = lines[lines.length - 1];
    let promptLine = prompt + (input ? ' ' + input : '');
    let len = promptLine.length;
    let after = len < first.length ? first.slice(len + 1) : '';
    return { header, prompt: first, after, rest: lines.slice(1), last };
  }

  async submit() {
    this.state.submitted = true;
    this.state.validating = true;

    let result = this.state.error || await this.validate(this.value, this.state);
    if (result !== true) {
      let error = this.symbols.pointer + ' ' + result.trim();
      this.state.error = '\n' + this.styles.danger(error);
      this.state.submitted = false;
      await this.render();
      await this.alert();
      this.state.validating = false;
      this.state.error = void 0;
      return;
    }

    this.state.validating = false;
    this.value = this.result(this.value);
    await this.render();
    await this.close();
    this.emit('submit', this.value);
  }

  async cancel() {
    this.state.cancelled = this.state.submitted = true;
    await this.render();
    await this.close();
    this.emit('cancel', await this.error());
  }

  async close() {
    this.state.closed = true;

    try {
      let sections = this.sections();
      let lines = Math.ceil(sections.prompt.length / this.width);
      if (sections.rest) {
        this.write(ansi.cursor.down(sections.rest.length));
      }
      this.write('\n'.repeat(lines));
    } catch (err) { /* do nothing */ }

    this.emit('close');
  }

  start() {
    if (!this.stop && this.options.show !== false) {
      this.stop = keypress.listen(this.stdin, this.keypress.bind(this));
      this.on('close', this.stop);
    }
  }

  async initialize() {
    if (typeof this.options.initial === 'function') {
      this.initial = await this.options.initial.call(this);
    }
    await this.start();
    await this.render();
  }

  render() {
    throw new Error('expected prompt to have a custom render method');
  }

  run() {
    return new Promise(async(resolve, reject) => {
      this.once('cancel', reject);
      this.once('submit', resolve);
      await this.initialize();
      this.emit('run');
    });
  }

  async element(name, choice, i) {
    let { options, state, symbols, timers } = this;
    let timer = timers && timers[name];
    state.timer = timer;
    let value = options[name] || state[name] || symbols[name];

    let val = choice && choice[name] != null ? choice[name] : value;
    if (val === '') return val;

    let res = await utils.resolve(state, val, state, choice, i);
    if (!res && choice && choice[name]) {
      return utils.resolve(state, value, state, choice, i);
    }
    return res;
  }

  async prefix() {
    let element = await this.element('prefix') || this.symbols;
    let timer = this.timers && this.timers.prefix;
    let state = this.state;
    state.timer = timer;
    if (utils.isObject(element)) element = element[state.status] || element.pending;
    if (!utils.hasColor(element)) {
      let style = this.styles[state.status] || this.styles.pending;
      return style(element);
    }
    return element;
  }

  async message() {
    let message = await this.element('message');
    if (!utils.hasColor(message)) {
      return this.styles.strong(message);
    }
    return message;
  }

  async separator() {
    let element = await this.element('separator') || this.symbols;
    let timer = this.timers && this.timers.separator;
    let state = this.state;
    state.timer = timer;
    let value = element[state.status] || element.pending || state.separator;
    let ele = await utils.resolve(state, value, state);
    if (utils.isObject(ele)) ele = ele[state.status] || ele.pending;
    if (!utils.hasColor(ele)) {
      return this.styles.muted(ele);
    }
    return ele;
  }

  async pointer(choice, i) {
    let val = await this.element('pointer', choice, i);

    if (typeof val === 'string' && utils.hasColor(val)) {
      return val;
    }

    if (val) {
      let styles = this.styles;
      let focused = this.index === i;
      let style = focused ? styles.primary : val => val;
      let ele = await this.resolve(val[focused ? 'on' : 'off'] || val, this.state);
      let styled = !utils.hasColor(ele) ? style(ele) : ele;
      return focused ? styled : ' '.repeat(ele.length);
    }
  }

  async indicator(choice, i) {
    let val = await this.element('indicator', choice, i);

    if (typeof val === 'string' && utils.hasColor(val)) {
      return val;
    }

    if (val) {
      let styles = this.styles;
      let enabled = choice.enabled === true;
      let style = enabled ? styles.success : styles.dark;
      let ele = val[enabled ? 'on' : 'off'] || val;
      return !utils.hasColor(ele) ? style(ele) : ele;
    }

    return '';
  }

  body() {
    return null;
  }

  footer() {
    if (this.state.status === 'pending') {
      return this.element('footer');
    }
  }

  header() {
    if (this.state.status === 'pending') {
      return this.element('header');
    }
  }

  async hint() {
    if (this.state.status === 'pending' && !this.isValue(this.state.input)) {
      let hint = await this.element('hint');
      if (!utils.hasColor(hint)) {
        return this.styles.muted(hint);
      }
      return hint;
    }
  }

  error() {
    return !this.state.submitted ? this.state.error : '';
  }

  format(value) {
    return value;
  }

  result(value) {
    return value;
  }

  validate() {
    return true;
  }

  isValue(value) {
    return value != null && value !== '';
  }

  resolve(value, ...args) {
    return utils.resolve(this, value, ...args);
  }

  get base() {
    return Prompt.prototype;
  }

  get style() {
    return this.styles[this.state.status];
  }

  get height() {
    return this.options.rows || utils.height(this.stdout, 25);
  }
  get width() {
    return this.options.columns || utils.width(this.stdout, 80);
  }

  set cursor(value) {
    this.state.cursor = value;
  }
  get cursor() {
    return this.state.cursor;
  }

  set input(value) {
    this.state.input = value;
  }
  get input() {
    return this.state.input;
  }

  set value(value) {
    this.state.value = value;
  }
  get value() {
    return [this.state.value, this.input, this.initial].find(this.isValue.bind(this));
  }

  static get prompt() {
    return options => new this(options).run();
  }
}

module.exports = Prompt;
