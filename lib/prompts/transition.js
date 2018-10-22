'use strict';

const colors = require('ansi-colors');
const Prompt = require('./input');
const ansi = require('../ansi');

class Transition extends Prompt {
  constructor(options) {
    super(options);
    this.cursorHide();
    this.state.hint = '(Press <return> to continue)';
    this.numbers = this.options.numbers || Array(100).map((v, i) => i);
    this.increment = this.options.increment || 1000;
    this.countdown = this.options.countdown || 10;
  }

  separator() {
    return '';
  }

  message() {
    return colors.bold('Next question in ' + colors.cyan(this.countdown));
  }

  prefix() {
    return this.styles.primary(this.symbols.pointRight);
  }

  format() {
    return this.styles.muted(this.state.hint);
  }

  async close() {
    clearInterval(this.interval);
    this.cursorShow();
    this.clear();
    this.state.closed = true;
    this.emit('close');
  }

  run() {
    this.interval = setInterval(async() => {
      this.countdown--;
      await this.render();
      if (this.countdown === 0) {
        clearInterval(this.interval);
        await this.submit();
      }
    }, this.increment);
    return super.run();
  }
}

module.exports = Transition;
