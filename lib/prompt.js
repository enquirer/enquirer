'use strict';

const action = require('./action');
const ansi = require('./style/ansi');
const colors = require('ansi-colors');
const Events = require('events');
const keypress = require('./keypress');
const State = require('./state');
const styles = require('./styles');
const symbols = require('./style/symbols');
const utils = require('./utils');
const { createInterface, first, resolveValue, toValue } = utils;

class Prompt extends Events {
  constructor(options) {
    super();
    this.options = { ...options };
    this.styles = styles(this.options.styles);

    this.name = this.options.name || '';
    this.message = this.options.message || (this.name + '?');
    this.initial = this.options.initial;
    this.state = new State(this.options);

    this.keypress = this.keypress.bind(this);
    this.close = this.close.bind(this);
    this.output = this.options.output || process.stdout;
    this.input = this.options.input || process.stdin;
    this.width = this.output.colums || 80;
    this.store = this.options.store;
  }

  keypress(ch, key) {
    let k = action(keypress(ch, key));
    let fn = k.action && (this.options[k.action] || this[k.action]);
    if (typeof fn === 'function') {
      return fn.call(this, ch, k);
    }
    if (this.dispatch) {
      return this.dispatch(ch, k);
    }
    this.alert();
  }

  write(str = '') {
    if (this.isListening && this.output && this.options.show !== false) {
      this.hasRendered = true;
      this.output.write(str);
      this.state.terminal += str;
    }
  }

  clear(str = this.state.terminal) {
    this.startListening();
    this.write(this.hasRendered ? ansi.clear(str, this.width) : ansi.cursor.hide);
    this.state.terminal = '';
  }

  alert() {
    this.write(ansi.bell);
  }

  tab() {
    return this.next();
  }
  shiftTab() {
    return this.prev();
  }

  close() {
    if (!this.isListening) return;
    this.state.closed = true;
    this.write(`\n${ansi.cursor.show}`);
    this.emit('close', this);
    this.stopListening();
  }

  cancel() {
    this.state.cancelled = true;
    this.emit('cancel', this.state.error, this);
    this.close();
  }

  submit() {
    this.state.answered = this.state.submitted = true;
    this.close();
    this.emit('submit', this.state.value, this);
  }

  // render() {
  //   return this.cancel(new Error('expected prompt to have a custom .render() method'));
  // }

  renderHeader() {
    let header = resolveValue(this, this.options.header);
    return header ? header + '\n' : '';
  }

  renderPrefix() {
    let prefix = resolveValue(this, this.options.prefix);
    let str = prefix || symbols.prefix[this.status];
    return str ? (str + ' ') : '';
  }

  renderMessage(typed = '', help = '') {
    let prefix = this.renderPrefix();
    let message = toValue(this, 'message');
    let separator = this.renderSeparator();
    let output = prefix + colors.bold(message.trim()) + separator;
    if (typed) output += typed;
    if (help) output += help;
    return output;
  }

  renderSeparator() {
    let symbol = symbols.separator;
    let separator = resolveValue(this, this.options.separator);
    let str = separator || symbol[this.status] || symbol.default;
    return str ? (' ' + colors.dim(str) + ' ') : '';
  }

  renderPrompt({ prefix, message, separator } = this.state) {
    return `${prefix}${message} ${separator}`.trim() + ' ';
  }

  renderInput() {
    let { typed, hint, answered } = this.state;
    return answered ? colors.cyan(typed || this.initial) : splice(typed, this.initial);
  }

  renderHelp(help) {
    let hint = first(this.error, help, this.hint);
    if (!this.answered && hint) {
      return resolveValue(this, hint);
    }
    return '';
  }

  renderFooter() {
    let footer = this.footer;
    if (!this.answered && footer && this.list.length < this.choices.length) {
      footer = resolveValue(this, footer);
      return footer ? '\n' + footer : '';
    }
    return '';
  }

  render() {
    this.clear();
    this.write(this.renderPrompt());
    this.write(this.renderInput());

    if (!this.initial && this.state.hint) {
      this.write(this.styles.hint(this.state.hint));
    }
  }

  startListening() {
    if (this.isListening) return;
    this.isListening = true;
    this.render();
    let stop = keypress.listen(this.input, this.keypress.bind(this));
    this.stopListening = () => {
      this.isListening = false;
      stop();
    };
  }

  initialize() {
    this.startListening();
    return this.render();
  }

  run() {
    return new Promise(async(resolve, reject) => {
      this.once('submit', resolve);
      this.once('cancel', reject);
      await this.initialize();
      this.emit('run');
    });
  }
}

function splice(typed = '', initial = '') {
  if (typed && initial && initial.startsWith(typed)) {
    return typed + colors.dim(initial.slice(typed.length));
  }
  return typed || colors.dim(initial);
}

module.exports = Prompt;

