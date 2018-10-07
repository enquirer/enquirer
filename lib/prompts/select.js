'use strict';

const ArrayPrompt = require('../types/array');
const { first } = require('../utils');

class SelectPrompt extends ArrayPrompt {
  constructor(options) {
    super({ multiple: false, ...options });
    this.state.hint = first([this.options.hint, '(Use arrow keys, <return> to submit)']);
    this.initial = first([this.options.initial, 0]);
    this.cursorHide();
  }

  async reset() {
    await super.reset();
    let initial = this.find(this.initial || 0);
    let { index, autofocus } = this.options;
    this.index = first('number', [autofocus, index, initial ? initial.index : 0]);
  }

  pointer(choice, i) {
    return this.element('pointer', this.state, this.index === i ? 'on' : 'off', choice);
  }

  indicator(choice, i) {
    return '';
  }

  isValue(value) {
    return !!value && typeof value !== 'number';
  }

  renderChoice(choice, i) {
    let hint = this.styles.muted(choice.hint);
    let pointer = this.pointer(choice, i);
    let indicator = this.indicator(choice, i);
    let focused = this.index === i;
    let message = choice.message;
    let render = () => [pointer + indicator, message, hint].filter(Boolean).join(' ');

    if (choice.disabled) {
      message = this.styles.disabled(message);
      return render();
    }

    if (focused && this.multiple) {
      message = this.styles.selected(message);
      return render();
    }

    if (focused && !this.multiple) {
      pointer = this.styles.active(pointer);
      this.enable(choice, i);
      if (!indicator) {
        message = this.styles.active(message);
      }
    }

    return render();
  }

  renderChoices() {
    let visible = this.visible.map(this.renderChoice.bind(this)).join('\n');
    return '\n' + (visible || this.styles.danger('No choices available.'));
  }

  body() {
    return !this.answered && this.renderChoices();
  }

  footer() {
    if (!this.answered && !this.state.footer && this.choices.length > this.limit) {
      return super.footer(this.styles.muted('(Move up and down to reveal more choices)'));
    }
    return super.footer();
  }

  async render() {
    this.clear();

    let prompt = [
      this.element('prefix'),
      this.element('message'),
      this.element('separator'),
      await this.format(),
      this.error() || this.hint()
    ];

    this.write(this.header());
    this.write(prompt.filter(Boolean).join(' '));
    this.write(this.body());
    this.write(this.footer());
    this.write(this.resetCursor());
  }
}

module.exports = SelectPrompt;
