'use strict';

const Events = require('events');
const colors = require('ansi-colors');
const keypress = require('./keypress');
const symbols = require('./symbols');
const styles = require('./styles');
const State = require('./state');
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
    this.symbols = symbols.merge(options);
    this.styles = styles.merge(options);
    this.state = new State(this);
    this.option('validate', () => true);
    this.option('format', () => this.value);
    this.option('result', val => val);
    this.option('stdout', process.stdout);
    this.option('stdin', process.stdin);
    this.option('initial');
    this.option('scale', 1);
    this.setMaxListeners(0);
  }

  async keypress(ch, event = {}) {
    let key = this.state.keypress = keypress.action(ch, keypress(ch, event));
    this.emit('keypress', ch, { ...key });
    let fn = this.options[key.action] || this[key.action] || this.dispatch;
    if (typeof fn === 'function') {
      return fn.call(this, ch, { ...key });
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
    this.stdout.write(ansi.cursor.down(lines) + ansi.clear(buffer));
  }

  restore() {
    if (this.state.closed || this.options.show === false) return;

    let { prompt, after, rest } = this.sections();
    let { cursor, initial = '', input = '', value = '' } = this;

    let size = this.state.size = rest.length;

    input = utils.isPrimitive(input) ? String(input) : '';
    initial = utils.isPrimitive(initial) ? String(initial) : '';
    value = utils.isPrimitive(value) ? String(value) : '';

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
    this.value = this.result(this.value);

    let valid = await this.validate(this.value);
    if (valid !== true) {
      this.state.submitted = false;
      this.state.error = '\n' + this.styles.danger(this.symbols.pointer + ' ' + valid.trim());
      this.render();
      return this.alert();
    }

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
    this.write('\n');
    this.emit('close');
  }

  start() {
    if (this.stop || this.options.show === false) return;
    this.stop = keypress.listen(this.stdin, this.keypress.bind(this));
    this.on('close', this.stop);
  }

  async initialize() {
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
    let value = this.options[name] || this.symbols[name] || this.state[name];
    let val = choice && choice[name] ? choice[name] : value;
    let res = await utils.resolve(this.state, val, this.state, choice, i);
    if (!res && choice && choice[name]) {
      return utils.resolve(this.state, value, this.state, choice, i);
    }
    return res;
  }

  async prefix() {
    let element = await this.element('prefix') || this.symbols;
    if (utils.isObject(element)) element = element[this.state.status] || element.pending;
    let style = this.styles[this.state.status];
    if (!colors.hasColor(element)) {
      return style(element);
    }
    return element;
  }

  async separator() {
    let element = await this.element('separator');
    let ele = this.state.separator || element[this.state.status] || element;
    if (!colors.hasColor(ele)) {
      return this.styles.muted(ele);
    }
    return ele;
  }

  async pointer(choice, i) {
    let element = await this.element('pointer', choice, i);

    if (typeof element === 'string' && colors.hasColor(element)) {
      return element;
    }

    if (element) {
      let styles = this.styles;
      let enabled = this.index === i;
      let style = enabled ? styles.primary : val => val;
      let ele = element[enabled ? 'on' : 'off'] || element;
      let styled = !colors.hasColor(ele) ? style(ele) : ele;
      return enabled ? styled : ' '.repeat(ele.length);
    }
  }

  async indicator(choice, i) {
    let element = await this.element('indicator', choice, i);

    if (typeof element === 'string' && colors.hasColor(element)) {
      return element;
    }

    if (element) {
      let styles = this.styles;
      let enabled = choice.enabled === true;
      let style = enabled ? styles.success : styles.dark;
      let ele = element[enabled ? 'on' : 'off'] || element;
      return !colors.hasColor(ele) ? style(ele) : ele;
    }
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
    let { input, status } = this.state;
    if (!this.isValue(input) && status === 'pending') {
      return this.styles.muted(await this.element('hint'));
    }
  }

  error() {
    return !this.state.submitted ? this.state.error : '';
  }

  isValue(value) {
    return !!value;
  }

  resolve(value, ...args) {
    return utils.resolve(this, value, ...args);
  }

  option(key, fallback) {
    let value = [this.options[key], this[key], fallback].find(v => v != null);
    if (typeof value === 'function') value = value.bind(this);
    this[key] = value;
    return this;
  }

  defaults(options = {}) {
    for (let key of Object.keys(options)) {
      if (this.options[key] == null) {
        this.state[key] = options[key];
      }
    }
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
