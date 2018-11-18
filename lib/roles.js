'use strict';

const utils = require('./utils');

const roles = {
  default(prompt, choice) {
    return choice;
  },
  option(prompt, choice) {
    return roles.default(prompt, choice);
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

module.exports = (name, options = {}) => {
  let obj = utils.merge({}, roles, options.roles);
  return obj[name] || obj.option;
};
