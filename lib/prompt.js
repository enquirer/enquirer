'use strict';

const Events = require('events');
const action = require('./action');
const keypress = require('./keypress');
const styles = require('./style/styles');
const ansi = require('./style/ansi');
const State = require('./state');
const colors = require('ansi-colors');
const symbols = require('./style/symbols');
const utils = require('./utils');

class Prompt extends Events {
  constructor(options) {
    super();
    this.options = { ...options };
    this.name = this.options.name || '';
    this.styles = styles(this.options.styles);
    this.message = this.options.message || (this.name + '?');
    this.initial = this.options.initial;
    this.output = this.options.output || process.stdout;
    this.input = this.options.input || process.stdin;
    this.state = new State(this.options);
  }

  keypress(str, event) {
    let key = action(keypress(str, event));
    let fn = key.action && (this.options[key.action] || this[key.action]);
    if (typeof fn === 'function') {
      return fn.call(this, str, key);
    }
    if (this.dispatch) {
      return this.dispatch(str, key);
    }
    this.alert();
  }

  write(str = '') {
    if (this.output && this.options.show !== false) {
      this.hasRendered = true;
      this.output.write(str);
      this.state.terminal += str;
    }
  }

  clear(str = this.state.terminal) {
    if (!this.state.isListening) return;
    this.write(!this.hasRendered ? ansi.cursor.hide : ansi.clear(str, this.width));
    this.state.terminal = '';
  }

  alert() {
    this.write(ansi.bell);
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
    this.write(`\n${ansi.cursor.show}`);
    this.emit('close');
    this.stopListening();
  }

  submit(value) {
    if (utils.isValue(value)) this.state.value = value;
    this.state.answered = this.state.submitted = true;
    this.emit('submit', this.state.value);
    this.close();
  }

  cancel(err) {
    this.state.error = err;
    this.state.cancelled = true;
    this.emit('cancel', err);
    this.close();
  }

  renderHeader() {
    let header = utils.resolveValue(this, this.options.header);
    return header ? header + '\n' : '';
  }

  renderPrefix() {
    let prefix = utils.resolveValue(this, this.options.prefix);
    let str = prefix || symbols.prefix[this.status];
    return str ? (str + ' ') : '';
  }

  renderMessage(typed = this.renderInput(), help = this.renderHelp()) {
    let prefix = this.renderPrefix();
    let message = utils.toValue(this, 'message');
    let separator = this.renderSeparator();
    let output = prefix + colors.bold(message.trim()) + separator;
    if (typed) output += typed;
    if (help) output += help;
    return output;
  }

  renderSeparator() {
    let symbol = symbols.separator;
    let separator = utils.resolveValue(this, this.options.separator);
    return utils.pad(separator || symbol[this.status] || symbol.default, colors.dim);
  }

  renderPrompt() {
    let prefix = this.renderPrefix();
    let message = this.renderMessage();
    let separator = this.renderSeparator();
    return utils.padRight(`${prefix}${message} ${separator}`.trim());
  }

  renderInput() {
    let { initial, state } = this;
    let { answered, typed } = state;
    return answered ? colors.cyan(typed || initial) : utils.blend(typed, initial);
  }

  renderHelp(help) {
    let hint = utils.firstValue(this.error, help, this.hint);
    if (!this.answered && hint) {
      return utils.resolveValue(this, hint);
    }
    return '';
  }

  renderFooter() {
    if (this.choices && (this.items.length === this.choices.length)) return;
    if (!this.answered && this.footer) {
      return utils.newlineLeft(utils.resolveValue(this, this.footer));
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
    if (this.state.isListening) return;
    this.emit('state', this.state);
    this.render();
    let stop = keypress.listen(this.input, this.keypress.bind(this));
    this.state.isListening = true;
    this.stopListening = () => {
      this.state.isListening = false;
      stop();
    };
  }

  initialize() {
    this.startListening();
  }

  run() {
    return new Promise(async(resolve, reject) => {
      this.once('submit', resolve);
      this.once('cancel', reject);
      this.initialize();
      this.emit('run');
    });
  }

  set height(val) {
    this.state.height = val;
  }
  get height() {
    return this.options.height || this.state.height || this.output.rows || 25;
  }

  set width(val) {
    this.state.width = val;
  }
  get width() {
    return this.options.width || this.state.width || this.output.columns || 80;
  }
}

module.exports = Prompt;

