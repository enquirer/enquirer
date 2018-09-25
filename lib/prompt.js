'use strict';

const noop = val => val;
const Events = require('events');
const colors = require('ansi-colors');
const readline = require('readline');
const keypress = require('./keypress');
const elements = require('./style/elements');
const defaults = require('./defaults');
const style = require('./style');
const State = require('./state');
const { ansi, hide, show, onExit, merge } = require('./utils');

class Prompt extends Events {
  constructor(options = {}) {
    super();
    this.options = Object.freeze(merge(defaults, options));
    this.name = options.name;
    this.symbols = style.symbols.merge(options);
    this.styles = style.styles.merge(options);
    this.elements = elements(this);
    this.state = new State(this);
    this.stdout = options.output || process.stdout;
    this.stdin = options.input || process.stdin;
    this.bindListeners(options);
  }

  async keypress(s, event) {
    let key = keypress.action(s, event);
    let fn = this.options[key] || this[key] || this.dispatch;
    this.emit('keypress', s, { ...key });
    if (typeof fn === 'function') {
      return fn.call(this, s, event);
    }
    this.alert();
  }

  write(str) {
    if (str && this.stdout && this.options.show !== false) {
      this.rendered = true;
      this.state.terminal += str;
      this.stdout.write(str);
    }
    this.emit('state', { ...this.state });
  }

  clear(str = this.state.terminal) {
    if (!this.rendered) return this.cursorHide();
    if (!str) return;
    this.write(ansi.clear(str, this.body));
    this.emit('terminal', str);
    this.state.terminal = '';
    this.state.rows = [];
  }

  alert() {
    this.write(ansi.bell);
  }

  cursorHide() {
    // hide(this.stdout);
  }

  cursorShow() {
    show(this.stdout);
  }

  cancel(error = this.error) {
    this.cancelled = true;
    this.close();
    this.emit('cancel', (this.error = error));
  }

  submit(value = this.value) {
    this.answered = true;
    this.close();
    this.emit('submit', (this.value = value));
  }

  close() {
    this.closed = true;
    this.render();
    let rest = this.render;
    let term = colors.unstyle(this.state.terminal);
    let lines = term.split('\n');
    let line = lines.pop();
    let min = lines.length ? 2 : 1;
    let chars = Math.ceil(line.length / this.stdout.columns);
    this.write('\n'.repeat(Math.max(Math.floor(chars), min)));
    this.stop && this.stop();
    this.emit('close');
  }

  start() {
    this.stop = keypress.listen(this.stdin, this.keypress.bind(this));
    onExit(this.stop);
  }

  initialize() {
    return this.render();
  }

  render() {
    throw new Error('expected prompt to have a custom .render() method');
  }

  run() {
    return new Promise(async(resolve, reject) => {
      try {
        this.once('cancel', reject);
        this.once('submit', resolve);
        this.emit('run');
        await this.initialize();
        await this.start();
      } catch (err) {
        this.stop && this.stop();
        reject(err);
      }
    });
  }

  element(name, status = this.status) {
    let ele = this.elements[name];
    if (ele) {
      let val = ele[status] || ele.default || ele;
      if (typeof val === 'function') {
        return val.call(this, this.state, status, this.focused);
      }
      return val;
    }
  }

  bindListeners(options = this.options) {
    this.once('run', this.bind(options.run));
    this.once('submit', this.bind(options.submit));
    this.once('cancel', this.bind(options.cancel));
    this.once('close', this.bind(options.close));
    this.on('keypress', this.bind(options.keypress));
    this.on('clear', this.bind(options.terminal));
    this.on('state', this.bind(options.state));
  }

  bind(fn = noop) {
    return fn.bind(this);
  }

  get base() {
    return Prompt.prototype;
  }

  set status(val) {
    this._status = val;
  }
  get status() {
    if (this.cancelled) return 'cancelled';
    if (this.answered) return 'answered';
    if (this._status) return this._status;
    if (this.completing) return 'completing';
    if (this.typing) return 'typing';
    return 'pending';
  }

  set initial(val) {
    this.state.initial = val;
  }
  get initial() {
    return this.state ? this.state.initial : this.options.initial;
  }

  set value(val) {
    this.state.value = val;
  }
  get value() {
    return this.state.value || (this.state.value = this.state.typed || this.initial);
  }
}

function render(prompt) {
  let fn = prompt.render.bind(prompt);

  prompt.render = (...args) => {
    prompt.clear();
    prompt[prompt.options.hideCursor ? 'cursorHide' : 'cursorShow']();
    fn(...args);

    let input = prompt.renderInput();
    let body = prompt.renderBody();
    let value = [input, body].filter(Boolean).join(' ');
    let pos = prompt.state.cursor;

    if (!body) {
      prompt.write(ansi.cursor.restore(value, pos));
      return;
    }

    let out = prompt.renderPrompt();
    let lines = (value.match(/\n/g) || []).length;
    let raw = colors.unstyle(out);
    let len = -(lines || 1);

    readline.moveCursor(prompt.output, -prompt.output.columns);
    prompt.write(ansi.cursor.up(lines));
    prompt.write(ansi.cursor.right(raw.length + 3 + pos));
  };
}

module.exports = Prompt;
