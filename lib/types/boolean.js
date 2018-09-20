'use strict';

const colors = require('ansi-colors');
const ansi = require('../style/ansi');
const Prompt = require('../prompt');

class BooleanPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.initial = this.cast(this.options.initial);
    this.value = this.initial;
  }

  dispatch(ch) {
    this.value = this.cast(ch);
    this.render();
  }

  cast(val) {
    return /^[ty1]/i.test(val);
  }

  render(help = '') {
    this.clear();
    this.write(this.renderHeader());
    this.write(this.renderMessage(colors.cyan(this.value), this.renderHelp(help)));
    this.write(this.renderFooter());
  }

  static get BooleanPrompt() {
    return BooleanPrompt;
  }
}

module.exports = BooleanPrompt;
