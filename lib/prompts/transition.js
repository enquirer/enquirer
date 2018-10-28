'use strict';

const colors = require('ansi-colors');
const Prompt = require('./input');

class Transition extends Prompt {
  constructor(options) {
    super(options);
    this.cursorHide();
    this.state.hint = '(Press <return> to continue)';
    this.increment = this.options.increment || 1000;
    this.countdown = this.options.countdown || 5;
    this.numbers = this.symbols.numbers || [];
  }

  separator() {
    return colors.cyan(this.countdown);
  }

  message() {
    return colors.bold('Next question in');
  }

  prefix() {
    return this.styles.primary(this.symbols.bulletWhite);
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
