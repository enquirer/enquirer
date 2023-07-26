'use strict';

const colors = require('ansi-colors');
const HorizontalSelect = require('./HorizontalSelect');

class HorizontalMultiSelect extends HorizontalSelect {
  constructor(options) {
    super({ ...options, multiple: true });
  }

  async choiceMessage(choice, index) {
    let msg = await super.choiceMessage(choice, index);

    if (choice.enabled) {
      msg = this.styles.success(colors.unstyle(msg));

      if (this.index === index) {
        msg = colors.underline(msg);
      }
    }

    return msg;
  }
}

module.exports = HorizontalMultiSelect;
