'use strict';

const colors = require('ansi-colors');
const symbols = require('./style/symbols');
const Prompt = require('./prompt');
const utils = require('./utils');

class Render extends Prompt {
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
    let hint = utils.utils.first(this.error, help, this.hint);
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
}

module.exports = Render;
