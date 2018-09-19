'use strict';

const symbols = require('../style/symbols');
const Select = require('./select');

class MultiSelect extends Select {
  dispatch(ch) {
    if (!ch) return this.alert();

    if (ch === 'g') {
      let choice = this.selected;
      if (choice.parent && !choice.choices) choice = choice.parent;
      this.toggle(choice);
    }

    if (ch === 'a') {
      let enabled = this.isEnabled(this.state);
      this.each(ch => (ch.enabled = !enabled));
    }

    if (ch === 'i') {
      if (this.maxChoices < this.length) return this.alert();
      this.each(this.toggle.bind(this));
    }

    this.render();
  }

  space() {
    this.toggle(this.selected);
    this.render();
  }

  toggle(choice) {
    choice.enabled = !choice.enabled;
    choice.choices && choice.choices.forEach(this.toggle.bind(this));
  }

  enable(choice) {
    choice.enabled = true;
    choice.choices && choice.choices.forEach(this.enable);
  }

  isEnabled(choice) {
    return choice.choices ? choice.choices.every(this.isEnabled) : choice.enabled;
  }

  renderChoice(choice, i) {
    let { on, off } = this.styles;
    choice.prefix = choice.enabled ? on(symbols.check) : off(symbols.check);
    return super.renderChoice(choice, i);
  }

  submit() {
    this.state.value = this.state.choices.filter(ch => ch.enabled);
    return super.submit();
  }
}

module.exports = MultiSelect;
