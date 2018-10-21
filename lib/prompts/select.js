'use strict';

const colors = require('ansi-colors');
const ArrayPrompt = require('../types/array');
const hasColor = str => /\u001b\[\d+m/.test(str);

class SelectPrompt extends ArrayPrompt {
  async dispatch(s, key) {
    if (this.options.multiple) {
      this[key.name] ? await this[key.name](s, key) : await super.dispatch(s, key);
    } else {
      this.alert();
    }
  }

  indicator(choice, i) {
    return this.options.multiple ? super.indicator(choice, i) : '';
  }

  pointer(choice, i) {
    return (!this.options.multiple || this.options.pointer) ? super.pointer(choice, i) : '';
  }

  async renderChoice(choice, i) {
    await super.onChoice(choice, i);

    let pad = choice.pad || '';
    let pointer = await this.pointer(choice, i);
    let indicator = await this.indicator(choice, i) + pad;
    let hint = await choice.hint;

    if (!hasColor(hint)) {
      hint = this.styles.muted(hint);
    }

    let focused = this.index === i;
    let message = await this.resolve(choice.message, this.state, choice, i);

    let render = () => [pointer + indicator, message, hint].filter(Boolean).join(' ');

    if (choice.disabled) {
      indicator = ' '.repeat(colors.unstyle(indicator).length);
      message = this.styles.disabled(message);
      return render();
    }

    if (focused) {
      message = this.styles.em(message);

      if (!this.options.multiple) {
        this.enable(choice, i);
      }
    }
    return render();
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
      return this.selected.map(choice => this.styles.primary(choice.name)).join(', ');
    }
    return this.styles.primary(this.selected.name);
  }

  async render() {
    let { message, submitted, size } = this.state;

    let prefix = await this.prefix();
    let separator = await this.separator();

    let prompt = [prefix, message, separator].filter(Boolean).join(' ');
    this.state.prompt = prompt;

    let header = await this.header();
    let input = await this.format();
    let choices = await this.renderChoices();
    let footer = await this.footer();

    prompt += ' ' + input;

    if (submitted && this.options.multiple && !input && !choices) {
      prompt += this.styles.danger('No choices were selected');
    }

    this.clear(size);
    this.write([header, prompt, choices, footer].filter(Boolean).join('\n'));
    this.restore();
  }
}

module.exports = SelectPrompt;
