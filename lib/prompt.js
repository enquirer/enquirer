'use strict';

const util = require('util');
const Events = require('events');
const prompts = require('./prompts');
const types = require('./types');
const utils = require('./utils');

class Prompt extends Events {
  constructor(options = {}) {
    super();
    this.keypress = this.keypress.bind(this);
    this.close = this.close.bind(this);
    this.name = options.name;
    this.hint = options.hint || '';
    this.initial = options.initial;
    this.options = { ...options };
    this.colors = utils.merge(utils.defaultColors, this.options.colors);
    this.symbols = utils.merge(utils.symbols, this.options.symbols);
    this.transform = utils.transform(this.options);
    this.scale = this.transform.scale;
    this.value = this.typed = '';
    this.terminal = '';
    this.cursor = 0;
  }

  async keypress(ch, key) {
    if (ch && ch.length > 1) {
      for (let s of [...ch]) await this.keypress(s, { ...key });
      return;
    }

    let k = this.keypressed = utils.action(utils.keypress(ch, key));
    this.emit('keypress', ch, k);
    this.state();
    if (k.action && typeof this[k.action] === 'function') {
      return await this[k.action](ch, k);
    }
    if (this.dispatch) {
      return await this.dispatch(ch, k);
    }
    this.alert();
  }

  alert(value) {
    if (this.options.show === false) {
      this.emit('alert', this.keypressed, value);
      return;
    }
    this.write(utils.ansi.beep);
    if (utils.isValue(value)) {
      this.write(value);
    }
  }

  cursorHide() {
    let hidden = this.cursorHidden;
    if (hidden !== true) {
      this.write(utils.ansi.cursor.hide);
      this.cursorHidden = true;
    }
    return () => !hidden && this.cursorShow();
  }

  cursorShow() {
    let hidden = this.cursorHidden;
    if (hidden !== false) {
      this.write(utils.ansi.cursor.show);
      this.cursorHidden = false;
    }
    return () => hidden && this.cursorHide();
  }

  clear(str = this.str) {
    this.createInterface();
    !this.hasRendered ? this.cursorHide() : this.write(utils.ansi.clear(str, this.width));
    this.str = '';
  }

  write(str = '') {
    this.hasRendered = true;
    if (this.output && this.options.show !== false) {
      this.output.write(str);
      this.str += str;
    }
  }

  renderHeader() {
    let header = utils.resolveValue(this, this.options.header);
    return header ? header + '\n' : '';
  }

  renderPrefix() {
    let prefix = utils.resolveValue(this, this.options.prefix);
    let str = prefix || this.symbols.prefix[this.status];
    return str ? (str + ' ') : '';
  }

  renderSeparator() {
    let symbol = this.symbols.separator;
    let separator = utils.resolveValue(this, this.options.separator);
    let str = separator || symbol[this.status] || symbol.default
    return str ? (' ' + this.colors.hint(str) + ' ') : '';
  }

  renderMessage(typed = '', help = '') {
    let prefix = this.renderPrefix();
    let message = utils.toValue(this, 'message');
    let separator = this.renderSeparator();
    let output = prefix + this.colors.strong(message.trim()) + separator;
    if (typed) output += typed;
    if (help) output += help;
    return output;
  }

  renderHelp(help) {
    let hint = utils.first(this.error, help, this.hint);
    if (!this.answered && hint) {
      return utils.resolveValue(this, hint);
    }
    return '';
  }

  renderFooter() {
    let footer = this.footer;
    if (!this.answered && footer && this.list.length < this.choices.length) {
      footer = utils.resolveValue(this, footer);
      return footer ? '\n' + footer : '';
    }
    return '';
  }

  tab() {
    return this.next();
  }
  shiftTab() {
    return this.prev();
  }

  render() {
    return this.cancel(new Error('expected prompt to have a custom .render() method'));
  }

  print(...args) {
    let output = `\n${util.inspect(args)}\n`;
    let render = this.render.bind(this);
    this.render = (...args) => {
      this.write(output);
      return render(...args);
    };
  }

  color(name, fn) {
    let opts = { ...this.options.colors };
    this.colors[name] = opts[name] || fn;
    return this.colors[name];
  }

  async skip() {
    if (this.options.skip === true) {
      this.value = this.options.value;
      return true;
    }
  }

  async format(value) {
    if (typeof this.options.format === 'function') {
      return this.options.format.call(this, value);
    }
    return value;
  }

  async validate(value) {
    if (typeof this.options.validate === 'function') {
      return this.options.validate.call(this, value);
    }
    return true;
  }

  async cancel(error) {
    this.answered = this.cancelled = true;
    this.emit('cancel', error);
    return this.close();
  }

  async submit(value) {
    if (utils.isValue(value)) this.value = value;
    this.submitted = true;

    if (this.closed) return;
    if (this.value === void 0) this.value = this.initial;
    if (await this.validate(this.value) === false) {
      return this.alert();
    }

    this.value = await this.format(this.value);
    this.cancelled = false;
    this.answered = true;

    await this.close();
    this.emit('submit', this.value, this);
    return this.value;
  }

  async close() {
    if (!this.rl || this.closed) return;
    this.closed = true;
    await this.render();
    this.write('\n' + utils.ansi.cursor.show);
    this.rl.close();
    this.emit('close');
  }

  createInterface() {
    if (this.initialized) return;
    this.initialized = true;
    this.hasRendered = false;
    this.closed = false;
    let opts = { input: process.stdin, output: process.stdout, ...this.options };
    this.output = opts.output;
    this.input = opts.input;
    this.input.on('keypress', this.keypress);
    this.on('close', () => this.input.removeListener('keypress', this.keypress));
    this.rl = utils.createInterface(opts);
    this.rl.on('SIGINT', this.close);
    process.on('exit', this.close);
  }

  async init() {
    utils.forwardEvents(this, this.constructor);
    for (let key of Object.keys(this.options)) {
      let val = this.options[key];
      if (typeof val === 'function') {
        let match = /^on(\w+)/gm.exec(key);
        let fn = val.bind(this);
        if (match) {
          this.on(match[1].toLowerCase(), fn);
        } else {
          this[key] = fn;
        }
      } else if (utils.isObject(this[key]) && utils.isObject(val)) {
        this[key] = utils.merge(this[key], val);
      } else if (typeof this[key] !== 'function') {
        this[key] = await val;
      }
    }
  }

  async run(options) {
    if (this.closed || options) {
      let prompt = new this.constructor(options || this.options);
      utils.forwardEvents(prompt, this);
      return prompt.run();
    }

    let promise = new Promise(async(resolve, reject) => {
      try {
        this.once('submit', resolve);
        this.once('cancel', reject);
        await this.init();
        this.createInterface();
        this.emit('run');
        if (await this.skip(this) === true) {
          this.render = () => {};
          return await this.submit();
        }
        await this.render();
      } catch (err) {
        this.cancel(err);
      }
    })
      .then(() => this.value);

    utils.forwardEvents(this, promise);
    return promise;
  }

  /**
   * Returns the current prompt state.
   * @emits `state`
   * @return {Object} Object with prompt `status`, `cursor`, `value`, `typed` and `error` (if one exists).
   * @api public
   */

  state() {
    let { status, cursor, value, typed, error } = this;
    let state = { status, cursor, value, typed, error };
    this.emit('state', state);
    return state;
  }

  get width() {
    return this.output.columns || 80;
  }

  /**
   * Get the estimated height of the terminal
   */

  get height() {
    if (this.options.rows) return this.options.rows;
    let output = this.output || process && process.stdout;
    if (output && output.rows) {
      let term = this.terminal;
      let lines = term.split('\n').length - 1;
      return output.rows - lines;
    }
    return 20;
  }

  /**
   * Returns the status of the prompt.
   * @return {String} Object with prompt `status`, `cursor`, `value`, `typed` and `error` (if one exists).
   * @api public
   */

  set status(value) {
    throw new Error('prompt.status is a getter and may not be defined');
  }
  get status() {
    if (this.cancelled) return 'cancelled';
    if (this.answered) return 'answered';
    return 'pending';
  }

  /**
   * Returns the prototype of the "base" Prompt class. This is useful for ensuring
   * that you can always get the unmodified prototype methods or properties of the
   * base class, regardless of the inheritance chain.
   */

  get base() {
    return Prompt.prototype;
  }

  static get prompt() {
    let prompt = new this();
    let run = options => utils.forwardEvents(prompt, prompt.run(options));
    Object.setPrototypeOf(run, prompt);
    return run;
  }

  static get base() {
    return Prompt;
  }

  static get prompts() {
    return prompts;
  }

  static get types() {
    return types;
  }

  static get utils() {
    return utils;
  }
}

for (let name of Object.keys(prompts)) {
  Prompt[name.toLowerCase()] = options => new prompts[name](options).run();
}

utils.mixinEmitter(Prompt, new Events());
module.exports = Prompt;

