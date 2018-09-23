
const noop = val => val;
const Events = require('events');
const colors = require('ansi-colors');
const readline = require('readline');
const keypress = require('./keypress');
const style = require('./style');
const State = require('./state');
const { hide, show, onExit } = require('./utils');
const { ansi } = style;

class Prompt extends Events {
  constructor(options = {}) {
    super();
    this.options = { ...options };
    this.name = options.name;
    this.symbols = style.symbols(options);
    this.styles = style.styles(options);
    this.initial = options.initial;
    this.output = options.output || process.stdout;
    this.input = options.input || process.stdin;
    this.state = new State(this);
    this.bindListeners(options);
  }

  async keypress(s, event) {
    let key = keypress.action(event);
    let fn = this.options[key] || this[key] || this.dispatch;
    this.emit('keypress', s, { ...key });
    if (typeof fn === 'function') {
      return fn.call(this, s, event);
    }
    this.alert();
  }

  write(str) {
    if (str && this.output && this.options.show !== false) {
      this.rendered = true;
      this.state.terminal += str;
      this.output.write(str);
    }
    this.emit('state', { ...this.state });
  }

  alert() {
    this.write(ansi.bell);
  }

  cursorHide() {
    hide(this.output);
  }

  cursorShow() {
    show(this.output);
  }

  clear(str = this.state.terminal) {
    if (!this.rendered) return this.cursorHide();
    if (!str) return;
    this.write(ansi.clear(str, this.body));
    this.emit('terminal', str);
    this.state.terminal = '';
    this.body = '';
  }

  cancel(error = this.error) {
    this.cancelled = this.answered = true;
    this.close();
    this.emit('cancel', (this.error = error));
  }

  submit(value = this.value) {
    this.submitted = this.answered = true;
    this.close();
    this.emit('submit', (this.value = value));
  }

  close() {
    this.render();
    let rest = this.render
    let term = colors.unstyle(this.state.terminal);
    let lines = term.split('\n');
    let line = lines.pop();
    let min = lines.length ? 2 : 1;
    let chars = Math.ceil(line.length / this.output.columns);
    this.write('\n'.repeat(Math.max(Math.floor(chars), min)));
    this.stop && this.stop();
    this.emit('close');
  }

  start() {
    this.stop = keypress.listen(this.input, this.keypress.bind(this));
    onExit(this.stop);
  }

  render() {
    throw new Error('expected prompt to have a custom .render() method');
  }

  run() {
    let render = this.render;
    this.render = (...args) => {
      this.clear();
      this[this.options.hideCursor ? 'cursorHide' : 'cursorShow']();

      render.call(this, ...args);
      let input = this.renderInput();
      let body = this.renderBody();
      let value = [input, body].filter(Boolean).join(' ');
      let pos = this.state.cursor;

      if (!body) {
        this.write(ansi.cursor.restore(value, pos));
        return;
      }

      let prompt = this.renderPrompt();
      let lines = (value.match(/\n/g) || []).length;
      let raw = colors.unstyle(prompt);
      let len = -(lines ? lines : 1);

      readline.moveCursor(this.output, -this.output.columns);
      this.write(ansi.cursor.up(lines));
      this.write(ansi.cursor.right(raw.length + 3 + pos));
    };

    return new Promise(async(resolve, reject) => {
      try {
        this.once('cancel', reject);
        this.once('submit', resolve);
        this.emit('run');
        this.render();
        this.start();
      } catch (err) {
        this.stop && this.stop();
        reject(err);
      }
    });
  }

  bind(fn = noop) {
    return fn.bind(this);
  }

  bindListeners(options = this.options) {
    this.once('run', this.bind(options.run));
    this.once('submit', this.bind(options.submit));
    this.once('cancel', this.bind(options.cancel));
    this.once('close', this.bind(options.close));
    this.on('terminal', this.bind(options.terminal));
    this.on('keypress', this.bind(options.keypress));
    this.on('state', this.bind(options.state));
  }

  set value(val) {
    this.state.value = val;
  }
  get value() {
    return this.state.value || (this.state.value = this.state.typed || this.initial);
  }
}

module.exports = Prompt;
