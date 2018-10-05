'use strict';

const HorizontalList = require('./horizontal-list');

class MultiList extends HorizontalList {
  constructor(options) {
    super({ ...options, multiple: true });
  }

  dispatch(input) {
    let toggle = choice => (choice.enabled = !choice.enabled);
    if (input === ' ') toggle(this.choices[this.index]);
    if (input === 'i') this.choices.forEach(toggle);
    if (input === 'a') {
      let enabled = this.choices.every(choice => choice.enabled);
      this.choices.forEach(choice => (choice.enabled = !enabled));
    }
    this.render();
  }

  renderChoice(choice, i) {
    let ele = super.renderChoice(choice, i);
    return choice.enabled ? this.styles.selected(ele) : ele;
  }

  get selected() {
    return this.choices.filter(choice => choice.enabled).map(choice => choice.value);
  }
}

module.exports = MultiList;
