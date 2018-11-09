'use strict';

const Select = require('./select');

class hSelect extends Select {
  right() {
    return this.down();
  }

  left() {
    return this.up();
  }

  pointer() {
    return '';
  }

  async renderChoices() {
    if (this.state.submitted) return ' ';
    let sep = this.options.sep || ` ${this.styles.muted(this.symbols.middot)} `;
    let choices = this.visible.map(async(ch, i) => await this.renderChoice(ch, i));
    let visible = await Promise.all(choices);
    return visible.join(sep);
  }
}

module.exports = hSelect;
