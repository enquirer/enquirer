'use strict';

const roles = {
  option(prompt, choice) {
    return choice;
  },
  separator(prompt, choice) {
    choice.disabled = '';
    choice.indicator = [choice.indicator, ' '].find(v => v != null);
    choice.message = choice.message || prompt.symbols.line.repeat(5);
    return choice;
  },
  heading(prompt, choice) {
    return choice;
  },
  spacer(prompt, choice) {
    return choice;
  }
};

module.exports = name => roles[name] || roles.option;
