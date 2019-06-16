'use strict';

const utils = require('./utils');

const roles = {
  default(prompt, choice) {
    return choice;
  },
  checkbox(prompt, choice) {
    throw new Error('checkbox role is not implemented yet');
  },
  editable(prompt, choice) {
    throw new Error('editable role is not implemented yet');
  },
  expandable(prompt, choice) {
    throw new Error('expandable role is not implemented yet');
  },
  heading(prompt, choice) {
    choice.disabled = '';
    choice.indicator = [choice.indicator, ' '].find(v => v != null);
    choice.message = prompt.styles.heading(choice.message || '');
    return choice;
  },
  input(prompt, choice) {
    throw new Error('input role is not implemented yet');
  },
  option(prompt, choice) {
    return roles.default(prompt, choice);
  },
  radio(prompt, choice) {
    throw new Error('radio role is not implemented yet');
  },
  separator(prompt, choice) {
    if (typeof choice.line === 'number') {
      choice.line = prompt.styles.muted(prompt.symbols.line.repeat(choice.line));
    }
    choice.disabled = '';
    choice.indicator = [choice.indicator, ' '].find(v => v != null);
    choice.message = choice.message || choice.line || prompt.symbols.line.repeat(5);
    if (!utils.hasColor(choice.message)) {
      choice.message = prompt.styles.muted(choice.message);
    }
    return choice;
  },
  spacer(prompt, choice) {
    return choice;
  }
};

module.exports = (name, options = {}) => {
  let role = utils.merge({}, roles, options.roles);
  return role[name] || role.default;
};
