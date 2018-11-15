'use strict';

const colors = require('ansi-colors');
const hSelect = require('./hselect');

class hMultiSelect extends hSelect {
  constructor(options) {
    super({ ...options, multiple: true });
  }

  async choiceMessage(choice, i) {
    let msg = await super.choiceMessage(choice, i);
    if (choice.enabled) {
      msg = this.styles.success(colors.unstyle(msg));
      if (this.index === i) msg = colors.underline(msg);
    }
    return msg;
  }
}

module.exports = hMultiSelect;
