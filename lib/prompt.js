'use strict';

const Events = require('events');
const ansi = require('./style/ansi');
const keypress = require('./keypress');
const action = require('./action');
const styles = require('./styles');
const State = require('./state');

class Prompt extends Events {
  constructor(options) {
    super();
    this.options = { ...options };
    this.styles = styles(this.options.styles);

    this.name = this.options.name || '';
    this.message = this.options.message || (this.name + '?');
    this.initial = this.options.initial;
    this.state = new State(this.options);

    this.stdout = this.options.stdout || process.stdout;
    this.stdin = this.options.stdin || process.stdin;
    this.width = this.stdout.colums || 80;
  }

  keypress(ch, key) {
    let k = action(keypress(ch, key));
    console.log(k)
    let fn = k.action && (this.options[k.action] || this[k.action]);
    if (typeof fn === 'function') {
      return fn.call(this, ch, k);
    }
    if (this.dispatch) {
      return this.dispatch(ch, k);
    }
    this.alert();
  }

  startListening() {
    this.render();
    this.stopListening = keypress.listen(this.stdin, this.keypress.bind(this));
  }

  write(str = '') {
    if (this.options.show !== false) {
      this.stdout.write(str);
      this.state.terminal += str;
    }
  }

  alert() {
    this.write(ansi.bell);
  }

  close() {
    this.state.answered = true;
    this.render();
    this.write('\n');
    this.write(ansi.cursor.show);
    this.stopListening && this.stopListening();
  }

  cancel() {
    this.state.cancelled = true;
    this.close();
    this.emit('cancel', this.state.error);
  }

  submit() {
    this.state.submitted = true;
    this.close();
    this.emit('submit', this.state.value);
  }

  clear() {
    this.stdout.write(ansi.clear(this.state.terminal, this.width));
    this.state.terminal = '';
  }

  entered({ answered, typed } = this.state) {
    return answered ? this.styles.answered(typed) : typed;
  }

  renderPrompt({ prefix, message, separator } = this.state) {
    this.write(`${prefix} ${message} ${separator}`.trim() + ' ');
  }

  render() {
    this.clear();
    this.renderPrompt();
    this.write(this.entered());
  }

  initialize() {
    this.render();
  }

  skip() {
    return false;
  }

  run() {
    return new Promise((resolve, reject) => {
      this.once('submit', resolve);
      this.once('cancel', reject);
      this.initialize();
      this.startListening();
      this.emit('run');
    });
  }
}

module.exports = Prompt;
