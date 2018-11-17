'use strict';

const ArrayPrompt = require('../types/array');
const utils = require('../utils');

class SelectPrompt extends ArrayPrompt {
  constructor(options) {
    super(options);
    this.emptyError = this.options.emptyError || 'No items were selected';
  }

  async dispatch(s, key) {
    if (this.multiple) {
      return this[key.name] ? await this[key.name](s, key) : await super.dispatch(s, key);
    }
    this.alert();
  }

  separator() {
    if (this.options.separator) return super.separator();
    let sep = this.styles.muted(this.symbols.ellipsis);
    return this.state.submitted ? super.separator() : sep;
  }

  pointer(choice, i) {
    return (!this.multiple || this.options.pointer) ? super.pointer(choice, i) : '';
  }

  indicator(choice, i) {
    return this.multiple ? super.indicator(choice, i) : '';
  }

  heading(message, choice, i) {
    if (typeof this.options.heading === 'function') {
      return this.options.heading.call(this, message, choice, i);
    }
    return this.styles.strong(message);
  }

  choiceMessage(choice, i) {
    return this.resolve(choice.message, this.state, choice, i);
  }

  choiceSeparator() {
    return ':';
  }

  async renderChoice(choice, i) {
    await this.onChoice(choice, i);

    let focused = this.index === i;
    let pointer = await this.pointer(choice, i);
    let check = await this.indicator(choice, i) + (choice.pad || '');
    let hint = await this.resolve(choice.hint, this.state, choice, i);

    if (hint && !utils.hasColor(hint)) {
      hint = this.styles.muted(hint);
    }

    let ind = this.indent(choice);
    let msg = await this.choiceMessage(choice, i);
    let line = () => [ind + pointer + check, msg, hint].filter(Boolean).join(' ');

    if (choice.role === 'heading') {
      msg = this.heading(msg, choice, i);
      return line();
    }

    if (choice.disabled) {
      msg = this.styles.disabled(msg);
      return line();
    }

    if (focused) {
      msg = this.styles.heading(msg);
    }

    return line();
  }

  async renderChoices() {
    if (this.state.submitted) return '';
    let choices = this.visible.map(async(ch, i) => await this.renderChoice(ch, i));
    let visible = await Promise.all(choices);
    if (!visible.length) visible.push(this.styles.danger('No matching choices'));
    return '\n' + visible.join('\n');
  }

  format() {
    if (!this.state.submitted) return this.styles.muted(this.state.hint);
    if (Array.isArray(this.selected)) {
      return this.selected.map(choice => this.styles.primary(choice.name)).join(', ');
    }
    return this.styles.primary(this.selected.name);
  }

  async render() {
    let { submitted, size } = this.state;

    let prefix = await this.prefix();
    let separator = await this.separator();
    let message = await this.message();

    let prompt = '';
    if (this.options.promptLine !== false) {
      prompt = [prefix, message, separator, ''].join(' ');
      this.state.prompt = prompt;
    }

    let header = await this.header();
    let output = await this.format();
    let help = await this.error() || await this.hint();
    let body = await this.renderChoices();
    let footer = await this.footer();

    if (output) prompt += output;
    if (help && !prompt.includes(help)) prompt += ' ' + help;

    if (submitted && !output && !body.trim() && this.multiple && this.emptyError != null) {
      prompt += this.styles.danger(this.emptyError);
    }

    this.clear(size);
    this.write([header, prompt + body, footer].filter(Boolean).join('\n'));
    this.restore();
  }
}

module.exports = SelectPrompt;
