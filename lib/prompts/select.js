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

  indicator(item, i) {
    return this.multiple ? super.indicator(item, i) : '';
  }

  pointer(item, i) {
    return (!this.multiple || this.options.pointer) ? super.pointer(item, i) : '';
  }

  heading(msg, item, i) {
    return this.styles.strong(msg);
  }

  async renderChoice(item, i) {
    // await this.onChoice(item, i);

    let focused = this.index === i;
    let pointer = await this.pointer(item, i);
    let check = await this.indicator(item, i) + (item.pad || '');
    let hint = await item.hint;

    if (hint && !utils.hasColor(hint)) {
      hint = this.styles.muted(hint);
    }

    let ind = this.indent(item);
    let msg = await this.resolve(item.message, this.state, item, i);
    let line = () => [ind + pointer + check, msg, hint].filter(Boolean).join(' ');

    if (item.role === 'heading') {
      msg = this.heading(msg, item, i);
      return line();
    }

    if (item.disabled) {
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
    return visible.join('\n');
  }

  format() {
    if (!this.state.submitted) return this.styles.muted(this.state.hint);
    if (Array.isArray(this.selected)) {
      return this.selected.map(item => this.styles.primary(item.name)).join(', ');
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
      prompt = [prefix, message, separator].filter(Boolean).join(' ');
      this.state.prompt = prompt;
    }

    let header = await this.header();
    let output = await this.format();
    let help = await this.error() || await this.hint();
    let body = await this.renderChoices();
    let footer = await this.footer();

    if (output || !help) prompt += ' ' + output;
    if (help && !prompt.includes(help)) prompt += ' ' + help;

    if (submitted && !output && !body && this.multiple && this.emptyError != null) {
      prompt += this.styles.danger(this.emptyError);
    }

    this.clear(size);
    this.write([header, prompt, body, footer].filter(Boolean).join('\n'));
    this.restore();
  }
}

module.exports = SelectPrompt;
