'use strict';

const symbols = require('../style/symbols');
const Select = require('./select');

class MultiSelect extends Select {
  constructor(options) {
    super({ ...options, multiple: true });
  }

  space(choice = this.current) {
    this.toggle(choice);
    this.render();
  }

  toggle(choice = this.current) {
    choice.enabled = !choice.enabled;
    choice.choices && choice.choices.forEach(this.toggle.bind(this));
  }

  enable(choice = this.current) {
    choice.enabled = true;
    choice.choices && choice.choices.forEach(this.enable);
  }

  isEnabled(choice = this.current) {
    return choice.choices ? choice.choices.every(this.isEnabled.bind(this)) : choice.enabled;
  }

  renderChoice(choice, i) {
    let { on, off } = this.styles;
    choice.prefix = choice.enabled ? on(symbols.check) : off(symbols.check);
    return super.renderChoice(choice, i);
  }

  submit() {
    this.state.value = this.filter(ch => ch.enabled);
    return super.submit();
  }
}

module.exports = MultiSelect;
