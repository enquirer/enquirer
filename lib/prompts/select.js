'use strict';

const ansi = require('../style/ansi');
const ArrayPrompt = require('../types/array');

class Select extends ArrayPrompt {
  constructor(options) {
    super({ multiple: false, ...options });
    this.state.hint = this.state.hint || 'Use arrow keys, <return> to submit.';
  }

  renderChoice(choice, i) {
    let hint = choice.hint ? this.styles.hint(choice.hint) : '';
    let focused = this.index === i;
    let pointer = this.element('pointer', focused ? 'on' : 'off', choice);
    let message = choice.message;
    let render = () => [pointer, message, hint].filter(Boolean).join(' ');

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
      message = this.styles.active(message);
      choice.enabled = true;
    }

    return render();
  }

  renderChoices() {
    if (this.closed) return '';
    return '\n' + this.visible.map(this.renderChoice.bind(this)).join('\n');
  }

  answer() {
    return this.answered ? this.styles.answered(this.focused.value) : '';
  }

  async render() {
    this.clear();
    this.write(ansi.cursor.hide);

    let prefix = this.element('prefix');
    let message = this.element('message');
    let separator = this.element('separator');
    let hint = this.element('hint');

    let prompt = [prefix, message, separator];

    this.write(prompt.filter(Boolean).join(' ') + ' ');
    this.write([this.answer(), hint].filter(Boolean).join(' '));
    this.write(await this.renderChoices());
  }
}

module.exports = Select;
