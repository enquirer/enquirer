'use strict';

const colors = require('ansi-colors');
const ArrayPrompt = require('../types/array');

class SelectPrompt extends ArrayPrompt {
  constructor(options) {
    super(options);
    this.defaults({ hint: '- Use arrow-keys, <return> to submit.' });
  }

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
    return !this.options.multiple ? super.pointer(choice, i) : '';
  }

  async renderChoice(choice, i) {
    await super.onChoice(choice, i);

    let hint = choice.hint ? this.styles.muted(choice.hint) : '';
    let pointer = this.pointer(choice, i);
    let indicator = this.indicator(choice, i);
    let focused = this.index === i;
    let message = choice.message;
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
    let choices = await Promise.all(this.visible.map(async(ch, i) => await this.renderChoice(ch, i)));
    if (!choices.length) choices.push(this.styles.danger('No matching choices'));
    return choices.join('\n');
  }

  format() {
    let { state, styles, selected } = this;
    let style = state.submitted ? styles.primary : styles.muted;
    if (!state.submitted) return style(state.hint);
    if (Array.isArray(selected)) {
      return selected.map(choice => style(choice.name)).join(', ');
    }
    return style(selected.name);
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
